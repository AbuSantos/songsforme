"use server";

import { db } from "@/lib/db"; // Assuming `db` is your Prisma client instance
import { revalidateTag } from "next/cache";

// Function to add an NFT to a playlist
export const addSongToPlaylist = async (playlistId: string, nftId: string) => {
  try {
    if (!playlistId || !nftId) {
      return { message: "PlaylistId and NftId are required" };
    }
    const playlist = await db.playlist.findUnique({
      where: { id: playlistId },
    });
    const listedNft = await db.listedNFT.findUnique({
      where: { id: nftId },
    });

    if (!playlist || !listedNft) {
      return { message: "Playlist or NFT not found" };
    }
    await db.playlist.update({
      where: { id: playlistId },
      data: {
        listednft: {
          connect: { id: nftId },
        },
      },
    });

    // Revalidate the tags to update the cache
    revalidateTag("playlist");
    revalidateTag("nft");

    return { message: "NFT added to playlist" };
  } catch (error) {
    console.error("Error adding NFT to Playlist:", error);
    return { message: "Error adding NFT to Playlist" };
  }
};
