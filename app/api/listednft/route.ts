import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

type ParamProp = {
  id: string;
};

// Function to handle GET request to fetch playlists for a given user
export const GET = async (req: NextRequest) => {
  const ITEM_PER_PAGE = 15;
  const url = new URL(req.url).searchParams;

  const page: number = (url.get("page") as unknown as number) || 1;

  const searchQuery = url.get("filter");

  // Determine ordering based on query parameters
  const orderBy =
    searchQuery === "ratio"
      ? { rewardRatio: "desc" as const }
      : searchQuery === "playtime"
      ? { accumulatedTime: "asc" as const }
      : undefined;

  try {
    const listedData = await db.listedNFT.findMany({
      where: {
        sold: false,
        ...(searchQuery && {
          contractAddress: { contains: searchQuery, mode: "insensitive" },
        }),
      },
      select: {
        id: true,
        tokenId: true,
        seller: true,
        price: true,
        contractAddress: true,
        uri: true,
        accumulatedTime: true,
        rewardRatio: true,
        sold: true,
      },

      ...(orderBy ? { orderBy } : {}),
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (page - 1),
    });

    // Return the fetched playlists as a JSON response
    return new Response(JSON.stringify(listedData), {
      status: 200,
    });
  } catch (error) {
    // Log error details for debugging
    console.error("Error fetching Songs:", error);

    // Respond with a server error message
    return new Response(JSON.stringify({ message: "Error fetching Songs" }), {
      status: 500, // Internal Server Error
    });
  }
};
