import { db } from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";
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
    const playlists = await db.playlist.findMany({
      where: { userId: id as string },
      include: {
        listednft: true, // Include associated NFTs in the response
      },
    });
    revalidateTag("playlist");

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
