import { toEther } from "thirdweb";

export const countPlays = (accumulatedTime: number) => {
  console.log(accumulatedTime);

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

  return toEther(roundedEarned);
};
