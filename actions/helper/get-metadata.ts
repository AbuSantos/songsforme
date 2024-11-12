import { Network, Alchemy } from "alchemy-sdk";

const settings = {
  apiKey: "Bgl1yhzD-eN0JQKZcp1lQmSzMassO6ZK", // Replace with your Alchemy API Key.
  network: Network.ETH_SEPOLIA, // Replace with the network your NFT is on.
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
