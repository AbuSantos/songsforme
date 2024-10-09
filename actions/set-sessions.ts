"use server";
import { cookies } from "next/headers";

export const setsession = async (address: string) => {
  if (!address) {
    return {
      message:
        "Error occurred while session, please connect wallet again. Please try again.",
    };
  }

  const expiresAt = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

  cookies().set("session", address, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "none",
    path: "/",
  });

  return { message: "Session set successfully" };
};
