"use server"

import { db } from "@/lib/db";

// Calculate rewards for the user and each NFT owner
export const calculateRewards = async (userId: string) => {
    // Fetch all the NFT listening records for the user
    const listeningRecords = await db.nftListeningTime.findMany({
      where: { userId },
      include: { nft: true }, // Include the associated NFT data
    });
  
    // Fetch total accumulated listening time for this user
    const totalListeningTime = listeningRecords.reduce((sum, record) => sum + record.accumulatedTime, 0);
  
    if (totalListeningTime === 0) {
      return { message: "No listening time accumulated." };
    }
  
    // Set a total reward (this would be calculated based on some criteria)
    const totalReward = 1000 * 10 ** 18; // Example total reward in tokens
  
    // Calculate proportional rewards
    for (const record of listeningRecords) {
      const nftListeningTime = record.accumulatedTime;
      const nftOwnerReward = (nftListeningTime / totalListeningTime) * totalReward * 0.10; // 10% royalty to NFT owner
      const listenerReward = (nftListeningTime / totalListeningTime) * totalReward * 0.90; // 90% to listener
  
      console.log(`NFT ${record.nft.tokenId} owner earns: ${nftOwnerReward}`);
      console.log(`Listener earns: ${listenerReward}`);
  
      // Call your smart contract to distribute rewards (use the listenerReward and nftOwnerReward)
    }
  
    return { message: "Rewards calculated and distributed." };
  };
  