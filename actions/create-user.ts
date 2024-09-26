"use server";
import { db } from "@/lib/db"; // Import the db instance
import { revalidateTag } from "next/cache";

export const createUser = async (
  userId: string | undefined,
  username: string
) => {
  try {
    const newUser = await db.user.create({
      data: {
        id: userId,
        username,
      },
    });
    revalidateTag("playlist");
    return { message: `${newUser.username}  added` };
  } catch (error) {
    console.log(error);
    return { message: "Error adding user, please try again" };
  }
};
