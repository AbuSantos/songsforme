import { prepareContractCall, toWei } from "thirdweb";
import { TransactionButton } from "thirdweb/react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { contract } from "@/lib/client";

// Interface defining the props for the BuyNFT component
interface NFTProps {
    nftAddress: string; // The address of the NFT contract
    tokenId: number;    // The unique identifier for the NFT being purchased
    price: number;      // The price of the NFT in Ether (as a number)
}

// BuyNFT Component for handling the purchase of an NFT on the blockchain
export const BuyNFT = ({ nftAddress, tokenId, price }: NFTProps) => {
    return (
        <div>
            {/* TransactionButton is a wrapper from thirdweb to handle blockchain transactions */}
            <TransactionButton
                className="w-[60px] p-2 bg-black" // Styling for the button
                // Function to prepare the contract call and create the transaction
                transaction={() => {
                    // Prepare the contract call using the contract and method provided
                    const tx = prepareContractCall({
                        contract, // This is the blockchain contract reference
                        method: "function buyBull(address _nftContract, uint256 _tokenId) payable", // The smart contract function for buying NFTs
                        params: [nftAddress, tokenId], // Parameters required by the contract method (NFT contract address and tokenId)
                        value: toWei(price.toString()), // Convert the price from Ether to Wei (smallest unit of Ether)
                    });
                    return tx; // Return the transaction object
                }}
                // Handle successful transaction confirmation
                onTransactionConfirmed={(tx) => {
                    // Log the transaction details to the console (could be extended to update the UI or database)
                    console.log("Transaction Confirmed:", tx);
                }}
                // Handle errors that occur during the transaction process
                onError={(error) => {
                    // Display an error toast notification using the `sonner` library
                    toast.error("NFT Error", {
                        description: error.message, // Display the actual error message for debugging
                    });
                }}
            >
                {/* Button text indicating the action */}
                Buy
            </TransactionButton>
        </div>
    );
};
