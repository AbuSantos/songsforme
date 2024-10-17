// export const getUserByAddress = async (address: string) => {
//   try {
//     const response = await fetch(`api/user/${address}`);
//     if (!response.ok) {
//       throw new Error("User not found");
//     }
//     const user = await response.json();
//     return user;
//   } catch (error) {
//     console.error("Error fetching user by address:", error);
//     return null;
//   }
// };

// actions/getUserByAddress.ts (server action)

"use server";

import { db } from "@/lib/db";

// This function is marked as a server action and will only run on the server.
export const getUserByAddress = async (address: string) => {
  try {
    const user = await db.user.findUnique({
      where: { userId: address },
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
