import { toast } from "sonner";
import { AudioEngine } from "./audio-engine";

export class VolumeMonitor {
  /**
   * Calculate the average volume from an AnalyserNode.
   * @param analyser The AnalyserNode to get audio data from.
   * @returns The average volume (normalized between 0 and 1).
   */
  static getAverageVolume(analyser: AnalyserNode): number {
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);

    // Calculate average volume
    const total = dataArray.reduce((acc, val) => acc + val, 0);
    return total / (dataArray.length * 255); // Normalize to range [0, 1]
  }

  /**
   * Validate a listening session by monitoring average volume.
   * Pauses playback if volume falls below a threshold.
   * @param engine The AudioEngine instance to monitor.
   */
  static validateListeningSession(engine: AudioEngine) {
    const validationInterval = setInterval(() => {
      const analyser = engine.getAnalyserNode();

      if (!analyser) {
        console.error("No AnalyserNode available in the audio engine.");
        clearInterval(validationInterval);
        return;
      }

      const avgVolume = this.getAverageVolume(analyser);

      if (avgVolume < 0.1) {
        engine.pause();
        toast("Playback paused - insufficient volume detected");
        clearInterval(validationInterval);
      }
    }, 10000);
  }
}
