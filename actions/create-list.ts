"use server";
/**
 * Creates a single song record and lists 10 NFTs under it.
 *
 * @param {string} userId - The ID of the user creating the song.
 * @param {string} artistName - The name of the artist.
 * @param {string} songName - The name of the song.
 * @param {string} seller - The seller's address.
 * @param {string} songCover - URL or path to the song cover image.
 * @param {string} baseTokenId - The starting token ID for the NFTs.
 * @param {string} price - The price of each token.
 * @param {string} nftAddress - The address of the NFT contract.
 * @param {string} uri - The URI for the NFT metadata.
 * @returns {Promise<object>} - Returns a summary of successes and failures.
 */
import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";

type SuccessResult = {
  tokenId: string;
  singleId: string;
  nftId: string;
};

type FailureResult = {
  tokenId: string;
  error: string;
};

export const createSingleWithNFTs = async (
  userId: string,
  artistName: string,
  songName: string,
  seller: string,
  songCover: string,
  baseTokenId: string,
  price: string,
  nftAddress: string,
  uri: string
): Promise<object> => {
  if (!userId || userId.trim() === "" || !songName || songName.trim() === "") {
    return { status: "error", message: "User ID and song name are required." };
  }

  // Explicitly define the types of the results object
  const results: {
    successes: SuccessResult[];
    failures: FailureResult[];
  } = {
    successes: [],
    failures: [],
  };

  try {
    // Parse price
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      throw new Error("Invalid price format.");
    }

    // Create the single song record
    const newSingle = await db.single.create({
      data: {
        artist_name: artistName,
        owner: userId,
        song_name: songName,
        song_cover: songCover,
        contractAddress: nftAddress,
        uri,
      },
    });

    // Loop to create 10 tokens (NFTs) under the single
    for (let i = 0; i < 10; i++) {
      const tokenId = `${i}`; // Generate token IDs

      try {
        // Create each listed NFT
        const nftRecord = await db.listedNFT.create({
          data: {
            tokenId,
            seller,
            price: parsedPrice,
            contractAddress: nftAddress,
            listedAt: new Date(),
            sold: false,
            isSaleEnabled: true,
            Single: {
              connect: {
                id: newSingle.id,
              },
            },
          },
        });

        // Add to successes
        results.successes.push({
          tokenId,
          singleId: newSingle.id,
          nftId: nftRecord.id,
        });
      } catch (tokenError: any) {
        // Log token creation errors
        console.error(`Error creating NFT for token ${tokenId}:`, tokenError);
        results.failures.push({
          tokenId,
          error: tokenError.message,
        });
      }
    }

    // Revalidate cache to ensure updated data
    revalidateTag("single");

    return {
      status: results.failures.length === 0 ? "success" : "partial_success",
      message: `Created song and processed ${results.successes.length} tokens. ${results.failures.length} failed.`,
      details: results,
    };
  } catch (error) {
    console.error("Error while creating single with tokens:", error);
    return {
      status: "error",
      message: "Error occurred while creating the single.",
    };
  }
};
