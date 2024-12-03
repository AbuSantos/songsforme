"use server";
import { db } from "@/lib/db";

export const clearAccumulatedTime = async (userId: string) => {
  if (!userId) {
    return { message: "Invalid user ID" };
  }
  try {
    // Update user's accumulatedTime to 0 to clear it
    const user = await db.user.update({
      where: { userId },
      data: {
        accumulatedTime: 0, // Set accumulatedTime to zero
      },
      select: {
        accumulatedTime: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return { message: "Accumulated time cleared successfully", user };
  } catch (error: any) {
    console.error("Error clearing accumulated time:", error);
    return {
      message: "Failed to clear accumulated time",
      error: error.message,
    };
  }
};
