import { NetworkDetector } from "@/utils/network-detector";
import { AudioEngine } from "./audio-engine";

export class QualityManager {
  private currentQuality: string = "320k";

  private qualityMap: Record<string, string> = {
    "64k": "/audio/low",
    "128k": "/audio/medium",
    "320k": "/audio/high",
    lossless: "/audio/flac",
  };

  //   async getOptimalURL() {
  //     const targetQuality = await NetworkDetector.selectBitrate();
  //     this.currentQuality = targetQuality;
  //     return this.qualityMap[targetQuality];
  //   }
  async getOptimalURL(baseUrl: string) {
    const quality = await NetworkDetector.selectBitrate();
    this.currentQuality = quality;
    return this.qualityToURL(baseUrl, quality);
  }
  private qualityToURL(url: string, quality: string) {
    // Implement your quality URL resolution logic
    return `${url}?quality=${quality}`;
  }

  //   dynamicSwitch(engine: AudioEngine) {
  //     window.addEventListener("online", async () => {
  //       const newQuality = await NetworkDetector.selectBitrate();
  //       if (newQuality !== this.currentQuality) {
  //         engine.loadTrack(await this.getOptimalURL());
  //       }
  //     });
  //   }

  initDynamicSwitching(engine: AudioEngine, baseUrl: string) {
    window.addEventListener("online", async () => {
      const newUrl = await this.getOptimalURL(baseUrl);
      engine.loadTrack(newUrl);
    });
  }
}
