"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Playlist } from "@/data/playlists";
import { getSession } from "@/lib/helper";
import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";
import { CreatePlaylist } from "@/components/playlists/create-playlist";
import { MyPlaylist } from "@/components/playlists/my-playlist";
import useSWR from "swr";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    userId: string
}
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const MobilePlaylist = ({ className, userId }: SidebarProps) => {
    const { data: playlist, error, isLoading } = useSWR(
        `/api/playlists/${userId}`,
        fetcher
    );

    try {
        return (
            <div className={cn("pb-12 rounded-lg bg-[#7B7B7B]", className)}>
                <div className="space-y-4 py-4">
                    <div className="px-3 py-2">
                        <div className="flex justify-between px-2 items-center">
                            <h2 className="mb-2 px-4 text-lg text-[#111111] font-semibold tracking-tight">
                                My Playlists
                            </h2>
                            <div>
                                <CreatePlaylist id={userId} />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <MyPlaylist data={playlist} userId={userId} />
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.log(error)
    }


};
