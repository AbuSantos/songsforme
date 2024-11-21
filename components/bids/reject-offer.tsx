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
    const [transaction, setTransaction] = useState()

    const handleAcceptOffer = () => {
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
    // Submit handler
    const onSubmit = async (values: z.infer<typeof AcceptBidSchema>) => {
        startTransition(() => {
            try {
                const transaction = prepareContractCall({
                    contract,
                    method: "acceptOffer",
                    //@ts-ignore

                    params: [values.tokenId, values.address],
                });
                //@ts-ignore
                setTransaction(transaction)

            } catch (err) {
                console.error("Error preparing transaction:", err);
            }
        });
    };


    return (
        <div className="">
            {/* <TransactionButton
                //@ts-ignore

                transaction={() => transaction}
                onTransactionConfirmed={() => console.log("listing")}
                //@ts-ignore
                onSuccess={(success) => setIsSuccess(success)}
                onError={(error) =>
                    setIsError(error.message)
                }
            >
                Accept Offer
            </TransactionButton> */}

            <button className="text-black bg-red-400 px-2 py-1 rounded-md capitalize" onClick={handleAcceptOffer}>
                reject Offer
            </button>


        </div>
    );
};
