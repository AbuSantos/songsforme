"use server";

import { db } from "@/lib/db"; // Assuming `db` is your Prisma client instance
import { revalidateTag } from "next/cache";

// Function to remove an NFT from a playlist
export const removeNftFromPlaylist = async (
  playlistId: string,
  nftId: string
) => {
  try {
    if (!playlistId || !nftId) {
      return {
        message: "PlaylistId and NftId are required",
      };
    }

    // Check if the playlist exists
    const playlist = await db.playlist.findUnique({
      where: { id: playlistId },
    });

    // Check if the NFT exists
    const listedNft = await db.listedNFT.findUnique({
      where: { id: nftId },
    });

    if (!playlist || !listedNft) {
      return { message: "Playlist or NFT not found" };
    }

    // Remove the NFT from the playlist by disconnecting from the join table (PlaylistListedNFT)
    await db.playlist.update({
      where: { id: playlistId },
      data: {
        listednft: {
          disconnect: { id: nftId },
        },
      },
    });

    await db.playlistListedNFT.delete({
      where: {
        playlistId_listedNFTId: {
          playlistId: playlistId,
          listedNFTId: nftId,
        },
      },
    });

    // Revalidate the tags to update the cache
    revalidateTag("playlist");
    revalidateTag("nft");

    return { message: "NFT removed from playlist" };
  } catch (error) {
    console.error("Error removing NFT from Playlist:", error);
    return { message: "Error removing NFT from Playlist" };
  }
};
