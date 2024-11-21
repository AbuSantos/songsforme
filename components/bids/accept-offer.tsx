import { z } from "zod";
import { Dispatch, SetStateAction, useState, useTransition } from "react";
import { AcceptBidSchema } from "@/schemas"; // Make sure to define this schema
import { contract } from "@/lib/client";
import { prepareContractCall } from "thirdweb";
import { TransactionButton, useSendTransaction } from "thirdweb/react";
import { Button } from "../ui/button";
import { toast } from "sonner"

import { toTokens } from "thirdweb/utils";
import { acceptOffer } from "@/actions/accept-bid-offer";
import { mutate } from "swr";

type AceeptOfferTypes = {
    bidId: string
    tokenId: string
    nftAddress: string
}
export const AcceptBidOffer = ({ bidId, tokenId, nftAddress }: AceeptOfferTypes) => {


    console.log(bidId, "bid from client")
    const [isPending, startTransition] = useTransition();
    const [transaction, setTransaction] = useState()
    const [isError, setIsError] = useState("");
    const [isSuccess, setIsSuccess] = useState("");

    const handleAcceptOffer = async () => {
        startTransition(async () => {
            try {
                const res = await acceptOffer(bidId)
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
                        method: "acceptOffer",
                        //@ts-ignore
                        params: [tokenId, nftAddress],
                    })
                    return tx
                }}

                onTransactionConfirmed={(tx) => {
                    if (tx.status === "success") handleAcceptOffer()
                    console.log("listing", tx)
                }}
                onError={(error) => toast.error(error.message)}
            >
                Accept Offer
            </TransactionButton>

            {/* <button className="text-black bg-[teal] px-3 py-1 capitalize" onClick={handleAcceptOffer}>
                accept Offer
            </button> */}


        </div>
    );
};
