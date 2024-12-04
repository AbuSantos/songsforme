"use server";

import { db } from "@/lib/db";

export const checkUserName = async (username: string) => {
  const trimmedUsername = `@${username.trim()}`;
  if (!trimmedUsername) {
    return { isTaken: false, message: "Username is required!" };
  }

  try {
    const user = await db.user.findUnique({
      where: {
        username: trimmedUsername,
      },
    });

    return {
      isTaken: !!user,
      message: user ? "Username is already taken." : "Username is available.",
    };
  } catch (error: any) {
    console.error("Error checking username:", error.message);
    return {
      isTaken: false,
      message: "An error occurred while checking the username.",
    };
  }
};
