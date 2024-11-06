"use client"
import { db } from "@/lib/db"
import { getSession } from "@/lib/helper"
import { Playlist, PlaylistListedNFT } from "@/types"
import { MyPlaylist } from "./my-playlist"
import { Suspense, useEffect, useState } from "react"
import { TrendingPlaylist } from "./trending-playlist"
import { useSearchParams } from "next/navigation"
import useSWR from "swr"
import { Skeleton } from "../ui/skeleton"


const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const AllPlaylist = ({ data }) => {
    // const [playlists, setPlaylists] = useState<Playlist[]>(data);
    const searchParams = useSearchParams()

    // Retrieve filters from the search params
    const filter = searchParams.get("filter")

    console.log(filter, "ratio filter")
    const apiUrl = `/api/playlists?${new URLSearchParams({
        ratio: filter || "",

    })}`

    const { data: playlists, error, isLoading } = useSWR(
        apiUrl,
        fetcher
    );
    try {
        return (
            <div className="flex flex-wrap space-x-2 pb-4" >{
                isLoading ? <div className="flex flex-col space-y-3">
                    <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div> : playlists?.map((playlist: Playlist, index: number) => (
                    < TrendingPlaylist album={playlist} key={playlist.id}
                        className="w-[180px]"
                    />
                ))
            }
                {/* <MyPlaylist data={playlist} userId={userId} /> */}
            </div >
        )
    } catch (error) {
        console.log(error);

    }

}

