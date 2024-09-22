import { ethers } from "ethers";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";

export const ListNFTForm = ({ setIsOpen }) => {
  const [nftAddress, setNftAddress] = useState("0xD776Bd26eC7F05Ba1C470d2366c55f0b1aF87B30");
  const [tokenId, setTokenId] = useState(2);
  const [price, setPrice] = useState("0.01"); // Price in ETH
  const [isPending, setIsPending] = useState(false);

  // Submit handler for listing NFT
  const onSubmit = async () => {
    try {
      setIsPending(true);
      // Connect to MetaMask wallet (you can replace this with your preferred provider)
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      // The ABI for the listBull function
      const abi = [
        "function listBull(address _nftAddress, uint256 _tokenId, uint256 _price) payable",
      ];

      // Create a contract instance
      const contractAddress = "0x12ccb2398E10EbBAD1E490857d891741039CE2B5"; // Replace with your contract address
      const contract = new ethers.Contract(contractAddress, abi, signer);

      // Convert price to wei
      const priceInWei = ethers.utils.parseEther(price);

      // Send the transaction
      const tx = await contract.listBull(nftAddress, tokenId, priceInWei, {
        value: priceInWei,
      });

      // Wait for the transaction to be mined
      await tx.wait();

      console.log("NFT listed successfully!");

    } catch (err) {
      console.error("Transaction failed:", err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative bg-gray-900 rounded-md w-3/6 py-4 px-6">
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="text-red-700 cursor-pointer text-end"
        >
          X
        </button>

        {/* Form */}
        <form className="space-y-6">
          <Input
            placeholder="NFT Contract Address"
            value={nftAddress}
            onChange={(e) => setNftAddress(e.target.value)}
            className="py-3 border-none bg-gray-800 outline-none h-12"
          />
          <Input
            placeholder="Token ID"
            type="number"
            value={tokenId}
            onChange={(e) => setTokenId(Number(e.target.value))}
            className="py-3 border-none bg-gray-800 outline-none h-12"
          />
          <Input
            placeholder="Price in ETH"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="py-3 border-none bg-gray-800 outline-none h-12"
          />
          <Button size="lg" className="w-full bg-teal-600 p-4" onClick={onSubmit} disabled={isPending}>
            {isPending ? "Listing NFT..." : "List NFT"}
          </Button>
        </form>
      </div>
    </div>
  );
};
