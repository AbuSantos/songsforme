import { toast } from "sonner";

// lib/playtime-tracker.ts
export class PlaytimeTracker {
    private startTime: number = 0;
    private totalPlayed: number = 0;
    private isBackground = false;
  
    constructor() {
      document.addEventListener('visibilitychange', () => {
        this.isBackground = document.visibilityState === 'hidden';
      });
    }
  
    start() {
      this.startTime = Date.now();
      this.registerActivityChecks();
    }
  
    stop() {
      if (this.startTime > 0) {
        this.totalPlayed += Date.now() - this.startTime;
        this.startTime = 0;
      }
    }
  
    private registerActivityChecks() {
      const checkInterval = setInterval(() => {
        if (this.isBackground) {
          this.stop();
          clearInterval(checkInterval);
          toast.warning('Background play paused for reward validity');
        }
      }, 5000);
    }
  
    getValidPlaytime() {
      return Math.floor(this.totalPlayed / 1000);
    }
  }