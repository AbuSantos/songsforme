import { NetworkDetector } from "@/utils/network-detector";
import { AudioEngine } from "./audio-engine";

export class QualityManager {
  private currentQuality: string = "320k";
  private manualOverride: string | null = null;
  private onlineHandler: any = null;

  private qualityMap: Record<string, string> = {
    "64k": "/audio/low",
    "128k": "/audio/medium",
    "320k": "/audio/high",
    lossless: "/audio/flac",
  };

  async getOptimalURL(baseUrl: string) {
    try {
      if (this.manualOverride) {
        return this.qualityToURL(baseUrl, this.manualOverride);
      }

      const quality = await NetworkDetector.selectBitrate();
      this.currentQuality = quality;
      return this.qualityToURL(baseUrl, quality);
    } catch (error) {
      console.error("Error selecting bitrate:", error);
      return this.qualityToURL(baseUrl, "64k"); // Fallback
    }
  }

  private qualityToURL(url: string, quality: string) {
    return `${url}?quality=${quality}`;
  }

  initDynamicSwitching(engine: AudioEngine, baseUrl: string) {
    if (this.onlineHandler) {
      window.removeEventListener("online", this.onlineHandler);
    }

    this.onlineHandler = async () => {
      const newUrl = await this.getOptimalURL(baseUrl);
      engine.loadTrack(newUrl);
    };

    window.addEventListener("online", this.onlineHandler);
    window.addEventListener("offline", () => {
      console.warn("Network disconnected. Switching to lowest quality.");
      engine.loadTrack(this.qualityToURL(baseUrl, "64k"));
    });
  }

  setManualQuality(quality: string) {
    if (this.qualityMap[quality]) {
      this.manualOverride = quality;
    } else {
      console.warn("Invalid quality setting:", quality);
    }
  }
}
