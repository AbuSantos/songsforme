"use server";
import { cookies } from "next/headers";
import { decrypt } from "@/actions/set-sessions"; // Adjust the import according to your structure
import { cache } from "react";
import { db } from "./db";
import { JWTPayload } from "jose";

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
    const user = await db.user.findUnique({
      where: { userId },
      select: { accumulatedTime: true },
    });

    console.log(user, "Retrieved user data");
    const accumulatedTime = user?.accumulatedTime;

    if (!accumulatedTime || accumulatedTime <= 0) {
      return { message: "No rewards available to withdraw." };
    }

    return accumulatedTime;
  } catch (error) {
    console.error("Error retrieving accumulated time for user:", error);
    return { message: "Error retrieving user data." };
  }
};
