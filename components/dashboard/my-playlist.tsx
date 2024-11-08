"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "../ui/skeleton";
import { CreatePlaylist } from "../playlists/create-playlist";
import { MyPlaylist } from "../playlists/my-playlist";
import { useRecoilValue } from "recoil";
import { isConnected } from "@/atoms/session-atom";
import useSWR from "swr";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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
              <>
                <Skeleton className="h-12 w-full mt-2 bg-gray-800" />
                <Skeleton className="h-12 w-full mt-2 bg-gray-800" />
                <Skeleton className="h-12 w-full mt-2 bg-gray-800" />
              </>
            ) : (
              <MyPlaylist data={playlist} userId={userId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
