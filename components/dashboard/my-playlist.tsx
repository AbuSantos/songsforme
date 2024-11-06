"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Playlist } from "@/data/playlists";
import { Separator } from "../ui/separator";
import { CreatePlaylist } from "../playlists/create-playlist";
import { MyPlaylist } from "../playlists/my-playlist";
import { getSession } from "@/lib/helper";
import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";
import { Playlisten } from "../startlistening/play-listen";
import { PauseListen } from "../startlistening/pause-listen";
import { useRecoilValue } from "recoil";
import { isConnected } from "@/atoms/session-atom";
import useSWR from "swr";
import { Skeleton } from "../ui/skeleton";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  playlists: Playlist[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());
export const Aside = ({ className }: SidebarProps) => {
  const userId = useRecoilValue(isConnected)

  if (!userId) return

  const { data: playlist, error, isLoading } = useSWR(
    `/api/playlists/${userId}`,
    fetcher
  );


  try {
    // Fetch playlists only if the user is connected
    return (
      <div className={cn("pb-12 rounded-lg", className)}>
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="flex justify-between px-2 items-center">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                My Playlists
              </h2>
              <div>
                <CreatePlaylist id={userId} />
              </div>
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
              {/* @ts-ignore */}

              {
                isLoading ?
                  <>
                    <Skeleton className="h-12 w-full mt-2 bg-gray-800" />
                    <Skeleton className="h-12 w-full mt-2 bg-gray-800" />
                    <Skeleton className="h-12 w-full mt-2 bg-gray-800" />
                  </> :
                  <MyPlaylist data={playlist} userId={userId} />
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
