// /app/api/user/route.ts
import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

type UserResponse = {
  id: string;
  username?: string | null;
  userId: string;
  listenTimeThreshold: number;
  accumulatedTime: number;
  lastListeningTime?: Date | null;
  listeningSessionStartTime?: Date | null;
};

type ParamProp = {
  id: string;
};

// Function to handle the GET request for fetching user by address
export const GET = async (
  req: NextRequest,
  { params }: { params: ParamProp }
) => {
  // Extract the address query parameter from the URL
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }
  try {
    const user: UserResponse | null = await db.user.findUnique({
      where: { userId: id },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid Artiste" }, { status: 404 });
    }

    const followerCount = await db.follow.count({
      where: {
        followedId: id,
      },
    });

    revalidateTag(`followed_${id}`);

    // Return the user data as JSON
    return NextResponse.json(followerCount, { status: 200 });
  } catch (error) {
    console.error("Error fetching Artiste Count:", error);

    // Check if it's a known error type or an unknown error
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return a generic internal server error response
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
