"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { ChangeEvent, useState, useTransition } from "react";
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
import { Input } from "../ui/input";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { updateUserImage } from "@/actions/user/update-image";

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
    profilePic,
    artisteId,
    analytics,
}: ArtisteHeaderType) => {
    const [isPending, startTransition] = useTransition();
    const userId = useRecoilValue(isConnected)?.userId;
    const [uploading, setUploading] = useState(false);
    const apiUrl = `/api/follow/${userId}?artisteId=${artisteId}`;

    const storage = new ThirdwebStorage({
        clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
        secretKey: process.env.THIRDWEB_NEW_API!,
    });

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

    // Upload a file to IPFS using ThirdwebStorage
    const uploadToIPFS = async (file: File): Promise<string> => {
        try {
            const uri = await storage.upload(file);
            const gatewayUrl = storage.resolveScheme(uri);

            console.log("File uploaded to IPFS:", uri);
            console.log("Gateway URL:", gatewayUrl);
            return gatewayUrl;
        } catch (error) {
            console.error("Failed to upload to IPFS:", error);
            throw error;
        }
    };

    const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        console.log("hello header");

        const file = event.target.files?.[0]
        if (!file) return;
        setUploading(true);
        try {
            // Upload image to IPFS
            const ipfsUrl = await uploadToIPFS(file);
            await updateUserImage(ipfsUrl, artisteId)
            mutate(`/api/user/${artisteId}`)

            console.log(ipfsUrl)
        } catch (error: any) {
            console.log(error.message)
        } finally {
            setUploading(false);
        }
    }

    const totalStreams = analytics?.totalStreams?.reduce((sum: { timestamp: string, count: number }, stream: { timestamp: string, count: number }) => {
        //@ts-ignore
        return sum + stream.count;
    }, 0);


    // Check for who's viewing
    const isArtist = userId === artisteId;

    return (
        <div className="flex flex-col space-y-4 md:!space-y-0 md:!flex-row md:!items-end md:!justify-between space-x-4 bg-gradient-to-tl from-[#111113] via-[#54346B] to-[#6E56FF] py-6 px-2 ">
            <div className="flex items-end space-x-2">
                <div
                    className="image flex flex-col overflow-hidden items-center justify-center  cursor-pointer "
                    onClick={() => document.getElementById("avatar_image")?.click()}
                >
                    <Input
                        type="file"
                        id="avatar_image"
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                    <Image
                        src={profilePic || "/default-profile.png"}
                        alt={name || "Click to add image"}
                        width={250}
                        height={200}
                        className="object-cover rounded-md"
                    />
                </div>

                <div>
                    <h1 className="font-semibold text-xl">{name}</h1>
                    <small className="block text-gray-300">{bio} This is a bio</small>
                    <div className="flex items-center gap-x-2 mt-2 justify-center">
                        <p className="text-[0.8rem]">{followers} followers</p>
                        {
                            userId && <div>
                                {
                                    isLoading ? (
                                        <p>Loading...</p>
                                    ) : data?.isFollowing ? (
                                        <Popover>
                                            <PopoverTrigger className="text-[0.8rem]">Following</PopoverTrigger>
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
                                    )
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
            <div>
                <div className="flex  space-x-2">
                    <div>
                        <h1 className="text-base md:!text-lg font-semibold">Total Streams</h1>
                        <p className="text-center">{totalStreams}</p>
                    </div>
                    <Separator orientation="vertical" />

                    <div >
                        {
                            isArtist &&
                            <>
                                <h1 className="text-base md:!text-lg font-semibold">Total Earnings</h1>
                                <p className="text-center flex justify-center items-center gap-x-1">
                                    {analytics?.totalEarnings?.toFixed(3)}
                                    <Image src={"/base-logo.svg"} alt="base eth" width={15} height={15} className="ml-1" />
                                </p>
                            </>
                        }
                    </div>
                    <div>
                        {
                            isArtist ?
                                <Popover>
                                    <PopoverTrigger className="text-base md:!text-lg font-semibold">Set up Ticketing</PopoverTrigger>
                                    <PopoverContent >
                                        <div className="p-4 space-y-3">
                                            <small className="py-3 text-blue-700"> You&apos;re about to be redirected to Momentify to setup ticketing.
                                                <span className="font-bold text-gray-200">
                                                    COMING SOON!
                                                </span>

                                            </small>
                                            <Button
                                                //TO BE WORKED ON
                                                disabled={true}
                                                className="w-full"
                                                variant="destructive"
                                            >
                                                Confirm
                                            </Button>
                                        </div>

                                    </PopoverContent>
                                </Popover> : <Popover>
                                    <PopoverTrigger className="text-base md:!text-xl font-semibold"> Purchase Ticket</PopoverTrigger>
                                    <PopoverContent >
                                        <div className="p-4 space-y-3">
                                            <small className="py-3 text-blue-700"> You&apos;re about to be redirected to Momentify to purchase this artiste concert ticket.   <span className="font-bold text-gray-200">
                                                COMING SOON!
                                            </span></small>
                                            <Button
                                                // onClick={() => handleFollowAction("unfollow")}
                                                //TO BE WORKED ON
                                                disabled={true}
                                                className="w-full"
                                                variant="destructive"
                                            >
                                                Confirm
                                            </Button>
                                        </div>

                                    </PopoverContent>
                                </Popover>
                        }
                    </div>

                </div>
            </div>

        </div>
    );
};