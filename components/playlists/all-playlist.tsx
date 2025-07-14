"use client";

import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import { Playlist } from "@/types";
import { TrendingPlaylist } from "./trending-playlist";
import { Skeleton } from "../ui/skeleton";
import { MyPlaylist } from "./my-playlist";
import { useRecoilValue } from "recoil";
import { isConnected } from "@/atoms/session-atom";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const AllPlaylist = () => {
    const searchParams = useSearchParams();
    const userId = useRecoilValue(isConnected)?.userId;

    // Retrieve filters from the search params
    const filter = searchParams.get("filter");

    const apiUrl = `/api/playlists?${new URLSearchParams({
        ratio: filter || "",
    })}`;

    const { data: playlists, error, isLoading } = useSWR(apiUrl, fetcher);

    try {
        if (error) return <div>Failed to load playlists</div>;

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

        return (
            <div>
                <div className="md:!hidden mt-4">
                    {
                        playlists &&
                        <MyPlaylist data={playlists} userId={userId} filter={filter} />
                    }
                </div>

                <div className="hidden md:!flex flex-wrap space-x-2 pb-4 mt-4">
                    {playlists && playlists?.map((playlist: Playlist) => (
                        <TrendingPlaylist
                            album={playlist}
                            key={playlist.id}
                            className="w-[180px]"
                        />
                    ))}
                </div>
            </div>
        );

    } catch (error: any) {
        console.log(error.message);
    }
};
