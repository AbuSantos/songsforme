"use client";
import { ethers } from "ethers";
import { startTransition, useState } from "react";
import { toast } from "sonner";
import { contractAddress, nftMintingABI } from "./client";

// Toggle function to switch buy/sell mode for individual NFTs
export const ToggleBuySell = async (
  nftId: string,
  tokenId: string,
  nftContractAddress: string
) => {
    const [isEnabled, setIsEnabled] = useState<Record<string, boolean>>({});
  const newBuyingState = !isEnabled[nftId];

  try {
    if (!window.ethereum) {
      toast.error("Please install MetaMask");
      return;
    }

    // Request MetaMask connection first
    await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    // Try switching to Sepolia, if it fails, try adding the network
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }], // Sepolia chainId
      });
    } catch (switchError: any) {
      // This error code means the chain has not been added to MetaMask
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

    // Now initialize provider and signer
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []); // Ensure connection
    const signer = await provider.getSigner();

    const userAddress = await signer.getAddress();

    console.log("Token ID:", tokenId);
    console.log("User Address:", userAddress);

    if (newBuyingState === true) {
      try {
        // Validate contract
        if (!ethers.utils.isAddress(nftContractAddress)) {
          throw new Error("Invalid contract address");
        }

        const newContract = new ethers.Contract(
          nftContractAddress,
          nftMintingABI,
          signer
        );

        // Convert tokenId and verify contract methods
        const tokenIdBN = ethers.BigNumber.from(tokenId);

        // Check if contract has ownerOf method
        if (!newContract.ownerOf) {
          throw new Error("Invalid NFT contract - missing ownerOf method");
        }

        // Try getting token owner with timeout
        const ownerPromise = newContract.ownerOf(tokenIdBN);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Owner check timed out")), 10000)
        );

        const owner = await Promise.race([ownerPromise, timeoutPromise]);

        console.log("Owner:", owner);

        if (!owner || owner.toLowerCase() !== userAddress.toLowerCase()) {
          toast.error("You don't own this NFT");
          return;
        }

        const tx = await newContract.approve(contractAddress, tokenIdBN);

        //await for the transaction to be mined
        const receipt = await tx.wait();

        if (receipt.status !== 1) {
          toast.error("Transaction failed");
          return;
        }
        toast.success("NFT approved successfully");
      } catch (error: any) {
        console.error("Contract error:", error);
        toast.error(error.message || "Failed to verify ownership");
        return;
      }
    }

    // Toggle sale state after successful approval
    startTransition(async () => {
      //@ts-ignore
      const res = await toggleState(nftId, newBuyingState);
      if (res.message) {
        toast.success(res.message);
        setIsEnabled((prev) => ({
          ...prev,
          [nftId]: newBuyingState,
        }));
        window.localStorage.setItem(
          `sell_${nftId}`,
          JSON.stringify(newBuyingState)
        );
      }
    });
  } catch (error: any) {
    toast.error(error.message || "Failed to toggle sale state");
  }
};
