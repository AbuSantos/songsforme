"use server";
import { cookies } from "next/headers";
import { decrypt } from "@/actions/set-sessions"; // Adjust the import according to your structure
import { cache } from "react";

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
