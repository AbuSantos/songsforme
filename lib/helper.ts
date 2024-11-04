"use server";
import { cookies } from "next/headers";
import { decrypt } from "@/actions/set-sessions"; // Adjust the import according to your structure
import { cache } from "react";
import { db } from "./db";

// Define a more descriptive type for the decrypted session
interface DecryptedSession {
  userId: string;
}

// Cached session retrieval with improved error handling and type checking
export const getSession = cache(async (): Promise<string | null> => {
  const sessionValue = cookies().get("bullchord-session")?.value;

  console.log(sessionValue, "Retrieved session cookie");
  if (!sessionValue) {
    console.warn("No session found. Prompting user to connect wallet.");
    return null;
  }

  try {
    const decryptedValue: DecryptedSession | null = await decrypt(sessionValue);
    console.log(decryptedValue?.userId, "Decrypted session value");

    return decryptedValue?.userId ?? null;
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
