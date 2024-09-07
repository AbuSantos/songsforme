"use client";
import Image from "next/image";
import { FaPause, FaPlay } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

interface AlbumArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
    album: {
        cover: string;
        name: string;
        title: string;
        url: string;
        artiste: string;
    };
    index: number;
    aspectRatio?: "portrait" | "square";
    width?: number;
    height?: number;
}

export function AlbumArtwork({
    album,
    index,
    aspectRatio = "portrait",
    width,
    height,
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
            <Button
                variant="secondary"
                size="icon"
                className="rounded-full"
                onClick={handlePlayPause}
            >
                {isPlaying && currentTrackId === index ? (
                    <FaPause className="text-xl text-red-900" />
                ) : (
                    <FaPlay className="text-xl text-red-900" />
                )}
            </Button>

            <div className="overflow-hidden rounded-md">
                <Image
                    src={album.cover}
                    alt={album.name}
                    width={width}
                    height={height}
                    className={cn(
                        "h-auto w-auto object-cover transition-all hover:scale-105",
                        aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
                    )}
                />
            </div>

            {currentTrackId === index && (
                <audio ref={audioRef} src={album.url} autoPlay />
            )}

            <div className="space-y-1 text-sm">
                <h3 className="font-medium leading-none capitalize">{album.title}</h3>
                <p className="text-xs text-muted-foreground">{album.artiste}</p>
            </div>
        </div>
    );
}
