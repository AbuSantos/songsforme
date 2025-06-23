import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

type ParamProp = {
  id: string;
};

// Function to handle GET request to fetch playlists for a given user
export const GET = async (req: NextRequest) => {
  const ITEM_PER_PAGE = 20;
  const url = new URL(req.url).searchParams;

  const searchParams = req.nextUrl.searchParams;

  const playtimeQuery = url.get("playtime");
  const ratioQuery = url.get("ratio");

  const page: number = (url.get("page") as unknown as number) || 1;

  // Determine ordering based on query parameters
  const orderBy =
    ratioQuery === "ratio"
      ? { rewardRatio: "desc" as const }
      : playtimeQuery === "playtime"
      ? { accumulatedTime: "asc" as const }
      : undefined;

  try {
    const playlists = await db.playlist.findMany({
      select: {
        rewardRatio: true,
        accumulatedTime: true,
        name: true,
        id: true,
        listednft: {
          select: {
            id: true,
          },
        },
        owner: {
          select: {
            userId: true,
            username: true,
          },
        },
      },
      ...(orderBy ? { orderBy } : {}),
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (page - 1),
    });

    // Return the fetched playlists as a JSON response
    return new Response(JSON.stringify(playlists), {
      status: 200,
    });
  } catch (error) {
    // Log error details for debugging
    console.error("Error fetching playlists:", error);

    // Respond with a server error message
    return new Response(
      JSON.stringify({ message: "Error fetching playlists" }),
      {
        status: 500, // Internal Server Error
      }
    );
  }
};
