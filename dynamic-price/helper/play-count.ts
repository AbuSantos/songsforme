import { toEther } from "thirdweb";

export const countPlays = (accumulatedTime: number) => {
  if (accumulatedTime < 30) return 0;
  return Math.round(accumulatedTime / 160);
};
const DEFAULT_REWARD_RATE_PER_TIME = 1152830775970;

export const amountGenerated = (
  accumulatedTime: number,
  rewardRate: number = DEFAULT_REWARD_RATE_PER_TIME
) => {
  const earned = accumulatedTime * rewardRate;

  // Round to 5 significant digits
  const roundedEarned = parseFloat(earned.toPrecision(5));

  //@ts-ignore
  return toEther(roundedEarned);
};

export const totalPlayTime = (totalTrack: number) => {
  const totalSeconds = 120 * totalTrack; // Total playtime in seconds
  const totalMinutes = Math.floor(totalSeconds / 60); // Convert total seconds to minutes

  // Calculate hours and remaining minutes
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Return the formatted string
  return `${hours} hr ${minutes} min`;
};

// Example usage
console.log(totalPlayTime(30)); // e.g., "1 hr 0 min" if totalTrack is 30
