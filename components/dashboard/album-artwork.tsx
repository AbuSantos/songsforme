"use client";
import Image from "next/image";
import { FaPause, FaPlay } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import AllListed from "../musicNFTs/listedNFT/all-listed";
import Link from "next/link";

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

    const handlePlayPause = () => {
        if (currentTrackId === index) {
            togglePlayPause();
        } else {
            setTrack(index);
        }
    };

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
                    Hello world
                </div>
            </div>

            <AllListed />

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
