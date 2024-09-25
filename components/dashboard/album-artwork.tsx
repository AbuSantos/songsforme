"use client";
import Image from "next/image";
import { FaPause, FaPlay } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import AllListed from "../musicNFTs/listedNFT/all-listed";
import Link from "next/link";
import * as React from "react"
import { ChevronsUpDown, Plus, X } from "lucide-react"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { CheckCircledIcon, ChevronDownIcon, PlusCircledIcon } from "@radix-ui/react-icons";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface AlbumArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
    album: {
        cover: string;
        name: string;
        title: string;
        url: string;
        artist: string;
    };
    index: number;
    width?: number;
    height?: number;
}

export function AlbumArtwork({
    album,
    index,
    className,
    ...props
}: AlbumArtworkProps) {
    const { audioRef, isPlaying, currentTrackId, setTrack, togglePlayPause } = useAudioPlayer();
    const [isOpen, setIsOpen] = React.useState(false)
    const [isPending, startTransition] = React.useTransition()
    const handlePlayPause = () => {
        if (currentTrackId === index) {
            togglePlayPause();
        } else {
            setTrack(index);
        }
    };

    // const addToPlaylist = (teacherId: string, busId: string) => {
    //     startTransition(() => {
    //         removeTeacherFromBus(teacherId, busId).then((data) => {
    //             toast({
    //                 description: data.message,
    //             });
    //         }).catch((error) => {
    //             console.error("Error:", error);
    //             toast({
    //                 description: "An error occurred. Please try again.",
    //             });
    //         });
    //     })
    // }

    return (
        <div className={cn("space-y-3", className)} {...props}>
            <div className="flex space-x-2">
                <Image
                    src={album.cover}
                    width={150}
                    height={100}
                    alt="Music"
                    className="block dark:hidden rounded-md"
                />
                <div>
                    <Collapsible
                        open={isOpen}
                        onOpenChange={setIsOpen}
                        className="w-[200px] space-y-2"
                    >
                        <CollapsibleTrigger >
                            Each Tracklist
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-2">
                            <div className=" flex justify-between items-center rounded-md border-[0.5px] px-4 py-3 font-mono text-[0.7rem]">
                                <p>
                                    <small className="space-x-2">1.</small>
                                    Track
                                </p>
                                <div className="flex space-x-2">
                                    <button className="cursor-pointer">
                                        <CheckCircledIcon className="h-6 w-6" />
                                    </button>
                                    <Popover>
                                        <PopoverTrigger>
                                            <ChevronDownIcon className="h-6 w-6" />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[12rem] border-[0.5px] border-gray-600 ">
                                            <AllListed />
                                        </PopoverContent>
                                    </Popover>
                                </div>


                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            </div>


            {/* {currentTrackId === index && (
                <audio ref={audioRef} src={album.url} autoPlay={false} />
            )} */}

            {/* <div className="space-y-1 text-sm flex items-center justify-between">
                <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full bg-transparent hover:bg-transparent"
                    onClick={handlePlayPause}
                >
                    {isPlaying && currentTrackId === index ? (
                        <FaPause className="text-xl text-red-900" />
                    ) : (
                        <FaPlay className="text-xl text-red-900" />
                    )}
                </Button>

            </div> */}
        </div>
    );
}
