import { Cross1Icon } from "@radix-ui/react-icons";
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

async function getSigner() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        // Request wallet connection if needed
        await provider.send("eth_requestAccounts", []);

        // Get signer (connected wallet)
        const signer = provider.getSigner();
        const address = await signer.getAddress();

        console.log("Signer address:", address);
        return signer;
    } else {
        console.log("Ethereum wallet is not connected.");
        return null;
    }
}

export const MakeBid = () => {
    const [isPending, startTransition] = useTransition();
    const [price, setPrice] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isSuccess, setIsSuccess] = useState<string>("");




    const address = "0x1e2E9727b494AE01Cf8a99292869462AAe3CeCd0";
    const tokenId = 0;

    const listenToEvent = async () => {
        try {
            contract.on("BidMade", (bidder, tokenId, bidAmount) => {
                console.log(`Bidder: ${bidder}, TokenID: ${tokenId}, BidAmount: ${bidAmount}`);
            });
        } catch (error) {
            console.log("Error listening to event.");
        }
    };

    // Call this function once to start listening for events
    useEffect(() => {
        listenToEvent();
    }, []);

    const handleBid = async () => {
        try {
            // Ensure price is a valid number
            if (!price || isNaN(Number(price)) || Number(price) <= 0) {
                setErrorMessage("Please enter a valid price.");
                return null;
            }

            // Prepare transaction
            const tx = prepareContractCall({
                contract,
                method: "bid",
                params: [tokenId, address],
                value: toWei(price), // Convert price to Wei
            });
            return tx;
        } catch (error) {
            setErrorMessage("Failed to prepare transaction. Check input values.");
            return null;
        }
    };

    return (


        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="text-gray-800" size="nav">Bid</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">

                <div className="flex flex-col space-y-3">
                    <Input
                        value={price}
                        onChange={(e) => setPrice(e.target.value)} // Handling input
                        placeholder="Price in ETH"
                        disabled={isPending}
                        className="py-3 border-[0.7px] border-gray-700 outline-none h-12 text-gray-100"
                    />

                    <TransactionButton
                        transaction={handleBid}
                        onTransactionConfirmed={(receipt) => {
                            console.log("Transaction successful", receipt);
                            setIsSuccess("Bid Made Successfully")
                        }}
                        onError={(error) => setErrorMessage(error.message)}
                    >
                        Make Bid
                    </TransactionButton>
                    < FormError message={errorMessage} />
                    <FormSuccess message={isSuccess} />
                </div>
            </PopoverContent>

        </Popover>

    );
};
