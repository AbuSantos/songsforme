import { useState, useTransition } from "react";
import { SelectPlaylist } from "./selectplaylist";


export const AddSongToPlaylist = () => {
    const [playlist, setPlaylist] = useState<string>("");
    const userId = "0x0A6C1E3103E03e9289069Ad1a02761E0cc7b1B66"

    return (
        <SelectPlaylist />
    );
};
