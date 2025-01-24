import { NetworkDetector } from "@/utils/network-detector";
import { AudioEngine } from "./audio-engine";

export class QualityManager {
    private currentQuality: string = '320k';
    private qualityMap: Record<string, string> = {
      '64k': '/audio/low',
      '128k': '/audio/medium',
      '320k': '/audio/high',
      'lossless': '/audio/flac'
    };
  
    async getOptimalURL() {
      const targetQuality = await NetworkDetector.selectBitrate();
      this.currentQuality = targetQuality;
      return this.qualityMap[targetQuality];
    }
  
    dynamicSwitch(engine: AudioEngine) {
      window.addEventListener('online', async () => {
        const newQuality = await NetworkDetector.selectBitrate();
        if (newQuality !== this.currentQuality) {
          engine.loadTrack(await this.getOptimalURL());
        }
      });
    }
  }