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
import { useState, useTransition } from "react";

type SelectProps = {
    data: dataProps[];
};

type dataProps = {
    id: string;
    playlist_name: string | null;
    playlistId: string;
};

export const SelectPlaylist = ({ data }: SelectProps) => {
    const [isPending, startTransition] = useTransition();
    const [playlist, setPlaylist] = useState<{ id: string; playlist_name: string } | null>(null);

    // Example nftId to be added to the playlist
    const nftId = "nft-id-to-add";

    const handleAddToPlaylist = (value: string) => {
        const selectedPlaylist = JSON.parse(value);
        setPlaylist(selectedPlaylist);

        startTransition(() => {
            addSongToPlaylist(selectedPlaylist.id, nftId)
                .then((data) => {
                    console.log(data.message);
                    // toast({ description: data.message });
                })
                .catch((error) => {
                    console.error("Error:", error);
                    // toast({ description: "An error occurred. Please try again." });
                });
        });
    };

    return (
        <Select onValueChange={handleAddToPlaylist} >
            <SelectTrigger className="w-full text-gray-950 bg-slate-50">
                <SelectValue placeholder="Select a playlist" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup className="">
                    <SelectLabel>My Playlist</SelectLabel>
                    {data &&
                        data.map((item: dataProps) => (
                            <SelectItem
                                key={item.id}
                                value={JSON.stringify({ id: item.playlistId, playlist_name: item.playlist_name })}
                            >
                                {item.playlist_name}
                            </SelectItem>
                        ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
};
