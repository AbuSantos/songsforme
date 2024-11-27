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

            <div className="flex items-center justify-center space-x-3">
              <h2 className={`py-2 px-3 text-[1rem] font-semibold tracking-tight   rounded-md flex space-y-1 justify-start items-center cursor-pointer
              ${fav === "playlist" ? "text-[#fff] bg-[#191919] border border-[#606060]" : "text-[#606060] border-1  border-[#606060]"}
                  `}
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
                  className="mr-1 h-4 w-4"
                >
                  <path d="M21 15V6" />
                  <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                  <path d="M12 12H3" />
                  <path d="M16 6H3" />
                  <path d="M12 18H3" />
                </svg>
                Playlists
              </h2>


              <span className={`text-[1rem] ${fav === "fav" ? "text-[#fff] bg-[#191919] border border-[#606060]" : "text-[#606060] border-1  border-[#606060] "} py-2 px-4 rounded-md flex justify-center items-center cursor-pointer
              `}
                onClick={() => setFav("fav")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" style={{ fill: fav === "fav" ? "#fff" : "#606060", transform: "msFilter" }}
                  className="mr-2 h-4 w-4"
                ><path d="m6.516 14.323-1.49 6.452a.998.998 0 0 0 1.529 1.057L12 18.202l5.445 3.63a1.001 1.001 0 0 0 1.517-1.106l-1.829-6.4 4.536-4.082a1 1 0 0 0-.59-1.74l-5.701-.454-2.467-5.461a.998.998 0 0 0-1.822 0L8.622 8.05l-5.701.453a1 1 0 0 0-.619 1.713l4.214 4.107zm2.853-4.326a.998.998 0 0 0 .832-.586L12 5.43l1.799 3.981a.998.998 0 0 0 .832.586l3.972.315-3.271 2.944c-.284.256-.397.65-.293 1.018l1.253 4.385-3.736-2.491a.995.995 0 0 0-1.109 0l-3.904 2.603 1.05-4.546a1 1 0 0 0-.276-.94l-3.038-2.962 4.09-.326z"></path></svg>

                Favs
              </span>
            </div>

            <div className="lg:ml-[13rem] md:ml-[5rem]">
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
    </div >
  );
};
