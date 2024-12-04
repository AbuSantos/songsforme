"use client";

import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { editRatio } from "@/actions/edit-ratio";
import { useRecoilValue } from "recoil";
import { isConnected } from "@/atoms/session-atom";

type ModalProps = {
    playlistId?: string;
    trackId?: string
    mode?: string
};

export const EditRatio = ({ playlistId, trackId, mode }: ModalProps) => {
    const [isPending, startTransition] = React.useTransition();
    const [ratio, setRatio] = useState<number>(0.0);
    const userId = useRecoilValue(isConnected)?.userId;

   
    const addToPlaylist = () => {
        if (!userId) {
            toast("Error", {
                description: "Please connect your wallet first.",
            });
            return;
        }

        startTransition(() => {
            //@ts-ignore
            editRatio({ userId, mode, data: ratio, playlistId, trackId })
                .then((data) => {
                    toast("RATIO", {
                        description: data?.message,
                    });
                    setRatio(0.0);
                })
                .catch((error) => {
                    console.error("Error:", error);
                    toast("Error", {
                        description: "An error occurred. Please try again.",
                    });
                });
        });
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    style={{ fill: "#B4B4B4", transform: "msFilter" }}
                >
                    <path d="m7 17.013 4.413-.015 9.632-9.54c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.756-.756-2.075-.752-2.825-.003L7 12.583v4.43zM18.045 4.458l1.589 1.583-1.597 1.582-1.586-1.585 1.594-1.58zM9 13.417l6.03-5.973 1.586 1.586-6.029 5.971L9 15.006v-1.589z"></path>
                    <path d="M5 21h14c1.103 0 2-.897 2-2v-8.668l-2 2V19H8.158c-.026 0-.053.01-.079.01-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2z"></path>
                </svg>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <h1 className="text-gray-100 text-center p-3">Edit Ratio</h1>
                <div className="flex flex-col space-y-3">
                    <Input
                        value={ratio}
                        onChange={(e) => setRatio(parseFloat(e.target.value) || 0.0)}
                        placeholder="0.0"
                        disabled={isPending}
                        className="py-3 border-[0.7px] border-gray-700 outline-none h-12 text-gray-100"
                        type="number"
                        step="0.01" // Allows decimals in the input
                    />
                </div>
                <Button
                    disabled={isPending}
                    onClick={addToPlaylist}
                    size="nav"
                    className="mt-3 w-full bg-slate-50 text-gray-950"
                >
                    Save
                </Button>
            </PopoverContent>
        </Popover>
    );
};
