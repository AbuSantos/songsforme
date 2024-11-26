import { Network, Alchemy } from "alchemy-sdk";

const settings = {
  apiKey: process.env.ALCHEMY_KEY,
  network: Network.ETH_SEPOLIA,
};

const alchemy = new Alchemy(settings);

export async function getNFTMetadata(
  nftContractAddress: string,
  tokenId: string
) {
  // const nfts = await alchemy.nft.getNftsForOwner(nftContractAddress);
  // Making a call to the Alchemy API to get the metadata
  const response = await alchemy.nft.getNftMetadata(
    nftContractAddress,
    tokenId
  );
  return response; // returning the metadata
}
