import { currentPlaybackState } from "@/atoms/song-atom";
import { useSetRecoilState } from "recoil";

export class AudioEngine {
  private context: AudioContext;
  private source: AudioBufferSourceNode | null = null;
  private analyticsNode: AnalyserNode;
  private gainNode: GainNode;
  private playbackStartTime = 0;
  private pausedTime = 0;
  private isActivePlayback = false;
  private currentSource: AudioBufferSourceNode | null = null;
  private static instance: AudioEngine | null = null;
  private onEndedCallback?: () => void;
  private onPlayCallback?: () => void;
  private onPauseCallback?: () => void;
  private setIsPlaying: (value: boolean) => void = () => {};
  private playbackStateCallback?: (state: {
    isPlaying: boolean;
    trackId?: string;
  }) => void;
  public currentTrackId: string | null = null;

  constructor() {
    this.context = this.createAudioContext();
    this.analyticsNode = this.context.createAnalyser();
    this.gainNode = this.context.createGain();
    this.configureNodes();
  }

  setOnPlayCallback(cb: (() => void) | undefined) {
    this.onPlayCallback = cb;
  }
  setOnPauseCallback(cb: (() => void) | undefined) {
    this.onPauseCallback = cb;
  }
  setOnEndedCallback(cb: (() => void) | undefined) {
    this.onEndedCallback = cb;
  }

  private createAudioContext(): AudioContext {
    // if (typeof window === "undefined") {
    //   throw new Error("AudioContext cannot be created on the server");
    // }

    const ctx = new ((window as any).AudioContext ||
      (window as any).webkitAudioContext)();
    ctx.addEventListener("statechange", () =>
      console.debug("AudioContext state:", ctx.state)
    );
    
    return ctx;
  }

  private configureNodes(): void {
    this.analyticsNode.fftSize = 2048;
    this.analyticsNode.smoothingTimeConstant = 0.85;
    this.gainNode.gain.value = 1.0;
    this.connectNodes();
  }

  private connectNodes(): void {
    this.analyticsNode.connect(this.gainNode);
    this.gainNode.connect(this.context.destination);
  }

  async loadTrack(url: string, trackId: string): Promise<boolean> {
    try {
      const buffer = await this.fetchAndDecodeAudio(url);
      this.recreateSourceNode(buffer);
      this.currentTrackId = trackId;
      return true;
    } catch (error) {
      console.error("Audio loading failed:", error);
      return false;
    }
  }

  private onPlaybackEnd = () => {};

  private async fetchAndDecodeAudio(url: string): Promise<AudioBuffer> {
    const response = await fetch(url);

    if (!response.ok)
      throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    return this.context.decodeAudioData(await response.arrayBuffer());
  }

  private recreateSourceNode(buffer: AudioBuffer): void {
    this.source?.disconnect();
    this.source = this.context.createBufferSource();
    this.source.buffer = buffer;
    this.source.connect(this.analyticsNode);
    this.source.onended = () => this.handlePlaybackEnd();
  }

  play(): void {
    if (!this.source?.buffer) throw new Error("Track is loading...");

    // Clean up previous playback
    if (this.isActivePlayback) {
      this.stop();
    }

    // Create fresh source node
    this.currentSource = this.context.createBufferSource();
    this.currentSource.buffer = this.source.buffer;
    this.currentSource.connect(this.analyticsNode);

    // Set up clean termination
    this.currentSource.onended = () => {
      this.handlePlaybackEnd();
      this.currentSource = null;
    };

    // Calculate start offset for pause/resume
    const startOffset = this.pausedTime % this.source.buffer.duration;

    try {
      this.currentSource.start(0, startOffset);
      this.playbackStartTime = this.context.currentTime - startOffset;
      this.isActivePlayback = true;

      this.resumeContext();
    } catch (error) {
      console.error("Playback start failed:", error);
      this.currentSource = null;
      this.isActivePlayback = false;
      throw error;
    }

    this.onPlayCallback?.();
    this.setIsPlaying?.(true);

    if (this.playbackStateCallback) {
      this.playbackStateCallback({
        isPlaying: true,
        //@ts-ignore
        trackId: this.currentTrackId,
      });
    }
  }

  stop(): void {
    if (this.currentSource) {
      try {
        this.currentSource.stop(0);
      } catch (error) {
        console.warn("Stop failed (already stopped):", error);
      }
      this.currentSource.disconnect();
      this.currentSource = null;
    }
    this.pausedTime = 0;
    this.isActivePlayback = false;
  }

  pause(): void {
    if (this.isActivePlayback && this.currentSource) {
      this.pausedTime = this.context.currentTime - this.playbackStartTime;
      try {
        this.currentSource.stop(0);
      } catch (error) {
        console.warn("Pause stop failed:", error);
      }
      this.currentSource = null;
      this.isActivePlayback = false;
      this.onPauseCallback?.();
      this.setIsPlaying?.(false);
    }
  }

  resumeContext(): Promise<void> {
    return this.context.state === "suspended"
      ? this.context.resume()
      : Promise.resolve();
  }

  // Enhanced validation system
  async validatePlayback(): Promise<{ isValid: boolean; reasons: string[] }> {
    const checks = await Promise.all([
      this.checkVolumeLevel(),
      this.checkContextActivity(),
      this.checkPlaybackProgress(),
    ]);

    return {
      isValid: checks.every((c) => c.valid),
      reasons: checks.filter((c) => !c.valid).flatMap((c) => c.reasons),
    };
  }

  private async checkVolumeLevel(): Promise<{
    valid: boolean;
    reasons: string[];
  }> {
    const avgVolume = await this.getAverageVolume();
    return {
      valid: avgVolume > 0.15,
      reasons: avgVolume <= 0.15 ? ["Insufficient volume detected"] : [],
    };
  }

  private checkContextActivity(): { valid: boolean; reasons: string[] } {
    return {
      valid: this.context.state === "running",
      reasons:
        this.context.state !== "running" ? ["Audio context suspended"] : [],
    };
  }

  private checkPlaybackProgress(): { valid: boolean; reasons: string[] } {
    const expectedProgress = this.context.currentTime - this.playbackStartTime;
    const actualProgress = this.pausedTime;
    const drift = Math.abs(expectedProgress - actualProgress);

    return {
      valid: drift < 0.5,
      reasons: drift >= 0.5 ? ["Playback timing anomaly detected"] : [],
    };
  }

  getAverageVolume(): number {
    const dataArray = new Uint8Array(this.analyticsNode.frequencyBinCount);
    this.analyticsNode.getByteFrequencyData(dataArray);
    return (
      dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length / 255
    );
  }

  public setPlaybackStateCallback(
    callback: (state: { isPlaying: boolean }) => void
  ) {
    this.playbackStateCallback = callback;
  }

  private handlePlaybackEnd(): void {
    this.isActivePlayback = false;
    this.pausedTime = 0;
    this.playbackStartTime = 0;

    if (this.onEndedCallback) {
      this.onEndedCallback();
    }

    // Use the callback instead of direct Recoil access
    if (this.playbackStateCallback) {
      this.playbackStateCallback({ isPlaying: false });
    }
  }

  // Additional features
  getPlaybackState() {
    return {
      currentTime: this.context.currentTime - this.playbackStartTime,
      duration: this.source?.buffer?.duration || 0,
      volume: this.gainNode.gain.value,
      isPlaying: this.isActivePlayback,
      qualityMetrics: this.getQualityMetrics(),
    };
  }

  private getQualityMetrics() {
    const data = new Uint8Array(this.analyticsNode.frequencyBinCount);
    this.analyticsNode.getByteFrequencyData(data);
    return {
      dynamicRange:
        Math.max(...Array.from(data)) - Math.min(...Array.from(data)),
      frequencySpread: this.calculateFrequencySpread(data),
    };
  }

  private calculateFrequencySpread(data: Uint8Array): number {
    const midPoint = Math.floor(data.length / 2);
    const lows = data.slice(0, midPoint).reduce((a, b) => a + b);
    const highs = data.slice(midPoint).reduce((a, b) => a + b);
    return highs / (lows + highs);
  }

  private handleError(error: Error) {
    console.error("AudioEngine error:", error);
    this.setIsPlaying?.(false);
  }

  public static getInstance(setIsPlaying?: (value: boolean) => void) {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }

    if (setIsPlaying) {
      AudioEngine.instance.setIsPlaying = setIsPlaying;
    }

    return AudioEngine.instance;
  }

  isTrackLoaded(): boolean {
    return !!this.source?.buffer;
  }

  // Cleanup method
  destroy(): void {
    this.stop();
    this.source?.disconnect();
    this.analyticsNode.disconnect();
    this.gainNode.disconnect();
    this.context.close();
  }
}
