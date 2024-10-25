import { db } from "@/lib/db"
import { getSession } from "@/lib/helper"
import { Playlist, PlaylistListedNFT } from "@/types"
import { MyPlaylist } from "./my-playlist"
import { Suspense } from "react"

export const AllPlaylist = async () => {
    const playlist: PlaylistListedNFT[] = await db.playlist.findMany({
        include: {
            listednft: true
        }
    })
    const userId = await getSession()
    if (!userId) {
        return
    }
    console.log(playlist, "from all playlist")
    return (
        <div>
            <MyPlaylist data={playlist} userId={userId} />
        </div>
    )
}

