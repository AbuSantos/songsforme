const CACHE_NAME = "audio-cache-v3"; // Name of the cache
const MAX_CACHE_SIZE_MB = 100; // Maximum cache size in MB

class CacheManager {
  /**
   * Calculates the total size of the cache.
   * @returns {Promise<number>} Total cache size in bytes.
   */
  static async getCacheSize() {
    const cache = await caches.open(CACHE_NAME); // Open the cache
    const keys = await cache.keys(); // Get all cached requests

    let totalSize = 0;
    for (const request of keys) {
      const response = await cache.match(request); // Get cached response
      if (response) {
        const blob = await response.blob(); // Convert response to Blob to get size
        totalSize += blob.size;
      }
    }

    return totalSize;
  }

  /**
   * Removes the oldest cached files until the total size is within the specified limit.
   * @param {number} maxSizeMB - Maximum cache size in MB.
   */

  static async clearOldestFiles(maxSizeMB: number) {
    const cache = await caches.open(CACHE_NAME); // Open the cache
    const keys = await cache.keys(); // Get all cached requests

    // Create metadata for each cached file
    const files = await Promise.all(
      keys.map(async (request) => {
        const response = await cache.match(request);
        const blob = await response?.blob();
        return {
          request,
          size: blob?.size || 0,
          lastUsed: new Date(response?.headers.get("last-used") || Date.now()), // Use "last-used" header or current date
        };
      })
    );

    // Sort files by last-used date (oldest first)
    files.sort((a, b) => a.lastUsed.getTime() - b.lastUsed.getTime());

    let currentSize = files.reduce((sum, file) => sum + file.size, 0); // Calculate total size
    while (currentSize > maxSizeMB * 1024 * 1024 && files.length > 0) {
      const oldest = files.shift(); // Remove the oldest file
      if (oldest) {
        await cache.delete(oldest.request); // Delete from cache
        currentSize -= oldest.size; // Update current size
        console.log(`Deleted oldest file: ${oldest.request.url}`);
      }
    }
  }
}
