"use server";

import { db } from "@/lib/db";

export const addToWhiteList = async (adminId: string, userId: string) => {
  if (!adminId) {
    return {
      message: "You are not authorized to whitelist a user",
      success: false,
    };
  }

  try {
    // Check if the user exists
    const user = await db.user.findUnique({ where: { userId: userId } });
    if (!user) {
      return { message: "User not found", success: false };
    }

    // Check if the user is already whitelisted
    const existingWhitelist = await db.whitelist.findUnique({
      where: { userId },
    });
    if (existingWhitelist) {
      return { message: "User is already whitelisted", success: false };
    }

    // Add the user to the whitelist
    await db.whitelist.create({
      data: {
        userId,
      },
    });

    return { message: "User added to whitelist successfully!", success: true };
  } catch (error: any) {
    console.error("Error adding user to whitelist:", error.message);
    return {
      message: "An error occurred while adding the user to the whitelist",
      success: false,
      error: error.message,
    };
  }
};
