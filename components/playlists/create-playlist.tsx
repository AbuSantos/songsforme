import { Cross1Icon } from "@radix-ui/react-icons";

import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import React, { useState } from "react";
import { createplaylist } from "@/actions/create-playlist";


export const CreatePlaylist = () => {
    const [isPending, startTransition] = React.useTransition()
    const [playlist, setPlaylist] = useState<string>("");
    const userId = "0x0A6C1E3103E03e9289069Ad1a02761E0cc7b1B66"

    const addToPlaylist = () => {
        startTransition(() => {
            createplaylist(userId, playlist).then((data) => {

                console.log(data)
                //         // toast({
                //         //     description: data.message,
                //         // });
            }).catch((error) => {
                console.error("Error:", error);
                //         // toast({
                //         //     description: "An error occurred. Please try again.",
                //         // });
            });
        })
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="text-gray-800" size="nav">Create Playlist </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <h1 className="text-gray-100 text-center p-3">Playlist Name</h1>
                <div className="flex flex-col space-y-3">
                    <Input
                        value={playlist}
                        onChange={(e) => setPlaylist(e.target.value)}
                        placeholder="Playlist Name"
                        // disabled={isPending}
                        className="py-3 border-[0.7px] border-gray-700 outline-none h-12 text-gray-100"
                    />
                </div>
                <Button disabled={isPending} onClick={addToPlaylist} size="nav" className="mt-3 w-full bg-slate-50 text-gray-950">
                    submit
                </Button>
            </PopoverContent>

        </Popover>

    );
};
