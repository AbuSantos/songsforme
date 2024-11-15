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

/**
 * Calculates a date-time threshold based on the provided time filter.
 * @param {string} filter - A string specifying the time offset, which must end with either "min" for minutes or "hr" for hours (e.g., "30min" or "2hr").
 * @returns {Date | null} - A Date object representing the time threshold based on the filter, or null if the filter is invalid.
 *
 * @example
 * getTimeThreshold("30min"); // Returns the current date-time minus 30 minutes.
 * getTimeThreshold("2hr");   // Returns the current date-time minus 2 hours.
 */
export const getTimeThreshold = (filter: string): Date | null => {
  const now = new Date(); // Get the current date and time.
  if (filter.endsWith("min")) {
    const minutes = parseInt(filter.replace("min", ""), 10); // Extract minutes.
    if (!isNaN(minutes)) {
      now.setMinutes(now.getMinutes() - minutes); // Adjust time by subtracting minutes.
      return now;
    }
  } else if (filter.endsWith("hr")) {
    const hours = parseInt(filter.replace("hr", ""), 10); // Extract hours.
    if (!isNaN(hours)) {
      now.setHours(now.getHours() - hours); // Adjust time by subtracting hours.
      return now;
    }
  }

  return null; // Return null if the filter format is invalid.
};

/**
 * Returns a name or address based on the filter string.
 * If the filter starts with "0x", it's assumed to be an Ethereum address,
 * and the address is returned. Otherwise, it returns the artiste name.
 *
 * @param {string} filter - The filter string to determine whether to return address or artisteName.
 * @returns {string | undefined} - Returns the address if the filter starts with "0x"; otherwise, returns the artisteName.
 */
export const getAddressOrName = (
  filter: string
): { address?: string; name?: string } => {
  if (filter.startsWith("0x") && filter.length === 42) {
    return { address: filter };
  }

  // Check if filter is a name (assuming it's a non-empty string without "0x" prefix)
  if (filter.trim().length > 0) {
    return { name: filter };
  }

  // Return undefined if neither address nor valid name
  return {};
};
