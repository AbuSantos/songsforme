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

  console.log(id);
  // Check if user ID is provided
  if (!id) {
    return new Response(JSON.stringify({ message: "UserId is required" }), {
      status: 400, // Bad Request for missing input
    });
  }

  try {
    // Fetch all playlists for the given user ID, including listed NFTs
    const favorites = await db.favorites.findMany({
      where: {
        userId: id,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        listednft: {
          select: {
            id: true,
            tokenId: true,
            price: true,
            seller: true,
            Single: {
              select: {
                song_cover: true,
                artist_name: true,
              },
            },
          },
        },
      },
    });

    // Return the fetched playlists as a JSON response
    return new Response(JSON.stringify(favorites), {
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
