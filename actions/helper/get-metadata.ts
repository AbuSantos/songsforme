import { Network, Alchemy } from "alchemy-sdk";

if (!process.env.ALCHEMY_KEY) {
  console.error("Missing environment variables");
}

const settings = {
  apiKey: process.env.ALCHEMY_KEY!,
  network: Network.BASE_SEPOLIA,
};

const alchemy = new Alchemy(settings);
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(
  nftContractAddress: string,
  tokenId: string,
  maxRetries: number = 3
) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await alchemy.nft.getNftMetadata(nftContractAddress, tokenId);
    } catch (error: any) {
      if (error?.message?.includes("429") && attempt < maxRetries) {
        const waitTime = Math.min(1000 * Math.pow(2, attempt), 10000);
        console.log(
          `Rate limited, retrying in ${waitTime}ms... (Attempt ${attempt}/${maxRetries})`
        );
        await delay(waitTime);
        continue;
      }
      throw error;
    }
  }
  throw new Error("Max retry attempts reached");
}

export async function getNFTMetadata(
  nftContractAddress: string,
  tokenId: string
) {
  return await fetchWithRetry(nftContractAddress, tokenId);
}
