"use server";

import { db } from "@/lib/db"; // Assuming `db` is your Prisma client instance
import { revalidateTag } from "next/cache";

// Function to add an NFT to a playlist
export const addSongToPlaylist = async (playlistId: string, nftId: string) => {
  try {
    // Validate input to ensure both playlistId and nftId are provided
    if (!playlistId || !nftId) {
      return { message: "PlaylistId and NftId are required" };
    }

    // Retrieve the playlist by its ID, including the listed NFTs
    const playlist = await db.playlist.findUnique({
      where: { id: playlistId },
      include: {
        listednft: true, // Fetch existing NFTs in the playlist
      },
    });

    // Retrieve the NFT by its ID
    const listedNft = await db.listedNFT.findUnique({
      where: { id: nftId },
    });

    // Check if either the playlist or the NFT is not found
    if (!playlist || !listedNft) {
      return { message: "Playlist or NFT not found" };
    }

    // Check if the NFT is already listed in the playlist
    const isAlreadyInPlaylist = playlist.listednft.some(
      (nft) => nft.id === nftId
    );
    if (isAlreadyInPlaylist) {
      return { message: "NFT already in the Playlist" };
    }

    // Connect the NFT to the playlist
    await db.playlist.update({
      where: { id: playlistId },
      data: {
        listednft: {
          connect: { id: nftId }, // Use Prisma's `connect` to link the NFT
        },
      },
    });

    // Revalidate the tags to update the cache for playlist and NFT
    revalidateTag("playlist");
    revalidateTag("nft");

    return { message: "NFT added to playlist" };
  } catch (error) {
    // Log error details for debugging
    console.error("Error adding NFT to Playlist:", error);
    return { message: "Error adding NFT to Playlist" };
  }
};
