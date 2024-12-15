import Image from "next/image";
import { Button } from "../ui/button";
import { useEffect, useState, useTransition } from "react";
import { followArtiste } from "@/actions/follow/follow-artiste";
import { toast } from "sonner";
import { useRecoilValue } from "recoil";
import { isConnected } from "@/atoms/session-atom";
import { isFollowing } from "@/actions/follow/check-follower";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { unFollowArtiste } from "@/actions/follow/unfollow-artiste";
import { mutate } from "swr";

type ArtisteHeaderType = {
    imageUri?: string;
    bio?: string;
    followers: number;
    name: string;
    profilePic: string;
    artisteId: string;
};

export const ArtisteHeader = ({
    imageUri,
    bio,
    followers,
    name,
    profilePic,
    artisteId,
}: ArtisteHeaderType) => {
    const [isPending, startTransition] = useTransition();
    const userId = useRecoilValue(isConnected)?.userId;
    const [isfollowing, setIsFollowing] = useState<boolean>()

    const handleFollow = () => {
        if (!userId) {
            toast.error("Please connect your wallet first!");
            return;
        }

        startTransition(async () => {
            try {
                const res = await followArtiste(userId, artisteId);
                if (res.status === 200) {
                    toast.success(res.message);
                    mutate(`followed_${artisteId}`);
                } else if (res.status === 409) {
                    toast.error(res.message);
                } else {
                    toast.error("Something went wrong!")
                }
            } catch (error: any) {
                toast.error(error.message || "An error occurred. Please try again.");
            }
        });
    };
    const handleUnFollow = () => {
        if (!userId) {
            toast.error("Please connect your wallet first!");
            return;
        }

        startTransition(async () => {
            try {
                const res = await unFollowArtiste(userId, artisteId);
                if (res.status === 200) {
                    toast.success(res.message);
                } else if (res.status === 409) {
                    toast.error(res.message);
                } else {
                    toast.error("Something went wrong!")
                }
            } catch (error: any) {
                toast.error(error.message || "An error occurred. Please try again.");
            }
        });
    };

    useEffect(() => {
        const checkFollow = async () => {
            const isFollow = await isFollowing(userId, artisteId)
            setIsFollowing(isFollow.isFollowing)
        }

        checkFollow()
    }, [userId])

    return (
        <div className="flex items-end space-x-4">
            <div className="h-48 w-48 rounded-full overflow-hidden bg-gray-200">
                <Image
                    src={profilePic || "/default-profile.png"}
                    alt={name}
                    width={200}
                    height={200}
                    className="object-cover"
                />
            </div>
            <div>
                <h1 className="font-semibold text-xl">{name}</h1>
                <small className="block text-gray-500">{bio || "This is a bio"}</small>
                <div className="flex items-center space-x-4 mt-2">
                    <p className="text-sm">{followers} followers</p>
                    <div>
                        {
                            isfollowing ?
                                <Popover>
                                    <PopoverTrigger>
                                        following
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <Button onClick={handleUnFollow} disabled={isPending} className="w-full" variant="destructive">
                                            {isPending ? "unfollowing..." : "unFollow"}
                                        </Button>
                                    </PopoverContent>
                                </Popover>
                                : <Button onClick={handleFollow} disabled={isPending}>
                                    {isPending ? "Following..." : "Follow"}
                                </Button>
                        }
                    </div>

                </div>
            </div>
        </div>
    );
};
