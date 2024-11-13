"use server";
import { db } from "@/lib/db";

/**
 * Gets the total number of playlists that have a specific NFT added.
 *
 * @param {string} nftId - The unique identifier of the NFT.
 * @returns {Promise<number>} - The total number of playlists containing the NFT.
 * @throws {Error} - Throws an error if the query fails.
 */
export const getPlaylistsWithNFT = async (nftId: string): Promise<number> => {
  try {
    if (!nftId) {
      throw new Error("NFT ID is required");
    }
    // Count the number of PlaylistListedNFT records where the specific NFT is listed
    const totalPlaylists = await db.playlistListedNFT.count({
      where: {
        //@ts-ignore
        nftId: nftId, // Filter by the NFT ID
      },
    });

    return totalPlaylists;
  } catch (error) {
    console.error("Error fetching playlists with the NFT:", error);
    throw new Error(
      "Failed to get the number of playlists containing the NFT."
    );
  }
};
