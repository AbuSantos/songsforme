"use client"
import { Cross1Icon, PlusCircledIcon } from "@radix-ui/react-icons";

import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import React, { useState } from "react";
import { createUser } from "@/actions/create-user";
import { useActiveAccount } from "thirdweb/react";
import { Account } from "thirdweb/wallets";


export const CreatePlaylist = () => {
    const [isPending, startTransition] = React.useTransition()
    const [username, setUsername] = useState<string>("");
    const userId = useActiveAccount();

    const addUser = () => {
        startTransition(() => {
            createUser(userId, username).then((data) => {
                toast({
                    data.message,
                });
                setUsername("")
            }).catch((error) => {
                console.error("Error:", error);
                toast(
                    error.message,
                );
            });
        })
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <PlusCircledIcon className="w-6 h-6 text-gray-300 hover:text-gray-50 cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <h1 className="text-gray-100 text-center p-3">Playlist Name</h1>
                <div className="flex flex-col space-y-3">
                    <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        disabled={isPending}
                        className="py-3 border-[0.7px] border-gray-700 outline-none h-12 text-gray-100"
                    />
                </div>
                <Button disabled={isPending} onClick={addUser} size="nav" className="mt-3 w-full bg-slate-50 text-gray-950">
                    Add user
                </Button>
            </PopoverContent>

        </Popover>

    );
};
