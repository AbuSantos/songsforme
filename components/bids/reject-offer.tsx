import { z } from "zod";
import { Dispatch, SetStateAction, useState, useTransition } from "react";
import { AcceptBidSchema } from "@/schemas"; // Make sure to define this schema
import { contract } from "@/lib/client";
import { prepareContractCall } from "thirdweb";
import { TransactionButton, useSendTransaction } from "thirdweb/react";
import { Button } from "../ui/button";
import { toast } from "sonner"

import { rejectOffer } from "@/actions/reject-bid-offer";
import { mutate } from "swr";

type RejectBidTypes = {
    bidId: string
    tokenId: string,
    nftAddress: string
}

export const RejectBidOffer = ({ bidId, tokenId, nftAddress }: RejectBidTypes) => {

    const [isPending, startTransition] = useTransition();

    const handleRejectOffer = () => {
        startTransition(async () => {
            try {
                const res = await rejectOffer(bidId)
                if (res.message) {
                    toast.success(res.message)
                    mutate(`/api/bids/${tokenId}?nftAddress=${nftAddress}`)
                }
            } catch (error: any) {
                toast.success(error.message)
            }
        })
    }



    return (
        <div className="">
            <TransactionButton
                transaction={() => {
                    const tx = prepareContractCall({
                        contract,
                        //@ts-ignore
                        method: "function rejectBidOffer(uint256 _tokenId, address _nftAddress)",
                        params: [tokenId, nftAddress],
                    })
                    return tx
                }}

                onTransactionConfirmed={(tx) => {
                    if (tx.status === "success") handleRejectOffer()
                    console.log("listing", tx)
                }}
                onError={(error) => toast.error(error.message)}
                className="bg-[#E54D2E]"
            >
                Reject Offer
            </TransactionButton>
            {/* //FOR TESTING */}


            {/* <button className="text-black bg-red-400 px-2 py-1 rounded-md capitalize" onClick={handleAcceptOffer}>
                reject Offer
            </button> */}


        </div>
    );
};
