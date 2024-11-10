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
import { ListedNFT, Playlist } from "@/types";


interface AlbumArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
    album: Playlist
    className: string

}

export function TrendingPlaylist({
    album,
    className,
    ...props
}: AlbumArtworkProps) {
    const { audioRef, isPlaying, currentTrackId, setTrack, togglePlayPause } = useAudioPlayer();
    const [openTrack, setOpenTrack] = React.useState<boolean>(false)

    return (
        <div className={cn("space-y-3 hover:bg-[#2A2A2A] rounded-md py-4 px-[0.8rem]", className)} {...props}>
            <Link className="space-y-1" href={`/dashboard/playlist/${album.id}`}>
                <Image
                    src="/images/playlist.jpg"
                    width={180}
                    height={180}
                    alt="Music"
                    className="block dark:hidden rounded-md cursor-pointer shadow-lg"
                    onClick={() => setOpenTrack(!openTrack)}
                />

            </Link>
            <small className="text-[#B4B4B4] tracking-tight leading-tight capitalize">{album.name}, Your favorite playlist created by me</small>
        </div>
    );
}
