import { db } from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

type ParamProp = {
  id: string;
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const url = new URL(request.url);
  const artisteId = url.searchParams.get("artisteId");

  console.log(id, artisteId, "from route");

  if (!id || !artisteId) {
    return NextResponse.json(
      { message: "Please connect your wallet!" },
      { status: 400 }
    );
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
      });
    }

    return NextResponse.json({
      isFollowing: false,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error checking follow status" },
      { status: 500 }
    );
  }
}
