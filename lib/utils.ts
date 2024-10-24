import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const countPlays = (accumulatedTime: number) => {
  if (accumulatedTime < 30) return 0;
  return Math.round(accumulatedTime / 30);
};
export const amountGenerated = (accumulatedTime: number) => {
  const earned = accumulatedTime * 100; //TO BE EDITED
  return earned;
};
