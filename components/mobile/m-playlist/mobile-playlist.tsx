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
import { Skeleton } from "@/components/ui/skeleton";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    userId: string
}
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const MobilePlaylist = ({ className, userId }: SidebarProps) => {
    const apiUrl = userId ? `/api/playlists/${userId}` : null
    const { data: playlist, error, isLoading } = useSWR(
        apiUrl,
        fetcher
    );

    try {
        return (
            <div className={cn("pb-12 rounded-lg ", className)}>
                <div className="space-y-2 py-4">
                    <div className=" py-2">
                        <div className="flex justify-between px-2 items-center">
                            <h2 className="mb-2 px-4 text-lg text-[#111111] font-semibold tracking-tight">
                                My Playlists
                            </h2>
                            <div>
                                <CreatePlaylist id={userId} />
                            </div>
                        </div>

                        <div className="space-y-1">

                            {
                                isLoading ? (
                                    <div className='flex flex-col space-y-2'>
                                        {[...Array(3)].map((_, index) => (
                                            <div
                                                key={index}
                                                className="flex space-x-1 items-center md:justify-between border-b-[0.5px] border-b-[#2A2A2A]  bg-[#FFFFFF22]  px-2 py-2 w-full mt-2 rounded-md "
                                            >
                                                <Skeleton className='w-12 h-12 bg-[#111113]' />
                                                <Skeleton className='w-8/12 h-12 bg-[#111113]' />
                                                <Skeleton className='w-2/12 h-12 bg-[#111113]' />
                                                <Skeleton className='w-1/12 h-12 bg-[#111113]' />
                                            </div>
                                        ))}
                                    </div>
                                ) : error ? (
                                    <div className="text-red-500">Failed to load data.</div>
                                ) : (
                                    <MyPlaylist data={playlist} userId={userId} mode="aside" />
                                )
                            }

                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.log(error)
    }


};
