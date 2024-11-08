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
