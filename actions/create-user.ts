"use server";

import { db } from "@/lib/db";
import { setsession } from "./set-sessions";
import { revalidateTag } from "next/cache";

export const createUser = async (
  address: string,
  username: string,
  emailAddress?: string
) => {
  try {
    if (!address || !username.trim()) {
      return { message: "Address and username are required" };
    }

    const userName = `@${username.trim()}`;

    // Check if the user already exists
    const existingUser = await db.user.findFirst({
      where: {
        OR: [{ username: userName }, { email: emailAddress }],
      },
    });

    if (existingUser) {
      return {
        message: "Username or email already exists. Please choose another.",
        status: false,
      };
    }

    const newUser = await db.user.create({
      data: {
        userId: address,
        email: emailAddress,
        username: userName,
        listenTimeThreshold: 600000,
        accumulatedTime: 0,
      },
    });

    await setsession(address);
    revalidateTag("user");
    return {
      message: `${newUser.username} added`,
      user: newUser,
      status: true,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return { message: "An unexpected error occurred, please try again" };
  }
};
