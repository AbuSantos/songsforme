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

type AceeptOfferTypes = {
    bidId: string
}
export const AcceptBidOffer = ({ bidId }: AceeptOfferTypes) => {


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
                setIsError("An error occurred. Please try again.");
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

            <button className="text-black bg-[teal] px-3 py-1 capitalize" onClick={handleAcceptOffer}>
                accept Offer
            </button>


        </div>
    );
};
