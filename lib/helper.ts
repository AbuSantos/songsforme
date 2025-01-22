"use server";
import { cookies, headers } from "next/headers";
import { decrypt } from "@/actions/set-sessions"; // Adjust the import according to your structure
import { cache } from "react";
import { db } from "./db";
import { JWTPayload } from "jose";
import { utils } from "ethers";

interface User {
  accumulatedTime: number | null;
}

interface Playlist {
  accumulatedTime: number | null;
}

interface ErrorMessage {
  message: string;
}

// Cached session retrieval with improved error handling and type checking
export const getSession = cache(async (): Promise<JWTPayload | null> => {
  const sessionValue = cookies().get("bullchord-session")?.value;
  console.log(sessionValue, "Retrieved session cookie");

  if (!sessionValue) {
    console.warn("No session found. Prompting user to connect wallet.");
    return null;
  }

  try {
    const decryptedValue: JWTPayload | undefined = await decrypt(sessionValue);
    if (!decryptedValue) {
      console.error("Decryption returned no value.");
      return null;
    }

    // Optional: Validate expiration if present
    if (decryptedValue.exp && Date.now() >= decryptedValue.exp * 1000) {
      console.warn("Session token has expired.");
      return null;
    }

    console.log(decryptedValue.userId, "Decrypted session value");
    //@ts-ignore
    return decryptedValue.userId ?? undefined;
  } catch (error) {
    console.error("Failed to decrypt session:", error);
    return null;
  }
});

export const getUserAccumulatedTime = async (
  userId: string
): Promise<number | { message: string }> => {
  try {
    // Fetch user's accumulated time
    const user = await db.user.findUnique({
      where: { userId },
      select: { accumulatedTime: true },
    });

    // If no user data is found, return an error message
    if (!user) {
      return { message: "User not found." };
    }

    // Fetch all playlists associated with the user
    const playlists: Playlist[] = await db.playlist.findMany({
      where: { userId },
      select: { accumulatedTime: true },
    });

    // If the user has no playlists, return only the user's accumulated time
    if (!playlists || playlists.length === 0) {
      return user.accumulatedTime ?? 0;
    }

    // Sum the accumulatedTime from playlists, defaulting to 0 for undefined values
    const playlistTime = playlists.reduce(
      (acc, cur) => acc + (cur?.accumulatedTime ?? 0),
      0
    );

    // Calculate the total accumulated time
    const accumulatedTime = (user.accumulatedTime ?? 0) + playlistTime;

    // Check if accumulated time is valid for withdrawal
    if (accumulatedTime <= 0) {
      return { message: "No rewards available to withdraw." };
    }

    return accumulatedTime;
  } catch (error) {
    console.error("Error retrieving accumulated time for user:", error);
    return { message: "Error retrieving user data." };
  }
};

export const isEthereumAddress = (value: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
};

export const isValidEthereumAddress = (value: string): boolean => {
  try {
    return utils.getAddress(value) === value;
  } catch {
    return false;
  }
};


