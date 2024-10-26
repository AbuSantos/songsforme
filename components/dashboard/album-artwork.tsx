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
import { useContract } from "@thirdweb-dev/react";


interface AlbumArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
    album: {
        cover: string;
        name: string;
        title: string;
        url: string;
        artist: string;
        id: string;
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
    const [openTrack, setOpenTrack] = React.useState<boolean>(false)


    const handlePlayPause = () => {
        if (currentTrackId === index) {
            togglePlayPause();
        } else {
            setTrack(index);
        }
    };

    return (
        <div className={cn("space-y-3", className)} {...props}>
            <Link className="space-y-1" href={`dashboard/tracklist/${album.id}`}>
                <Image
                    src="https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=300&dpr=2&q=80"
                    width={200}
                    height={100}
                    alt="Music"
                    className="block dark:hidden rounded-md cursor-pointer"
                    onClick={() => setOpenTrack(!openTrack)}
                />
                <p className="text-sm capitalize text-slate-500">
                    {album.title}
                </p>
                <p className="text-[0.7rem] capitalize text-slate-500">
                    {album.artist}
                </p>
            </Link>

            {/* {
                    openTrack &&
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
                    </div>} */}


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
