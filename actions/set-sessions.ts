"use server";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const secretKey = process.env.AUTH_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("5d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Failed to verify session");
  }
}

// Function to set a session using the wallet address
export const setsession = async (address: string) => {
  if (!address) {
    return {
      message:
        "Error occurred while session, please connect wallet again. Please try again.",
    };
  }
  try {
    // Set cookie expiration to 5 days from now
    const expiresAt = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    const sessionPayload = { userId: address }; 
    const session = await encrypt(sessionPayload);

    // Set the session cookie with provided configurations
    cookies().set("session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: expiresAt,
      sameSite: "none",
      path: "/",
    });

    return { message: "Session set successfully" };
  } catch (error) {
    console.error("Error setting session:", error);
    return {
      message: "An error occurred while setting the session.",
    };
  }
};

// Function to delete the session by removing the session cookie
export const deleteSession = async () => {
  try {
    // Delete the session cookie
    cookies().delete("session");
    return { message: "Session deleted successfully" };
  } catch (error) {
    console.error("Error deleting session:", error);
    return {
      message: "An error occurred while deleting the session.",
    };
  }
};
