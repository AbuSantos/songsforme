import { db } from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

type ParamProp = {
  id: string;
};

// Function to handle GET request to fetch following for a given user
export const GET = async (
  req: NextRequest,
  { params }: { params: ParamProp }
) => {
  const { id } = params;
  if (!id) {
    return { message: "Please connect your wallet!", status: 400 };
  }

  try {
    const existingFollow = await db.follow.findFirst({
      where: {
        followerId: id,
      },
    });

    if (existingFollow) {
      return {
        isFollowing: true,
        message: `You are following .`,
        status: 200,
      };
    }

    return {
      isFollowing: false,
      message: `You are not following.`,
      status: 200,
    };
  } catch (error) {
    console.error("Error checking follow status:", error);
    return {
      message: "An error occurred while checking follow status.",
      status: 500,
    };
  }
};
