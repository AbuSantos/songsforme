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
    handleAttributeChange: (value: string) => void;
    id: string
};

type PlaylistData = {
    id: string;
    name: string;
};
type Genre = {
    id: number;
    name: string;
};

const genres: Genre[] = [
    { id: 1, name: "Afrobeat" },
    { id: 2, name: "Hip Hop" },
    { id: 3, name: "R&B" },
    { id: 4, name: "Pop" },
    { id: 5, name: "Jazz" },
    { id: 6, name: "Indie" },
];


export const SelectGenre = ({ handleAttributeChange, id }: SelectProps) => {
    const [added, setAdded] = useState<boolean>(false); // Tracks if NFT is already added to a playlist
    const [selectedGenre, setSelectedGenre] = useState<string | undefined>();
    const [playlists, setPlaylists] = useState<PlaylistData[]>([]); // List of playlists fetched from the server

    const handleChange = (value: string) => {
        setSelectedGenre(value);
        handleAttributeChange(value);
    }

    return (
        <Select onValueChange={handleChange} >
            <SelectTrigger className="text-gray-200 bg-black text-center items-center shadow-md py-3 border-gray-700 " id={id}>
                <SelectValue placeholder="Select Genre" />
            </SelectTrigger>

            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Select Genre</SelectLabel>
                    {
                        genres.map((item: any) => (
                            <SelectItem key={item.id} value={item.name} className="capitalize">
                                {item.name}
                            </SelectItem>
                        ))
                    }
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};
