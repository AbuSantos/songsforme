import { Cross1Icon } from "@radix-ui/react-icons";
import { Dispatch, SetStateAction, useState, useTransition } from "react";
import { contract } from "@/lib/client";
import { prepareContractCall } from "thirdweb";
import { TransactionButton, useSendTransaction } from "thirdweb/react";
import { ethers } from "ethers";
import { Button } from "../../ui/button";
import { FormField } from "../../ui/form";
import { toast } from "sonner"
import { FormError } from "../../errorsandsuccess/form-error";
import { FormSuccess } from "../../errorsandsuccess/form-success";


import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cancelListing } from "@/actions/cancel-listing";
type CancelProps = {
    address: string
    nftId: string
    tokenId: string
    userId: string
}

export const CancelListing = ({ address, tokenId, nftId, userId }: CancelProps) => {
    const [isPending, startTransition] = useTransition();


    const handleCancel = () => {
        startTransition(async () => {
            try {
                const res = await cancelListing(nftId, userId)
                if (res.message) {
                    toast.success(res.message)
                }
            } catch (error: any) {
                toast.error("Something went wrong", error.message)
            }

        })

    }


    return (
        <Popover>

            <PopoverTrigger asChild>
                <Button className="bg-slate-100 text-black ">
                    Cancel listing
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="relative bg-gray-900 rounded-md w-3/6 py-4 px-6">
                        <TransactionButton
                            transaction={() => {
                                // Create a transaction object and return it
                                const tx = prepareContractCall({
                                    contract,
                                    //@ts-ignore
                                    method:
                                        "function cancelListing(uint256 _tokenId, address _nftAddress)",
                                    params: [tokenId, address],
                                });
                                return tx;
                            }}
                            onTransactionConfirmed={(receipt) => {
                                console.log("Transaction confirmed", receipt.transactionHash);
                            }}

                            onError={(error) => {
                                console.error("Transaction error", error);
                            }}
                        >
                            Confirm Cancel Listing
                        </TransactionButton>
                    </div>

                    <button onClick={handleCancel}>
                        confirm cancel
                    </button>
                </div >
            </PopoverContent>
        </Popover>
    );
};
