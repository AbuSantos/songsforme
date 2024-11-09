"use client";
import { cn, fetcher } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "../ui/skeleton";
import { CreatePlaylist } from "../playlists/create-playlist";
import { MyPlaylist } from "../playlists/my-playlist";
import { useRecoilValue } from "recoil";
import { isConnected } from "@/atoms/session-atom";
import useSWR from "swr";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }


export const Aside = ({ className }: SidebarProps) => {
  const userId = useRecoilValue(isConnected);

  console.log(userId, "from aside login")
  // if (!userId) return null;

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
            {isLoading ? (
              <div className="flex flex-col space-y-2">

                <div className="flex space-x-1 items-center md:justify-between border-b-[0.5px] border-b-[#2A2A2A]  bg-[#FFFFFF22]  px-2 py-2 w-full mt-2 rounded-md ">
                  <Skeleton className='w-12 h-12 bg-[#111113]' />
                  <Skeleton className='w-8/12 h-12 bg-[#111113]' />
                  <Skeleton className='w-1/12 h-12 bg-[#111113]' />
                </div>
                <div className="flex space-x-1 items-center md:justify-between border-b-[0.5px] border-b-[#2A2A2A]  bg-[#FFFFFF22]  px-2 py-2 w-full mt-2 rounded-md ">
                  <Skeleton className='w-12 h-12 bg-[#111113]' />
                  <Skeleton className='w-8/12 h-12 bg-[#111113]' />
                  <Skeleton className='w-1/12 h-12 bg-[#111113]' />
                </div>
                <div className="flex space-x-1 items-center md:justify-between border-b-[0.5px] border-b-[#2A2A2A]  bg-[#FFFFFF22]  px-2 py-2 w-full mt-2 rounded-md ">
                  <Skeleton className='w-12 h-12 bg-[#111113]' />
                  <Skeleton className='w-8/12 h-12 bg-[#111113]' />
                  <Skeleton className='w-1/12 h-12 bg-[#111113]' />
                </div>
              </div>

            ) : (
              <MyPlaylist data={playlist} userId={userId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
