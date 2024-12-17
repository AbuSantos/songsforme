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

  console.log(id, "THIS IS FROM SINGLES API");
  // Check if user ID is provided
  if (!id) {
    return new Response(JSON.stringify({ message: "UserId is required" }), {
      status: 400, // Bad Request for missing input
    });
  }

  try {
    // Fetch all playlists for the given user ID, including listed NFTs
    const singles = await db.single.findMany({
      where: {
        owner: id,
      },

      select: {
        id: true,
        artist_name: true,
        song_name: true,
        song_cover: true,
        contractAddress: true,
        genre: true,
        listedNft: {
          select: {
            contractAddress: true,
            tokenId: true,
            id: true,
          },
        },
      },
    });
    // Return the fetched playlists as a JSON response
    return new Response(JSON.stringify(singles), {
      status: 200,
    });
  } catch (error) {
    // Log error details for debugging
    console.error("Error fetching Singles:", error);

    // Respond with a server error message
    return new Response(JSON.stringify({ message: "Error fetching singles" }), {
      status: 500, // Internal Server Error
    });
  }
};
