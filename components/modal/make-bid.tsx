import { Cross1Icon } from "@radix-ui/react-icons";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { ListNFTSchema } from "@/schemas"; // Make sure to define this schema
import { client, contract } from "@/lib/client";
import { prepareContractCall } from "thirdweb";
import { TransactionButton, useSendTransaction } from "thirdweb/react";

import { ethers } from "ethers";
import { Button } from "../ui/button";
import { FormField } from "../ui/form";


export const MakeBid = ({ setIsOpen }) => {
    const [isPending, startTransition] = useTransition();
    // const [nftAddress, setNftAddress] = useState("0xD776Bd26eC7F05Ba1C470d2366c55f0b1aF87B30");
    // const [tokenId, setTokenId] = useState(2);
    // const [price, setPrice] = useState("0.01");
    const [transaction, setTransaction] = useState()
    const [errorMessage, setErrorMessage] = useState("");

    // Initialize form with validation
    const form = useForm({
        resolver: zodResolver(ListNFTSchema),
        defaultValues: {
            address: "0xD776Bd26eC7F05Ba1C470d2366c55f0b1aF87B30",
            tokenId: 2,
            price: "0.01",
        },
    });

    // Submit handler
    const onSubmit = async (values: z.infer<typeof ListNFTSchema>) => {
        startTransition(() => {
            try {
                const priceInWei = ethers.utils.parseEther(values.price); // Convert price to wei

                const transaction = prepareContractCall({
                    contract,
                    method: "bid",
                    params: [values.tokenId, values.address],
                });

                setTransaction(transaction)

            } catch (err) {
                console.error("Error preparing transaction:", err);
                setErrorMessage("An error occurred. Please try again.");
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
            <div className="relative bg-gray-900 rounded-md w-3/6 py-4 px-6">
                {/* Close button */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-red-700 cursor-pointer text-end"
                >
                    <Cross1Icon className="size-4" />
                </button>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Token ID Input */}
                    <FormField
                        control={form.control}
                        name="tokenId"
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Token ID"
                                disabled={isPending}
                                className="py-3 border-none bg-gray-800 outline-none h-12"
                            />
                        )}
                    />

                    {/* Price Input */}
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Price in ETH"
                                disabled={isPending}
                                className="py-3 border-none bg-gray-800 outline-none h-12"
                            />
                        )}
                    />

                    {/* NFT Address Input */}
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="NFT Contract Address"
                                disabled={isPending}
                                className="py-3 border-none bg-gray-800 outline-none h-12"
                            />
                        )}
                    />

                    <TransactionButton
                        transaction={() => transaction}
                        onTransactionConfirmed={() => console.log("lising")}
                        onError={(error) => console.log(error, "error")}
                    >
                        Confirm Transaction
                    </TransactionButton>
                </form>

                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            </div>
        </div>
    );
};
