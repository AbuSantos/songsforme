"use server";
import { cookies } from "next/headers";
import { decrypt } from "@/actions/set-sessions"; // Adjust the import according to your structure
import { cache } from "react";
import { db } from "./db";

export const getSession = cache(async () => {
  const sessionValue = cookies().get("session")?.value; // Retrieve the session cookie

  if (!sessionValue) {
    console.log("No session found, please connect your wallet");
    return null; // Return null if no session exists
  }
  try {
    const decryptedValue = await decrypt(sessionValue); // Decrypt the session value

    console.log(decryptedValue?.userId, "decrypted session value th");

    return decryptedValue?.userId; // Return the decrypted session value
  } catch (error) {
    console.error("Error decrypting session:", error);
    return null; // Return null if decryption fails
  }
});

export const getUserAccumulatedTIme = async (userId: string) => {
  const user = await db.user.findUnique({
    where: {
      userId,
    },
    select: { accumulatedTime: true },
  });
  console.log(user, "user");
  const accumulatedTime = user?.accumulatedTime;
  if (!accumulatedTime || accumulatedTime <= 0) {
    return { message: "No rewards available to withdraw." };
  }

  return accumulatedTime;
};
