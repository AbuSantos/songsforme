import { AudioEngine } from "./audio-engine";

export class VolumeMonitor {
  public static async validateListeningSession(
    engineRef: React.MutableRefObject<AudioEngine>,
    minVolume = 0.1 // 10% minimum volume
  ) {
    const engine = engineRef.current;

    //@ts-ignore
    const audioElement = engine.audioElement;
    if (!audioElement) {
      console.warn("No audio element found in AudioEngine.");
      return false;
    }

    // Check if audio is muted or volume is too low
    const isMuted = audioElement.muted;
    const volume = audioElement.volume;
    const isPlaying = !audioElement.paused;

    console.log({
      volume,
      isMuted,
      isPlaying,
      minVolume,
    });

    return isPlaying && !isMuted && volume >= minVolume;
  }
}
