import { db } from "@/lib/db";
import { getAddressOrName, getTimeThreshold } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";
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

  console.log(searchQuery, "query from search");

  const buildQueryFilters = (filter: string | undefined) => {
    const threshHold = getTimeThreshold(filter || "");
    const song_Name = filter?.trim();
    const { address } = getAddressOrName(filter || "");

    const whereFilters = {
      sold: false,
      ...(filter && filter !== "ratio" && song_Name
        ? {
            Single: {
              is: {
                song_name: {
                  contains: song_Name,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            },
          }
        : {}),
      ...(threshHold && { listedAt: { gte: threshHold } }),
      ...(address && { contractAddress: address }),
    };

    const orderBy =
      filter === "ratio"
        ? { rewardRatio: "desc" as const }
        : filter === "playtime"
        ? { totalAccumulatedTime: "asc" as const }
        : undefined;

    return { whereFilters, orderBy };
  };

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
        listedAt: true,
        seller: true,
        price: true,
        contractAddress: true,
        accumulatedTime: true,
        totalAccumulatedTime: true,
        rewardRatio: true,
        isSaleEnabled: true,
        Single: {
          select: {
            song_cover: true,
            artist_name: true,
            song_name: true,
          },
        },
      },

      ...(orderBy ? { orderBy } : {}),
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (page - 1),
    });
    revalidateTag("bought");
    revalidateTag("nft");

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
