import { Cross1Icon } from "@radix-ui/react-icons";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Dispatch, SetStateAction, useState, useTransition } from "react";
import { whiteListSchema } from "@/schemas"; // Make sure to define this schema
import { contract } from "@/lib/client";
import { prepareContractCall } from "thirdweb";
import { TransactionButton, useSendTransaction } from "thirdweb/react";
import { ethers } from "ethers";
import { Button } from "../ui/button";
import { toast } from "sonner"
import { FormError } from "../errorsandsuccess/form-error";
import { FormSuccess } from "../errorsandsuccess/form-success";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { addToWhiteList } from "@/actions/whitelist/add-to-whitelist";
import { mutate } from "swr";
type modalTypes = {
    setIsModalOpen: Dispatch<SetStateAction<boolean>>
}

export const AddToWhitelist = ({ adminId, userId }: { adminId: string, userId: string }) => {

    const [isPending, startTransition] = useTransition();
    const [address, setAddress] = useState<string>("0xD776Bd26eC7F05Ba1C470d2366c55f0b1aF87B30");
    const [isError, setIsError] = useState("");
    const [isSuccess, setIsSuccess] = useState("");


    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="text-gray-800 py-1" size="nav">Whitelist </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="flex flex-col space-y-3">
                    <Input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)} // Handling input
                        placeholder="NFT Contract Address"
                        disabled={isPending}
                        className="py-3 border-[0.7px] border-gray-700 outline-none h-12 text-gray-100"
                    />

                    <TransactionButton
                        transaction={() => {
                            const tx = prepareContractCall({
                                contract,
                                //@ts-ignore
                                method: "function addToWhiteList(address _user)",
                                params: [address],
                            });
                            return tx;
                        }}
                        onTransactionConfirmed={async (receipt) => {
                            if (receipt.status === "success") {
                                try {
                                    await addToWhiteList(adminId, userId);
                                    mutate(`/api/user/${userId}`)
                                    toast.success("User added Successfully!");
                                } catch (error) {
                                    toast.error("Error adding user!");
                                }
                            }
                        }}

                        onError={(error) =>
                            setIsError(error.message)
                        }
                    >
                        Save
                    </TransactionButton>

                    < FormError message={isError} />
                    < FormSuccess message={isSuccess} />
                </div>
            </PopoverContent>

        </Popover>

    );
};
