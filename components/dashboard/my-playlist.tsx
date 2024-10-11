import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Playlist } from "@/data/playlists"
import { Separator } from "../ui/separator"
import { CreatePlaylist } from "../playlists/create-playlist"
import { MyPlaylist } from "../playlists/my-playlist"
import { getSession } from "@/lib/helper"
import { db } from "@/lib/db"
import { revalidateTag } from "next/cache"


interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    playlists: Playlist[]
}

export const Aside = async ({ className, playlists }: SidebarProps) => {
    const userId = await getSession()

    let playlist = [];

    // Fetch playlists only if the user is connected
    if (userId) {
        playlist = await db.playlist.findMany({
            where: { userId },
            include: {
                listednft: true,
            },
        });
    }

    if (!playlist) {
        return
    }
    revalidateTag('playlist')
    return (
        <div className={cn("pb-12 rounded-lg", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="flex justify-between px-2 items-center">
                        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                            My Playlists
                        </h2>
                        {
                            userId &&
                            < CreatePlaylist id={userId} />
                        }
                    </div>
                    <div className="space-y-1">
                        <Button variant="ghost" className="w-full justify-start">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mr-2 h-4 w-4"
                            >
                                <path d="M21 15V6" />
                                <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                                <path d="M12 12H3" />
                                <path d="M16 6H3" />
                                <path d="M12 18H3" />
                            </svg>
                            Playlists
                        </Button>
                        <MyPlaylist data={playlist} />

                    </div>
                </div>
            </div>
        </div>
    )
}