import { db } from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

type ParamProp = {
  id: string;
};

// Function to handle GET request to fetch following for a given user
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // Parse query parameters
  const url = new URL(request.url);
  const artisteId = url.searchParams.get("artisteId");

  console.log(id, artisteId, "from route");

  if (!id || !artisteId) {
    return { message: "Please connect your wallet!", status: 400 };
  }

  try {
    const existingFollow = await db.follow.findUnique({
      where: {
        followerId_followedId: {
          followerId: id,
          followedId: artisteId,
        },
      },
    });

    if (existingFollow) {
      return NextResponse.json({
        isFollowing: true,
        message: `You are following ${artisteId}.`,
        status: 200,
      });
    }

    return NextResponse.json({
      isFollowing: false,
      message: `You are not following ${artisteId}.`,
      status: 200,
    });
  } catch (error) {
    console.error("Error checking follow status:", error);

    return NextResponse.json({
      message: "An error occurred while checking follow status.",
      status: 500,
    });
  }
}
