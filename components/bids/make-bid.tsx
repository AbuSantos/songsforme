"use client"
import { useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { contract } from "@/lib/client";
import { prepareContractCall, toWei } from "thirdweb";
import { TransactionButton } from "thirdweb/react";
import { Button } from "../ui/button";
import { FormError } from "../errorsandsuccess/form-error";
import { FormSuccess } from "../errorsandsuccess/form-success";
import { getContractEvents } from "thirdweb";
import { ethers } from "ethers";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { MakeBidBackend } from "@/actions/make-bid";
import { toast } from "sonner";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/utils";
import { Separator } from "../ui/separator";

interface NFTProps {
    tokenId: string,
    nftAddress: string,
    nftId: string,
    userId: string,
}

export const MakeBid = ({
    tokenId,
    nftAddress,
    nftId,
    userId, }: NFTProps) => {
    const [isPending, startTransition] = useTransition();
    const [bidAmount, setBidAmount] = useState<string>("0.00");
    const [selectedIncrease, setSelectedIncrease] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isSuccess, setIsSuccess] = useState<string>("");

    const bidder = userId

    const transactionHash = '0x7f72061d8378D00743556DA234DC29D4c07E848C'
    const apiUrl = `/api/bids/${tokenId}?nftAddress=${nftAddress}`;

    // Fetch data using SWR
    const { data: bids, error, isLoading } = useSWR(apiUrl, fetcher, {
        shouldRetryOnError: true,
        errorRetryCount: 3,
    });

    const handleBidBackEnd = (transactionHash: string) => {
        const bidAmountValue = parseFloat(bidAmount)

        startTransition(async () => {
            try {
                const res = await MakeBidBackend(
                    { tokenId, nftAddress, nftId, bidder, bidAmount: bidAmountValue, transactionHash, userId }
                )
                if (res.success === true) {
                    mutate(apiUrl)
                    toast.success(res.message)
                } else if (res.success === false) {
                    toast.success(res.message)
                }
            } catch (error: any) {
                toast.error(error.message)
            }

        })
    }
    const handleValue = (percentage: number) => {
        if (!bids?.data) return
        //@ts-ignore
        const bid = bids?.data?.reduce((max: number, current: number) => (current.bidAmount > max ? current.bidAmount : max), -Infinity);
        const bidPercent = (percentage / 100) * bid
        const bidMade = bidPercent + bid
        setBidAmount(bidMade);
        setSelectedIncrease(percentage);
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="text-gray-800" size="nav">Bid</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">

                <div className="flex flex-col space-y-3">
                    <h1 className="text-center text-gray-300 py-4">Percentage increase from highest bidder</h1>

                    {isLoading ? (
                        <p className="text-center text-gray-500">Loading current bids...</p>
                    ) : (
                        <div className="grid grid-cols-4 p-2 gap-2 w-full ">
                            {[1, 3, 5, 10].map((percentage) => (
                                <span
                                    key={percentage}
                                    className={`bg-[#7B7B7B] text-[#111111] w-full cursor-pointer rounded-md text-center py-2 ${selectedIncrease === percentage && "bg-[#5B5BD6] text-[#E0DFFE]"
                                        }`}
                                    onClick={() => handleValue(percentage)}
                                >
                                    +{percentage}%
                                </span>
                            ))}
                        </div>
                    )}
                    <Input
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder="Price in ETH"
                        disabled={isPending}
                        className="py-3 border-[0.7px] border-gray-700 outline-none h-12 text-gray-100 mb-3 "
                    />


                    <div className="flex justify-between space-x-2 p-2 text-[var(--textSoft)]  mt-6 mb-6">
                        <h2 className="capitalize ">you pay</h2>
                        <span>{bidAmount} ETH</span>
                    </div>

                    <Separator className=" border-t-[#606060] h-[0.7px] mt-3" />


                    <TransactionButton
                        transaction={() => {
                            const tx = prepareContractCall({
                                contract,
                                method: "bid",
                                //@ts-ignore
                                params: [tokenId, nftAddress],
                                value: toWei(bidAmount),
                            });
                            return tx;
                        }}
                        onTransactionConfirmed={(tx) => {
                            if (tx.status === "success") {
                                handleBidBackEnd(
                                    tx.transactionHash
                                )
                            }
                        }}
                        onError={(error) => toast.error(error.message)}
                    >
                        Make Bid
                    </TransactionButton>

                    {/* //FOR TESTING */}
                    {/* <button onClick={() => handleBidBackEnd(transactionHash)} className="text-gray-200">
                        Bid
                    </button> */}
                </div>
            </PopoverContent>
        </Popover>

    );
};


