"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import Link from "next/link";
import * as React from "react";
import { useSongData } from "@/hooks/use-song-data";
import { Single } from "@/types";

interface AlbumArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
    album: Single;
    className: string;
}

export function AlbumArtwork({
    album,
    className,
    ...props
}: AlbumArtworkProps) {
    const { audioRef, isPlaying, currentTrackId, setTrack, togglePlayPause } = useAudioPlayer();
    const [openTrack, setOpenTrack] = React.useState<boolean>(false);

    return (
        <div className={cn("space-y-3", className)} {...props}>
            <Link className="space-y-1" href={`/dashboard/tracklist/${album.contractAddress}`}>
                <div className="relative w-[190px] h-[120px] overflow-hidden rounded-md">
                    <Image
                        src={album.song_cover || `/images/playlisty.jpg`}
                        alt="Music"
                        className="absolute w-full h-full object-cover"
                        onClick={() => setOpenTrack(!openTrack)}
                        width={190}
                        height={120}
                    />
                </div>

                <p className="text-[1rem] capitalize text-slate-500">
                    {album.song_name}
                </p>
            </Link>
            <small className="text-[#B4B4B4]  tracking-tight leading-tight capitalize">
                <Link className="space-y-1 hover:text-[#8E4EC6]" href={`/dashboard/artistehub/${album?.owner}`}>
                    {album.artist_name}
                </Link>
            </small>
        </div>
    );
}
