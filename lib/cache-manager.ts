interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export class CacheManager {
  private static cache: Map<string, CacheItem<any>> = new Map();
  private static CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

  static set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  static get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }
}
