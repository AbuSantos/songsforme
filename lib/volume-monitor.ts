import { AudioEngine } from "./audio-engine";

export class VolumeMonitor {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: MediaElementAudioSourceNode | null = null;
  private dataArray: Uint8Array | null = null;

  constructor() {
    if (typeof window !== "undefined" && window.AudioContext) {
      this.audioContext = new AudioContext();
    }
  }

  /**
   * Initialize the VolumeMonitor with an audio element.
   * @param audioElement - The audio element to monitor.
   */
  public init(audioElement: HTMLAudioElement) {
    if (!this.audioContext) throw new Error("AudioContext not supported.");

    this.analyser = this.audioContext.createAnalyser();
    this.source = this.audioContext.createMediaElementSource(audioElement);
    this.source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);

    this.analyser.fftSize = 256; // Frequency data size
    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);
  }

  /**
   * Get the average volume of the audio playback.
   */
  public getVolumeLevel(): number {
    if (!this.analyser || !this.dataArray) return 0;

    this.analyser.getByteFrequencyData(this.dataArray);

    // Calculate average volume level
    const sum = this.dataArray.reduce((a, b) => a + b, 0);
    return sum / this.dataArray.length;
  }

  /**
   * Validate the listening session by checking if the volume level is above the threshold.
   * @param threshold - The minimum volume level required to validate playback.
   */
  public static async validateListeningSession(
    engineRef: React.MutableRefObject<AudioEngine>,
    threshold = 10
  ) {
    const engine = engineRef.current;

    //@ts-ignore
    if (!engine.audioElement) {
      console.warn("No audio element found in AudioEngine.");
      return false;
    }

    const volumeMonitor = new VolumeMonitor();
    //@ts-ignore
    volumeMonitor.init(engine.audioElement);

    const currentVolume = volumeMonitor.getVolumeLevel();
    console.log("Current Volume:", currentVolume);

    return currentVolume >= threshold;
  }
}
