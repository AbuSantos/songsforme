"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { useTransition } from "react";
import { followArtiste } from "@/actions/follow/follow-artiste";
import { toast } from "sonner";
import { useRecoilValue } from "recoil";
import { isConnected } from "@/atoms/session-atom";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { unFollowArtiste } from "@/actions/follow/unfollow-artiste";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { ArtisteAnalytics } from "@/types";

type ArtisteHeaderType = {
    imageUri?: string;
    bio?: string;
    followers: number;
    name: string | undefined | null;
    profilePic?: string;
    artisteId: string;
    analytics: ArtisteAnalytics
};

export const ArtisteHeader = ({
    imageUri,
    bio = "This is a bio",
    followers,
    name,
    profilePic = "/default-profile.png",
    artisteId,
    analytics,
}: ArtisteHeaderType) => {
    const [isPending, startTransition] = useTransition();
    const userId = useRecoilValue(isConnected)?.userId;

    const apiUrl = `/api/follow/${userId}?artisteId=${artisteId}`;

    // Fetch follow status using SWR
    const { data, isLoading } = useSWR<{ isFollowing: boolean }>(apiUrl, fetcher, {
        shouldRetryOnError: true,
        errorRetryCount: 3,
    });

    const handleFollowAction = async (action: "follow" | "unfollow") => {
        if (!userId) {
            toast.error("Please connect your wallet first!");
            return;
        }

        startTransition(async () => {
            try {
                const actionFn =
                    action === "follow" ? followArtiste : unFollowArtiste;
                const res = await actionFn(userId, artisteId);

                if (res.status === 200) {
                    toast.success(res.message);
                    mutate(apiUrl); // Revalidate SWR cache
                } else {
                    toast.error(res.message || "Something went wrong!");
                }
            } catch (error: any) {
                toast.error(error.message || "An error occurred. Please try again.");
            }
        });
    };

    const totalStreams = analytics?.totalStreams?.reduce((sum: { timestamp: string, count: number }, stream: { timestamp: string, count: number }) => {
        //@ts-ignore
        return sum + stream.count;
    }, 0);

    return (
        <div className="flex items-end space-x-2">
            <div className="h-48 w-48 rounded-full overflow-hidden bg-gray-200">
                <Image
                    src={profilePic}
                    alt={name || ""}
                    width={200}
                    height={200}
                    className="object-cover"
                />
            </div>

            <div>
                <h1 className="font-semibold text-xl">{name}</h1>
                <small className="block text-gray-500">{bio} This is a bio</small>
                <div className="flex items-center space-x-4 mt-2">
                    <p className="text-sm">{followers} followers</p>
                    <div>
                        {isLoading ? (
                            <p>Loading...</p>
                        ) : data?.isFollowing ? (
                            <Popover>
                                <PopoverTrigger>Following</PopoverTrigger>
                                <PopoverContent>
                                    <Button
                                        onClick={() => handleFollowAction("unfollow")}
                                        disabled={isPending}
                                        className="w-full"
                                        variant="destructive"
                                    >
                                        {isPending ? "Unfollowing..." : "Unfollow"}
                                    </Button>
                                </PopoverContent>
                            </Popover>
                        ) : (
                            <Button
                                onClick={() => handleFollowAction("follow")}
                                disabled={isPending}
                            >
                                {isPending ? "Following..." : "Follow"}
                            </Button>
                        )}
                    </div>
                </div>
                <div className="flex  space-x-2">
                    <div>
                        <h1 className="text-xl font-semibold">Total Streams</h1>
                        <p className="text-center">{totalStreams}</p>
                    </div>
                    <Separator orientation="vertical" />

                    <div >
                        <h1 className="text-xl font-semibold">Total Earnings</h1>
                        <p className="text-center">{analytics?.totalEarnings?.toFixed(3)} ETH</p>
                    </div>

                </div>
            </div>
        </div>
    );
};