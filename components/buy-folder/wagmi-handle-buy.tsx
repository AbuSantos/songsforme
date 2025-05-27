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

    // Custom gas settings for Base Sepolia
    const CUSTOM_GAS_LIMIT = 300000n 
    const CUSTOM_MAX_FEE = parseEther('0.00000001') 
    const CUSTOM_PRIORITY_FEE = parseEther('0.000000001') 

    const handleWagmiTransaction = async () => {
        try {

            const gasFees = {
                gas: CUSTOM_GAS_LIMIT,
                maxFeePerGas: estimatedFees?.maxFeePerGas ?? CUSTOM_MAX_FEE,
                maxPriorityFeePerGas: estimatedFees?.maxPriorityFeePerGas ?? CUSTOM_PRIORITY_FEE,
            }

            console.log('Estimated transaction cost:', formatEther(gasFees.gas * (gasFees.maxFeePerGas)), 'ETH')

            await sendTransaction({
                to: nftAddress as `0x${string}`,
                value: BigInt(toWei(price.toString())),
                chainId: baseSepolia.id,
                ...gasFees,
            })
        } catch (error) {
            toast.error("Failed to send transaction")
            console.error(error)
        }
    }

    useEffect(() => {
        if (isConfirmed && hash) {
            handleBuyNft(price, hash)
            toast.success("NFT purchased successfully!")
        } else if (transactionPending) {
            toast.loading("Transaction is pending...")
        }
    }, [isConfirmed, hash, transactionPending])

    return (
        <div>

            <button onClick={() => handleWagmiTransaction()} disabled={isPending} className="bg-[var(--button-bg)] p-2 w-28 md:w-32 rounded-md">
                {/* {isConfirming && <span>Waiting for confirmation...</span>}
                {isConfirmed && <span>Transaction confirmed.</span>} */}
                {isPending ? 'Confirming...' : 'Send'}
            </button>

        </div>

    );
};
