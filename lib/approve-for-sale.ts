"use client";
import { ethers } from "ethers";
import { useState } from "react";
import { toast } from "sonner";
import { contractAddress, nftMintingABI } from "./client";

export const useToggleBuySell = () => {
  const [isEnabled, setIsEnabled] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  const toggleBuySell = async (
    nftId: string,
    tokenId: string,
    nftContractAddress: string
  ) => {
    setIsLoading((prev) => ({ ...prev, [nftId]: true }));

    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask");
      }

      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Network handling
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xaa36a7" }], // Sepolia
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0xaa36a7",
                chainName: "Sepolia",
                rpcUrls: ["https://rpc.sepolia.org"],
                nativeCurrency: {
                  name: "Sepolia ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
              },
            ],
          });
        } else {
          throw switchError;
        }
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();

      const newBuyingState = !isEnabled[nftId];

      if (newBuyingState) {
        // Validate contract
        if (!ethers.utils.isAddress(nftContractAddress)) {
          throw new Error("Invalid contract address");
        }

        const nftContract = new ethers.Contract(
          nftContractAddress,
          nftMintingABI,
          signer
        );

        // Ownership check
        const owner = await nftContract.ownerOf(tokenId);
        if (owner.toLowerCase() !== userAddress.toLowerCase()) {
          throw new Error("You don't own this NFT");
        }

        // Approval
        const tx = await nftContract.approve(contractAddress, tokenId);
        const receipt = await tx.wait();

        if (receipt.status !== 1) {
          throw new Error("Approval transaction failed");
        }
      }

      // Update state after successful transaction
      setIsEnabled((prev) => ({ ...prev, [nftId]: newBuyingState }));
      localStorage.setItem(`sell_${nftId}`, JSON.stringify(newBuyingState));
      toast.success(
        `NFT ${newBuyingState ? "listed" : "unlisted"} successfully`
      );
    } catch (error: any) {
      console.error("Toggle error:", error);
      toast.error(error.message || "Transaction failed");
    } finally {
      setIsLoading((prev) => ({ ...prev, [nftId]: false }));
    }
  };

  return { toggleBuySell, isEnabled, isLoading };
};
