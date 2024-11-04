import { db } from "@/lib/db"
import { getSession } from "@/lib/helper"
import { Playlist, PlaylistListedNFT } from "@/types"
import { MyPlaylist } from "./my-playlist"
import { Suspense } from "react"
import { TrendingPlaylist } from "./trending-playlist"

export const AllPlaylist = async () => {
    try {
        const playlists: PlaylistListedNFT[] = await db.playlist.findMany({
            include: {
                listednft: true
            }
        })
        const userId = await getSession()
        if (!userId) {
            console.log("userid ", userId)
        }
        return (
            <div className="flex flex-wrap space-x-2 pb-4">
                {playlists?.map((playlist: PlaylistListedNFT, index: number) => (
                    < TrendingPlaylist album={playlist} key={playlist.id}
                        className="w-[180px]"
                    />
                ))}

                {/* <MyPlaylist data={playlist} userId={userId} /> */}
            </div>
        )
    } catch (error) {
        console.log(error);

    }

}

