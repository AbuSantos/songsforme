import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

type ParamProp = {
  id: string;
};

// Function to handle GET request to fetch playlists for a given user
export const GET = async (
  req: NextRequest,
  { params }: { params: ParamProp }
) => {
  const { id } = params;

  console.log(id, "id frommine");
  // Check if user ID is provided
  if (!id) {
    return new Response(JSON.stringify({ message: "UserId is required" }), {
      status: 400,
    });
  }

  try {
    // Fetch all nfts for the given user ID, including listed NFTs
    const nfts = await db.buyNFT.findMany({
      where: {
        buyer: id,
        // relisted: false,
      },
      include: {
        listedNft: {
          include: {
            Single: {
              select: {
                id: true,
                artist_name: true,
                song_cover: true,
                song_name: true,
              },
            },
          },
        },
      },
    });

    console.log(nfts, "from my bought");

    // Return the fetched playlists as a JSON response
    return new Response(JSON.stringify(nfts), {
      status: 200,
    });
  } catch (error) {
    // Log error details for debugging
    console.error("Error fetching playlists:", error);

    // Respond with a server error message
    return new Response(
      JSON.stringify({ message: "Error fetching playlists" }),
      {
        status: 500,
      }
    );
  }
};
