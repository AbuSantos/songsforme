"use client";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ListedNFT, Playlist } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import dynamic from "next/dynamic";
import PlaylistPlay from "../startlistening/play-listen-playlist";

interface PlaylistTypes {
    id?: string,
    data: Playlist[];
    userId?: string;
    filter?: string | null;
    mode?: string;
    listednft?: ListedNFT[];
    name?: string;
}

// const PlaylistPlay = dynamic<PlaylistTypes>(
//     () => import("../startlistening/play-listen-playlist").then((mod) => mod.PlaylistPlay),
//     {
//         ssr: false,
//         loading: () => <div className="w-6 h-6" />
//     }
// );

export const MyPlaylist = ({ data, userId, filter, mode }: PlaylistTypes) => {
    const apiUrl = `/api/playlists?${new URLSearchParams({
        ratio: filter || "",
    })}`;

    const { data: playlists, error, isLoading } = useSWR(apiUrl, fetcher);
    const useData = mode === "aside" ? data : playlists;

    if (error) return <div className="text-red-500">Failed to load playlists</div>;

    if (isLoading) {
        return (
            <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        );
    }

    if (!useData || useData.length === 0) {
        return <div className="text-muted-foreground">No playlists found</div>;
    }

    return (
        <Accordion type="single" collapsible className="w-full space-y-3">
            {useData.map((item: PlaylistTypes) => (
                <div key={item.id} className="border-none md:border-b-[0.5px] md:border-b-[#2A2A2A]">
                    <div className="flex items-center text-[#7B7B7B] md:bg-[#222222] hover:text-[#EEEEEE] px-2 w-full text-start rounded-md">
                        <Link
                            href={`/dashboard/playlist/${item.id}`}
                            className="w-full hover:no-underline"
                        >
                            <div className="flex justify-between items-center md:bg-[#222222] md:hover:bg-[#353232] hover:text-[#EEEEEE] px-2 md:py-4 w-full text-start rounded-md">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src="/images/playlisty.jpg"
                                        width={45}
                                        height={45}
                                        alt="playlist"
                                        className="rounded-sm object-cover"
                                    />
                                    <div>
                                        <p className="text-[1rem] capitalize">{item.name}</p>
                                        <small className="text-muted-foreground">
                                            {item.listednft?.length || 0} tracks
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </Link>
                        <div className="ml-2">
                            <PlaylistPlay
                                tracks={item.listednft || []}
                                playlistId={item.id || ""}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </Accordion>
    );
};