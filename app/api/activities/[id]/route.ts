import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

type ParamProp = {
  id: string;
};

// Function to handle GET request to fetch activities for a given user
export const GET = async (
  req: NextRequest,
  { params }: { params: ParamProp }
) => {
  const { id } = params;

  console.log(id, "id from request");

  // Check if user ID is provided
  if (!id) {
    return new NextResponse(JSON.stringify({ message: "UserId is required" }), {
      status: 400,
    });
  }

  try {
    // Extract pagination parameters from the query
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);

    // Fetch activities for the given user
    const activities = await db.activity.findMany({
      where: { userId: id }, // Filter by userId
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Return activities in a structured response
    return new NextResponse(JSON.stringify({ data: activities, page, limit }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching activities:", error);

    return new NextResponse(
      JSON.stringify({ message: "Error fetching activities", error }),
      { status: 500 }
    );
  }
};
