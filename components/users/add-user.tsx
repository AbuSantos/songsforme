"use client"
import { PlusCircledIcon } from "@radix-ui/react-icons";

import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import React, { Dispatch, SetStateAction, useState } from "react";
import { createUser } from "@/actions/create-user";
import { useActiveAccount } from "thirdweb/react";
import { Account } from "thirdweb/wallets";

interface UserProps {
    address: string,
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const CreateUsername = (
    { address, isOpen, setIsOpen }: UserProps
) => {
    const [isPending, startTransition] = React.useTransition()
    const [username, setUsername] = useState<string>("");
    const userId = useActiveAccount();

    const addUser = () => {
        startTransition(() => {
            createUser(address, username).then((data) => {
                console.log(data)
                toast(
                    data.message,
                );
                setUsername("")
                setIsOpen(false)
            }).catch((error) => {
                console.error("Error:", error);
                toast(
                    error.message,
                );
            });
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 ">
            <div className="relative bg-black rounded-md w-2/6 py-8 px-6 border-[0.7px] border-gray-600">
                <h1 className="text-gray-100 text-center p-3">Add a Username</h1>
                <div className="flex flex-col space-y-3">
                    <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        disabled={isPending}
                        className="py-3 border-[0.7px] border-gray-700 outline-none h-12 text-gray-100"
                    />
                </div>
                <Button disabled={isPending} onClick={addUser} size="nav" className="mt-3 w-full bg-slate-50 text-gray-950 hover:bg-slate-400">
                    Create user
                </Button>
            </div>
        </div>


    );
};
