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

type SelectProps = {
    nftId: string;
    userId: string | undefined
};

type PlaylistData = {
    id: string;
    name: string;
};

export const SelectPlaylist = ({ nftId, userId }: SelectProps) => {
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
            <SelectTrigger className="text-gray-950 bg-slate-50">
                {added ? (
                    <CheckCircledIcon className='cursor-pointer w-6 h-6 text-[teal]' />
                ) : (
                    <PlusCircledIcon className='cursor-pointer w-6 h-6' />
                )}
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
