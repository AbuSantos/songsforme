"use client"
import { prepareContractCall, toWei } from "thirdweb";
import { TransactionButton } from "thirdweb/react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { contract } from "@/lib/client";
import { useEffect, useTransition } from "react";
import { buyNFT } from "@/actions/buy-song";
import { baseSepolia } from 'wagmi/chains'
import {
    type BaseError,
    useAccount,
    useSendTransaction,
    useWaitForTransactionReceipt,
    useEstimateFeesPerGas,
} from 'wagmi'
import { formatEther, parseEther } from "viem";

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
    const { address } = useAccount();

    const currentUrl = `${protocol}//${host}/dashboard/trackinfo/${nftAddress}${tokenId ? `?tokenId=${tokenId}` : ""
        }`;

    const { data: hash, isPending: transactionPending, sendTransaction } = useSendTransaction();
    const { data: estimatedFees } = useEstimateFeesPerGas({ chainId: baseSepolia.id });

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        })


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


    const handleWagmiTransaction = async () => {
        try {

            const gasFees = {
                gas: CUSTOM_GAS_LIMIT,
                maxFeePerGas: estimatedFees?.maxFeePerGas ?? CUSTOM_MAX_FEE,
                maxPriorityFeePerGas: estimatedFees?.maxPriorityFeePerGas ?? CUSTOM_PRIORITY_FEE,
            }

            // Log estimated costs for transparency
            console.log('Transaction details:', {
                to: nftAddress,
                value: formatEther(BigInt(toWei(price.toString()))),
                estimatedGas: formatEther(gasFees.gas * (gasFees.maxFeePerGas)),
                chainId: baseSepolia.id
            })

            await sendTransaction({
                to: nftAddress as `0x${string}`,
                value: BigInt(toWei(price.toString())),
                chainId: baseSepolia.id
                // ...gasFees,
            })
        } catch (error) {
            // toast.error("Failed to send transaction")
            console.log(error)
        }
    }

    // useEffect(() => {
    //     if (isConfirmed && hash) {
    //         handleBuyNft(price, hash)
    //         toast.success("NFT purchased successfully!")
    //     } else if (transactionPending) {
    //         toast.loading("Transaction is pending...")
    //     }
    // }, [isConfirmed, hash, transactionPending])

    return (
        // <div>
        //     {/* sending transaction using wagmi */}

        //     <button onClick={() => handleWagmiTransaction()} disabled={isPending} className="bg-[var(--button-bg)] p-2 w-28 md:w-32 rounded-md">
        //         {/* {isConfirming && <span>Waiting for confirmation...</span>}
        //         {isConfirmed && <span>Transaction confirmed.</span>} */}
        //         {isPending ? 'Confirming...' : 'Send'}
        //     </button>

        // </div>
        
        <div className="z-10">
            <TransactionButton
                className="w-[60px] p-2 bg-black"
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
                    return tx; // Return the transaction object
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
                Buy
            </TransactionButton>
        </div>

    );
};
