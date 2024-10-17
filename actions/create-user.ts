"use server";
import { db } from "@/lib/db"; // Import the db instance
import { revalidateTag } from "next/cache";
import { setsession } from "./set-sessions";

export const createUser = async (address: string, username: string) => {
  try {
    const newUser = await db.user.create({
      data: {
        userId: address,
        username,
        listenTimeThreshold: 600000,
        accumulatedTime: 0,
      },
    });

    await setsession(address);
    revalidateTag("user");
    return { message: `${newUser.username}  added` };
  } catch (error) {
    console.log(error);
    return { message: "Error adding user, please try again" };
  }
};
