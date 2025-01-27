
import CacheManager from "./cache-manager.js"; // Import the CacheManager class
// List of critical assets to pre-cache
const PRECACHE_ASSETS = [
  "/audio-core.wasm", // WebAssembly file for audio processing
  "/hrtf-48000.bin", // Binary data for 3D audio rendering
  "/fallback-audio.mp3", // Fallback audio file in case of errors
];

/**
 * CacheManager Class
 * Provides methods to manage cache size and remove the oldest files if necessary.
 */

/**
 * Install Event
 * Pre-caches critical assets during the installation phase.
 */

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME) // Open the cache
      .then((cache) => {
        console.log("Pre-caching critical assets");
        return cache.addAll(PRECACHE_ASSETS); // Add assets to the cache
      })
      .then(() => self.skipWaiting()) // Activate service worker immediately
  );
});

/**
 * Activate Event
 * Cleans up old caches during activation.
 */

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              console.log("Deleting old cache:", cache);
              return caches.delete(cache); // Delete outdated caches
            }
          })
        )
      )
      .then(() => self.clients.claim()) // Take control of all open clients
  );
});

/**
 * Fetch Event
 * Handles fetch requests with different caching strategies.
 */

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Network-first strategy for audio files
  if (url.pathname.startsWith("/audio/")) {
    event.respondWith(networkFirstWithTimeout(event.request, 2000));
  }
  // Cache-first strategy for pre-cached assets
  else if (PRECACHE_ASSETS.includes(url.pathname)) {
    event.respondWith(cacheFirst(event.request));
  }
});

/**
 * Network-first strategy with a timeout.
 * Fetches from the network with a fallback to cache if the network fails.
 * @param {Request} request - The request to fetch.
 * @param {number} timeout - The timeout duration in milliseconds.
 * @returns {Promise<Response>} The network or cached response.
 */
async function networkFirstWithTimeout(request, timeout) {
  const cache = await caches.open(CACHE_NAME); // Open the cache

  try {
    // Fetch the request with a timeout
    const response = await Promise.race([
      fetch(request),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), timeout)
      ),
    ]);

    // Cache the fresh response
    await cache.put(request, response.clone());
    await enforceCacheLimit(); // Enforce cache size limit
    return response;
  } catch (error) {
    console.error(`Network request failed for ${request.url}:`, error);

    // Fallback to the cached response
    const cachedResponse = await cache.match(request);
    return cachedResponse || Response.error();
  }
}

/**
 * Cache-first strategy.
 * Serves the request from cache if available, otherwise fetches and caches it.
 * @param {Request} request - The request to handle.
 * @returns {Promise<Response>} The cached or fetched response.
 */
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME); // Open the cache
  const cachedResponse = await cache.match(request); // Check cache

  if (cachedResponse) {
    return cachedResponse; // Return cached response if available
  }

  // Fetch and cache the response
  const response = await fetch(request);
  await cache.put(request, response.clone());
  await enforceCacheLimit(); // Enforce cache size limit
  return response;
}

/**
 * Enforces cache size limits by removing old files if necessary.
 */
async function enforceCacheLimit() {
  const currentSize = await CacheManager.getCacheSize(); // Get current cache size
  if (currentSize > MAX_CACHE_SIZE_MB * 1024 * 1024) {
    console.log("Cache size exceeded. Pruning...");
    await CacheManager.clearOldestFiles(MAX_CACHE_SIZE_MB); // Clear old files
  }
}
