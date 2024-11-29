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
import { Label } from "../ui/label";

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
    const [emailAddress, setEmailAddress] = useState<string>("");

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
            <div className="relative bg-black rounded-md md:w-2/6 w-[90%] py-8 px-6 border-[0.7px] border-gray-600">
                <div className="flex flex-col items-center justify-center ">
                    <p className="bg-gray-100 rounded-full size-12 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ fill: "rgba(0, 0, 0, 1)", transform: " msFilter" }}><path d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h17z"></path></svg>

                    </p>
                    <h1 className="text-gray-100 text-lg font-medium text-center p-3">Create a User Profile</h1>
                </div>

                <div className="flex flex-col space-y-3">
                    <Label htmlFor="username" className="text-gray-100">
                        Your username
                    </Label>
                    <Input
                        id="username"
                        value={username}
                        type="text"
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="@kingjulien"
                        disabled={isPending}
                        className="py-3 border-[0.7px] border-gray-700 outline-none h-12 text-gray-100"
                    />
                </div>
                <div className="flex flex-col space-y-3 mt-4">
                    <Label htmlFor="mail" className="text-gray-100">
                        Your email address (optional)
                    </Label>
                    <Input
                        id="mail"
                        value={emailAddress}
                        type="email"
                        onChange={(e) => setEmailAddress(e.target.value)}
                        placeholder="king@gmail.com"
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
