"use client";

import { addSongToPlaylist } from "@/actions/add-song";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useSession } from "@/hooks/useSession";
import { CheckCircledIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { toast } from 'sonner'; // Toast library for notifications
import { Skeleton } from "../ui/skeleton";
import { useRecoilValue } from "recoil";
import { isConnected } from "@/atoms/session-atom";
import { mutate } from "swr";

type SelectProps = {
    nftId: string;
    userId: string | undefined
    mode?: string
};

type PlaylistData = {
    id: string;
    name: string;
};

export const SelectPlaylist = ({ nftId, userId, mode }: SelectProps) => {
    const [added, setAdded] = useState<boolean>(false); // Tracks if NFT is already added to a playlist
    const [playlists, setPlaylists] = useState<PlaylistData[]>([]); // List of playlists fetched from the server
    const [loading, setLoading] = useState<boolean>(true); // Loading state for fetching playlists

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/playlists/${userId}/`);
                if (!res.ok) throw new Error(`Failed to fetch playlists: ${res.status}`);
                const result = await res.json();
                setPlaylists(result);
            } catch (error) {
                console.error("Error fetching playlists:", error);
                toast('Error', { description: "Unable to load playlists." });
            } finally {
                setLoading(false); // Stop loading after data is fetched
            }
        };
        fetchData();
    }, [userId]);

    const handleAddToPlaylist = (value: string) => {
        addSongToPlaylist(value, nftId)
            .then((response) => {
                toast('Playlist', {
                    description: response?.message, // Server response message
                });
                mutate(`/api/playlists/${userId}`)
                setAdded(true); // Mark the song as added to the playlist
            })
            .catch((error) => {
                console.error('Error:', error);
                toast('Error', {
                    description: 'An error occurred. Please try again.',
                });
            });
    };

    return (
        <Select onValueChange={handleAddToPlaylist}>
            <SelectTrigger className="px-0">
                <div className="text-gray-950 hidden md:!block bg-[var(--button-bg)] justify-center text-center items-center shadow-md py-2 px-4 rounded-md ">
                    {added ? (
                        <CheckCircledIcon className='cursor-pointer w-6 h-6 text-[teal]' />
                    ) : (
                        <PlusCircledIcon className='cursor-pointer w-6 h-6 text-[#EDEEF0]' />
                    )}
                </div>
                <div className="text-gray-50 block md:!hidden bg-[var(--button-bg)] justify-start  items-start shadow-md py-2 px-4 rounded-md ">
                    {added ? (
                        <span className="flex items-center justify-start space-x-2 capitalize text-gray-100">
                            <CheckCircledIcon className='cursor-pointer w-6 h-6 text-[teal] mr-2' />
                            {` ${mode === "page" ? "" : "added to playlist"} `}
                        </span>
                    ) : (
                        <span className="flex items-center justify-center space-x-2 capitalize text-[#EDEEF0]">
                            <PlusCircledIcon className='cursor-pointer w-6 h-6 text-[#EDEEF0] mr-2' />
                            {` ${mode === "page" ? "" : "add to playlist"} `}
                        </span>
                    )}
                </div>
            </SelectTrigger>

            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Select Playlist</SelectLabel>
                    {loading ? (
                        Array.from({ length: 3 }).map((_, index) => (
                            <Skeleton key={index} className="h-8 w-full mt-2 bg-gray-800" />
                        ))
                    ) : playlists.length === 0 ? (
                        <p className="text-sm text-slate-500">No playlists available</p>
                    ) : (
                        playlists.map((item: PlaylistData) => (
                            <SelectItem key={item.id} value={item.id} className="capitalize">
                                {item.name ?? "Untitled Playlist"}
                            </SelectItem>
                        ))
                    )}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};
