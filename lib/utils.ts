import { toEther } from "@thirdweb-dev/sdk";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// New Price=Base Price×(1+k×log(Play Count+1))

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const truncate = (address: string) => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const getTimeThreshold = (filter: string): Date | null => {
  const now = new Date();

  console.log(filter, "from time fifter");
  if (filter.endsWith("min")) {
    const minutes = parseInt(filter.replace("min", ""), 10);

    console.log(minutes, "from time");
    if (!isNaN(minutes)) {
      now.setMinutes(now.getMinutes() - minutes);
      return now;
    }
  } else if (filter.endsWith("hr")) {
    const hours = parseInt(filter.replace("hr", ""), 10);
    if (!isNaN(hours)) {
      now.setHours(now.getHours() - hours);
      return now;
    }
  }
  return null;
};
