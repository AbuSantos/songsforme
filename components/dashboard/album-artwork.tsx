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

    return (
        <div className={cn("space-y-3", className)} {...props}>
            <Link className="space-y-1" href={`dashboard/tracklist/${album.id}`}>
                <Image
                    src="/images/playlisty.jpg"
                    width={190}
                    height={150}
                    alt="Music"
                    className="block dark:hidden rounded-md cursor-pointer"
                    onClick={() => setOpenTrack(!openTrack)}
                />
                <p className="text-[1rem] capitalize text-slate-500">
                    {album.song_name}
                </p>
                <small className="text-[#B4B4B4] tracking-tight leading-tight capitalize">{album.artist_name}</small>


            </Link>
        </div>
    );
}
