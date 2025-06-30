import { ListedNFT } from "@/types";
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
 * @returns {string | undefined} - Returns the address if the filter starts with "0x";
 */
export const getAddressOrName = (
  filter: string
): { address?: string; name?: string } => {
  if (filter.startsWith("0x") && filter.length === 42) {
    return { address: filter };
  }

  // Check if filter is a name
  if (filter.trim().length > 0) {
    return { name: filter };
  }

  // Return undefined if neither address nor valid name
  return {};
};

export const getNextTrack = (tracks: ListedNFT[], currentId: string | null): string | null => {
  if (!tracks.length) return null;
  if (!currentId) return tracks[0].id;

  const currentIndex = tracks.findIndex(t => t.id.toString() === currentId.toString());
  if (currentIndex === -1) return tracks[0].id; // Current track not found? Start over.

  const currentContract = tracks[currentIndex].contractAddress;

  // Search for the next track with a DIFFERENT contract address
  for (let i = currentIndex + 1; i < tracks.length; i++) {
    if (tracks[i].contractAddress !== currentContract) {
      return tracks[i].id;
    }
  }

  // If no different contract found, loop back to the start
  for (let i = 0; i < currentIndex; i++) {
    if (tracks[i].contractAddress !== currentContract) {
      return tracks[i].id;
    }
  }

  // If ALL tracks have the same contract, just return the next track (or loop)
  return currentIndex < tracks.length - 1 
    ? tracks[currentIndex + 1].id 
    : tracks[0].id;
};
