import { toEther } from "@thirdweb-dev/sdk";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";


// New Price=Base Price×(1+k×log(Play Count+1))


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const countPlays = (accumulatedTime: number) => {
  console.log(accumulatedTime);

  if (accumulatedTime < 30) return 0;
  return Math.round(accumulatedTime / 30);
};
const DEFAULT_REWARD_RATE_PER_TIME = 1152830775970;

export const amountGenerated = (
  accumulatedTime: number,
  rewardRate: number = DEFAULT_REWARD_RATE_PER_TIME
) => {
  const earned = accumulatedTime * rewardRate;

  // Round to 5 significant digits
  const roundedEarned = parseFloat(earned.toPrecision(5));

  return toEther(roundedEarned);
};
