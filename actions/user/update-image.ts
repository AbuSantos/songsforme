"use server";

import { db } from "@/lib/db";

export const updateUserImage = async (imageUri: string, userId: string) => {
  if (!userId || !imageUri) {
    return { message: "invalid Details" };
  }
  try {
    const user = await db.user.findUnique({
      where: {
        userId,
      },
    });
    if (!user) {
      return { message: "user not found" };
    }
    const updateUserImage = await db.user.update({
      where: {
        userId,
      },
      data: {
        profilePicture: imageUri,
      },
    });
  } catch (error: any) {
    console.log(error.message);
    return { message: `${error.message}` };
  }
};
