export class AudioEngine {
  private context: AudioContext;
  private source: AudioBufferSourceNode | null = null;
  private analyticsNode: AnalyserNode;
  private gainNode: GainNode;
  private playbackStartTime = 0;
  private pausedTime = 0;
  private isActivePlayback = false;

  constructor() {
    this.context = this.createAudioContext();
    this.analyticsNode = this.context.createAnalyser();
    this.gainNode = this.context.createGain();
    this.configureNodes();
  }

  private createAudioContext(): AudioContext {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
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

  async loadTrack(url: string): Promise<boolean> {
    try {
      const buffer = await this.fetchAndDecodeAudio(url);
      this.recreateSourceNode(buffer);
      return true;
    } catch (error) {
      console.error("Audio loading failed:", error);
      return false;
    }
  }

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
    if (!this.source?.buffer) throw new Error("No track loaded");

    if (this.isActivePlayback) {
      this.stop();
    }

    this.source.start(0, this.pausedTime % this.source.buffer.duration);
    this.playbackStartTime = this.context.currentTime - this.pausedTime;
    this.isActivePlayback = true;

    this.resumeContext();
  }

  stop(): void {
    if (this.source) {
      this.source.stop(0);
      this.pausedTime = 0;
      this.isActivePlayback = false;
    }
  }

  pause(): void {
    if (this.isActivePlayback) {
      this.pausedTime = this.context.currentTime - this.playbackStartTime;
      this.source?.stop(0);
      this.isActivePlayback = false;
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

  private handlePlaybackEnd(): void {
    this.isActivePlayback = false;
    this.pausedTime = 0;
    this.playbackStartTime = 0;
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
      dynamicRange: Math.max(...data) - Math.min(...data),
      frequencySpread: this.calculateFrequencySpread(data),
    };
  }

  private calculateFrequencySpread(data: Uint8Array): number {
    const midPoint = Math.floor(data.length / 2);
    const lows = data.slice(0, midPoint).reduce((a, b) => a + b);
    const highs = data.slice(midPoint).reduce((a, b) => a + b);
    return highs / (lows + highs);
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
