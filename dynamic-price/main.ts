"use server";
import { calculateDecayedPlayCount } from "./helper/decayed-count";

//@ts-ignore
export const calculateDynamicPrice = async (
  //@ts-ignore
  basePrice,
  //@ts-ignore
  recentPlays,
  // recentPlaylists,
  //@ts-ignore

  recentListeners
) => {
  console.log(basePrice, recentPlays, recentListeners, "from dynamic price");
  const k = 0.005;
  const alpha = 0.0002;
  const beta = 0.03;
  const decayRate = 0.001;

  const currentTime = Date.now() / 1000;
  const decayedPlayCount = calculateDecayedPlayCount(
    recentPlays,
    decayRate,
    currentTime
  );

  // console.log(decayedPlayCount, recentPlays, "decayed coubt");

  // const playlistFactor = 1 + alpha * Math.sqrt(recentPlaylists);
  const listenerFactor = 1 + beta * Math.log(1 + recentListeners);

  const dynamicPrice =
    basePrice *
    Math.exp(k * decayedPlayCount) *
    // playlistFactor *
    listenerFactor;

  return parseFloat(dynamicPrice.toFixed(4)); // Return price rounded to 4 decimal places
};
