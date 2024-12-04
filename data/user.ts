"use server";

import { db } from "@/lib/db";

// This function is marked as a server action and will only run on the server.
export const getUserByAddress = async (address: string) => {
  try {
    const user = await db.user.findUnique({
      where: { userId: address },
      select: {
        email: true,
        username: true,
        id: true,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error fetching user by address:", error);
    return null;
  }
};
