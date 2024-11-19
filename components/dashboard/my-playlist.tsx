"use client";
import { cn, fetcher } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "../ui/skeleton";
import { CreatePlaylist } from "../playlists/create-playlist";
import { MyPlaylist } from "../playlists/my-playlist";
import { useRecoilValue } from "recoil";
import { isConnected } from "@/atoms/session-atom";
import useSWR from "swr";
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Favorite } from "../musicNFTs/favorite/fav";
import { MyFavorite } from "../musicNFTs/favorite/my-favorites";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }


export const Aside = ({ className }: SidebarProps) => {
  const userId = useRecoilValue(isConnected);
  const [fav, setFav] = useState<String>("playlist")
  const { data: playlist, error, isLoading } = useSWR(
    userId ? `/api/playlists/${userId}` : null,
    fetcher
  );

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>Failed to load playlists. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className={cn("pb-12 rounded-lg w-full", className)}>
      <div className="space-y-4 w-full">
        <div className="px-3">

          <div className="box-border py-4 flex justify-between h-[60px] bg-[#111111] items-center fixed z-10 ">

            <div className="flex items-center justify-center space-x-2">
              <h2 className="py-2 text-[1rem] font-semibold tracking-tight flex space-y-1 justify-start items-center cursor-pointer"
                onClick={() => setFav("playlist")}
              >
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
              </h2>
              <span className="text-[1rem] text-[#606060] cursor-pointer"
                onClick={() => setFav("fav")}

              >
                Favs
              </span>
            </div>

            <div className="lg:ml-[18rem] md:ml-[8rem]">
              <CreatePlaylist id={userId} />
            </div>
          </div>
          <div className="space-y-1 pt-[70px]">
            {
              fav === "playlist" &&
              <MyPlaylist data={playlist} userId={userId} mode="aside" />
            }
            {
              fav === "fav" &&
              <MyFavorite userId={userId} />
            }
          </div>
        </div>
      </div>
    </div>
  );
};
