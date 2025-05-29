"use client"
import { prepareContractCall, toWei } from "thirdweb";
import { TransactionButton } from "thirdweb/react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { contract } from "@/lib/client";
import { useTransition } from "react";
import { buyNFT } from "@/actions/buy-song";

// Interface defining the props for the BuyNFT component
interface NFTProps {
    buyer: string
    nftAddress: string; // The address of the NFT contract
    tokenId: string;    // The unique identifier for the NFT being purchased
    price: number;      // The price of the NFT in Ether (as a number)
    listedNftId: string
    usrname: string | undefined
    email: string
    itemLink?: string
}

// BuyNFT Component for handling the purchase of an NFT on the blockchain
export const BuyNFT = ({ buyer, nftAddress, tokenId, price, listedNftId, usrname, email }: NFTProps) => {

    const [isPending, startTransition] = useTransition();
    const transactionHash = "0xCeC2f962377c87dee0CA277c6FcC762254a8Dcd9"// This is a placeholder transaction hash for testing


    const { protocol, host } = window.location;

    const currentUrl = `${protocol}//${host}/dashboard/trackinfo/${nftAddress}${tokenId ? `?tokenId=${tokenId}` : ""
        }`;

    const handleBuyNft = (price: number, transactionHash: string) => {
        startTransition(async () => {
            try {
                const res = await buyNFT(buyer, price, listedNftId, transactionHash, usrname, email, currentUrl)
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
        <div className="z-10 w-[100%] ">
            <TransactionButton
                unstyled={false}
                style={{
                    background: '#000000',
                    color: '#FFFFFF',
                    width: '100%',
                    paddingTop: '0.5rem',
                    paddingBottom: '0.5rem',
                    paddingLeft: '1rem',
                    paddingRight: '1rem',
                    border: '1px solid #2A2A2A',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease, color 0.3s ease',
                    borderRadius: '0.375rem',
                    minWidth: 'auto',
                    fontSize: '1rem',

                }}
                // Function to prepare the contract call and create the transaction
                transaction={() => {
                    // Prepare the contract call using the contract and method provided
                    const tx = prepareContractCall({
                        contract, // This is the blockchain contract reference
                        //@ts-ignore
                        method: "function buyBull(address _nftContract, uint256 _tokenId) payable", // The smart contract function for buying NFTs
                        params: [nftAddress, tokenId], // Parameters required by the contract method (NFT contract address and tokenId)
                        value: toWei(price.toString()), // Convert the price from Ether to Wei (smallest unit of Ether)
                    });
                    return tx;
                }}

                // Handle successful transaction confirmation
                onTransactionConfirmed={(tx) => {
                    if (tx.status === "success") {
                        handleBuyNft(price, tx.transactionHash)
                        toast.success("NFT purchased successfully!")
                    }
                }}
                onError={(error) => {
                    // Display an error toast notification using the `sonner` library
                    toast.error("NFT Error", {
                        description: error.message, // Display the actual error message for debugging
                    });
                    console.log(error);
                }}
            >
                Buy NFT
            </TransactionButton>
        </div>

    );
};
