"use server";
import { calculateDecayedPlayCount } from "./helper/decayed-count";

export const calculateDynamicPrice = async (
  basePrice,
  recentPlays,
  // recentPlaylists,
  recentListeners
) => {
  console.log(basePrice, recentPlays, recentListeners, "from dynamic price");
  const k = 0.005; // Growth rate for decayed play count
  const alpha = 0.0002; // Weight of playlist factor
  const beta = 0.03; // Weight of unique listeners factor
  const decayRate = 0.001; // Decay rate for play influence

  // Decayed play count based on recent plays and decay rate
  const currentTime = Date.now() / 1000; // Current time in seconds
  const decayedPlayCount = calculateDecayedPlayCount(
    recentPlays,
    decayRate,
    currentTime
  );

  console.log(decayedPlayCount, recentPlays, "decayed coubt");

  // Logarithmic growth modifiers for playlists and unique listeners
  // const playlistFactor = 1 + alpha * Math.sqrt(recentPlaylists);
  const listenerFactor = 1 + beta * Math.log(1 + recentListeners);

  // Calculate final price with all factors
  const dynamicPrice =
    basePrice *
    Math.exp(k * decayedPlayCount) *
    // playlistFactor *
    listenerFactor;

  return parseFloat(dynamicPrice.toFixed(4)); // Return price rounded to 4 decimal places
};
