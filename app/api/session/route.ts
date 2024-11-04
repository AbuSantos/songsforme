// pages/api/session/fetch-session.js
import { decrypt } from "@/actions/set-sessions";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { encrypt } from "@/actions/set-sessions"; // Adjust the import path

export async function GET() {
  console.log("hello world");
  // const sessionValue = cookies().get("session");
  const cookie = cookies().get("bullchord-session")?.value;

  console.log(cookie, "session from route");
  if (!cookie) {
    return NextResponse.json({ error: "No session found" });
  }

  try {
    const decryptedValue = await decrypt(cookie);
    return NextResponse.json({ userId: decryptedValue?.userId });
  } catch (error) {
    console.error("Error decrypting session:", error);
    return NextResponse.json({ error: "Failed to decrypt session" });
  }
}

export async function POST(request: NextRequest) {
  const { address } = await request.json();

  if (!address) {
    return NextResponse.json({ error: "No address provided" });
  }

  try {
    const sessionPayload = { userId: address };
    const session = await encrypt(sessionPayload);

    const response = NextResponse.json({ message: "Session set successfully" });
    response.cookies.set("bullchord-session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "none",
      expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    });

    return response;
  } catch (error) {
    console.error("Error setting session:", error);
    return NextResponse.json({ error: "Failed to set session" });
  }
}
