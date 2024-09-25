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
import { SelectPlaylist } from "./selectplaylist";


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
                <SelectPlaylist />
            </PopoverContent>

        </Popover>

    );
};
