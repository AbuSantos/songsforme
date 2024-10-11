"use server";
import { cookies } from "next/headers";

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

    // Set the session cookie with provided configurations
    cookies().set("session", address, {
      httpOnly: true, // Prevent JavaScript access to the cookie for security
      secure: process.env.NODE_ENV === "production", // Use secure flag only in production
      expires: expiresAt, // Set the cookie to expire in 5 days
      sameSite: "none", // Allow cross-site requests with credentials
      path: "/", // Set the cookie path to be accessible site-wide
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
