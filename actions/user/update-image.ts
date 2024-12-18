"use server";

import { db } from "@/lib/db";

interface UpdateUserResponse {
  message: string;
  success?: boolean;
}

export const updateUserImage = async (
  imageUri: string,
  userId: string
): Promise<UpdateUserResponse> => {
  // Validate inputs
  if (!userId || !imageUri) {
    return { message: "Invalid details provided" };
  }

  try {
    // Check if the user exists
    const user = await db.user.findUnique({
      where: {
        userId,
      },
    });

    if (!user) {
      return { message: "User not found" };
    }

    // Update user profile picture
    await db.user.update({
      where: {
        userId,
      },
      data: {
        profilePicture: imageUri,
      },
    });

    // Success response
    return { message: "Profile picture updated successfully", success: true };
  } catch (error: any) {
    console.error("Error updating user:", error); // For developers
    return { message: "An error occurred while updating the profile picture" }; // For end-users
  }
};
