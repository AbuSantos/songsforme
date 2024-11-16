"use client"
import { prepareContractCall, toWei } from "thirdweb";
import { TransactionButton } from "thirdweb/react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { contract } from "@/lib/client";
import { useTransition } from "react";
import { buyNFT } from "@/actions/buy-song";
import { useRecoilValue } from "recoil";
import { isConnected } from "@/atoms/session-atom";

// Interface defining the props for the BuyNFT component
interface NFTProps {
    buyer: string
    nftAddress: string; // The address of the NFT contract
    tokenId: string;    // The unique identifier for the NFT being purchased
    price: number;      // The price of the NFT in Ether (as a number)
    listedNftId: string
}

// BuyNFT Component for handling the purchase of an NFT on the blockchain
export const BuyNFT = ({ buyer, nftAddress, tokenId, price, listedNftId }: NFTProps) => {
    const [isPending, startTransition] = useTransition();

    const transactionHash = "0xCeC2f962377c87dee0CA277c6FcC762254a8Dcd9"
    const handleBuyNft = (price: number, transactionHash: string) => {
        console.log(buyer, price, listedNftId)
        startTransition(async () => {
            try {
                const res = await buyNFT(buyer, price, listedNftId, transactionHash)
                if (res.message) {
                    toast.success(res.message)
                } else {
                    toast.error("Purchase failed, try again!")
                }
            } catch (error: any) {
                toast.error("Something went wrong", error.message)
            }
        })

    }

    return (
        // <div>

        //     <TransactionButton
        //         className="w-[60px] p-2 bg-black"
        //         // Function to prepare the contract call and create the transaction
        //         transaction={() => {
        //             // Prepare the contract call using the contract and method provided
        //             const tx = prepareContractCall({
        //                 contract, // This is the blockchain contract reference
        //                 //@ts-ignore
        //                 method: "function buyBull(address _nftContract, uint256 _tokenId) payable", // The smart contract function for buying NFTs
        //                 params: [nftAddress, tokenId], // Parameters required by the contract method (NFT contract address and tokenId)
        //                 value: toWei(price.toString()), // Convert the price from Ether to Wei (smallest unit of Ether)
        //             });
        //             return tx; // Return the transaction object
        //         }}
        //         // Handle successful transaction confirmation
        //         onTransactionConfirmed={(tx) => {
        //             // Log the transaction details to the console (could be extended to update the UI or database)
        //             console.log("Transaction Confirmed:", tx);
        //             if (tx.status === "success") {
        //                 handleBuyNft(price, tx.transactionHash)
        //                 toast.success("NFT purchased successfully!")
        //             }
        //         }}
        //         // Handle errors that occur during the transaction process
        //         onError={(error) => {
        //             // Display an error toast notification using the `sonner` library
        //             toast.error("NFT Error", {
        //                 description: error.message, // Display the actual error message for debugging
        //             });
        //         }}
        //     >
        //         {/* Button text indicating the action */}
        //         Buy
        //     </TransactionButton>
        // </div>

        <div>
            <button onClick={() => handleBuyNft(price, transactionHash)} disabled={isPending}>
                buy nft
            </button>
        </div>
    );
};
