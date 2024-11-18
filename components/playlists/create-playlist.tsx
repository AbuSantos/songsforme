"use client"
import { Cross1Icon, PlusCircledIcon } from "@radix-ui/react-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query"
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
import { mutate } from "swr";

type ModalProps = {
    id: string
}

export const CreatePlaylist = ({ id }: ModalProps) => {
    const [isPending, startTransition] = React.useTransition()
    const [playlist, setPlaylist] = useState<string>("");

    const addToPlaylist = () => {
        startTransition(() => {
            createplaylist(id, playlist).then((data) => {
                toast("Playlist", {
                    description: data?.message,
                });
                mutate(`/api/playlists/${id}`)
                setPlaylist("")
            }).catch((error) => {
                console.error("Error:", error);
                toast("Error", {
                    description: "An error occurred. Please try again.",
                });
            });
        })
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <PlusCircledIcon className="w-6 h-6 text-[#111111] md:text-gray-300 hover:text-gray-50 cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <h1 className="text-gray-100 text-center p-3">Playlist Name</h1>
                <div className="flex flex-col space-y-3">
                    <Input
                        value={playlist}
                        onChange={(e) => setPlaylist(e.target.value)}
                        placeholder="Playlist Name"
                        disabled={isPending}
                        className="py-3 border-[0.7px] border-gray-700 outline-none h-12 text-gray-100"
                    />
                </div>
                <Button disabled={isPending} onClick={addToPlaylist} size="nav" className="mt-3 w-full bg-slate-50 text-gray-950">
                    create playlist
                </Button>
            </PopoverContent>

        </Popover>

    );
};
