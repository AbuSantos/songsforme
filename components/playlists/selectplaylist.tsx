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
import { Skeleton } from "@radix-ui/themes";
import { useEffect, useState, useTransition } from "react";
import { toast } from 'sonner'; // Toast library for notifications

type SelectProps = {
    nftId: string;
};

type PlaylistData = {
    id: string;
    name: string | null;
    playlistId: string;
};

export const SelectPlaylist = ({ nftId }: SelectProps) => {
    const [isPending, startTransition] = useTransition();
    const [playlist, setPlaylist] = useState<PlaylistData | null>(null);
    const [added, setAdded] = useState<boolean>(false); // Tracks if NFT is already added to a playlist
    const [playlists, setPlaylists] = useState<PlaylistData[]>([]); // List of playlists fetched from the server
    const [loading, setLoading] = useState<boolean>(true); // Loading state for fetching playlists
    const session = useSession();
    const userId = session?.id; // User ID from session

    // Fetch playlists when the component is mounted or when userId changes
    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return;
            try {
                const res = await fetch(`/api/playlists/${userId}/`);
                const result = await res.json();
                setPlaylists(result);
            } catch (error) {
                console.error("Error fetching playlists:", error);
            } finally {
                setLoading(false); // Stop loading after data is fetched
            }
        };
        fetchData();
    }, [userId]);

    // Handles adding the NFT to the selected playlist
    const handleAddToPlaylist = (value: string) => {
        // const selectedPlaylist = JSON.parse(value) as PlaylistData; // Parse the selected playlist data
        console.log(value, "id")
        startTransition(() => {
            addSongToPlaylist(value, nftId)
                .then((response) => {
                    // Show success message
                    toast('Playlist', {
                        description: response?.message, // Server response message
                    });
                    setAdded(true); // Mark the song as added to the playlist
                })
                .catch((error) => {
                    console.error('Error:', error);
                    // Show error message
                    toast('Error', {
                        description: 'An error occurred. Please try again.',
                    });
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
                        <Skeleton className="h-8 w-full bg-gray-800" /> // Loading state
                    ) : playlists.length === 0 ? (
                        <p>No playlists available</p> // Handle empty playlist state
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
