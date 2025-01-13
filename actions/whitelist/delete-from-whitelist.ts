"use server";

import { db } from "@/lib/db";

export const deleteFromWhitelist = async (adminId: string, userId: string) => {
  if (!adminId) {
    return { message: "You are not authorized to remove users from the whitelist", success: false };
  }

  try {
    // Check if the user is whitelisted
    const whitelistEntry = await db.whitelist.findUnique({
      where: { userId },
    });

    if (!whitelistEntry) {
      return { message: "User is not in the whitelist", success: false };
    }

    // Delete the user from the whitelist
    await db.whitelist.delete({
      where: { userId },
    });

    return { message: "User removed from the whitelist successfully!", success: true };
  } catch (error: any) {
    console.error("Error removing user from whitelist:", error.message);
    return { message: "An error occurred while removing the user from the whitelist", success: false, error: error.message };
  }
};
