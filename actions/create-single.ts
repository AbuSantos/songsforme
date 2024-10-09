"use server";
import { db } from "@/lib/db"; // Import the database instance
import { revalidateTag } from "next/cache"; // Cache revalidation for Next.js ISR

/**
 * Creates a single song record in the database.
 * If an optional NFT ID is provided, it connects the single to the corresponding NFT.
 *
 * @param {string} userId - The ID of the user creating the song.
 * @param {string} name - The name of the artist.
 * @param {string} songname - The name of the song being created.
 * @param {string} [nftId] - (Optional) The ID of the NFT to associate with the song.
 * @returns {Promise<object>} - Returns a message indicating success or failure.
 */
export const createSingleSong = async (
  userId: string,
  name: string,
  songname: string,
  nftId?: string
) => {
  // Log the inputs for debugging purposes
  console.log("Creating Single with data: ", { userId, name, songname, nftId });

  try {
    // Input validation to ensure required fields are present
    if (
      !userId ||
      !songname ||
      userId.trim() === "" ||
      songname.trim() === ""
    ) {
      return { message: "UserId and Songname are required fields." };
    }

    // Create the new song record in the database
    const newSingle = await db.single.create({
      data: {
        artist_name: name,
        owner: userId, // Set the song's owner to the userId
        song_name: songname,
        ...(nftId && {
          // Optionally connect the song to an NFT if the nftId is provided
          listednft: {
            connect: { id: nftId },
          },
        }),
      },
      // Include related NFT data in the returned response
      include: {
        listedNft: true,
      },
    });

    // Revalidate the tag for caching purposes to ensure fresh data
    revalidateTag("single");

    // Return success message with the name of the newly created song
    return { message: `${newSingle.song_name} has been successfully created.` };
  } catch (error) {
    // Log the error for debugging
    console.error("Error while creating single:", error);

    // Return a generic error message to the client
    return {
      message: "Error occurred while creating the single. Please try again.",
    };
  }
};
