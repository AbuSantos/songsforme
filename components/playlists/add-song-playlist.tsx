import { addSongToPlaylist } from '@/actions/add-song'
import { PlusCircledIcon } from '@radix-ui/react-icons'
import { Button } from '@radix-ui/themes'
import React from 'react'
import { toast } from "sonner"
type SongsParams = {
    playlistId: string
    id: string
}
export const AddSong = ({ playlistId, id }: SongsParams) => {
    const [isPending, startTransition] = React.useTransition()

    const addToPlaylist = () => {
        startTransition(() => {
            addSongToPlaylist(playlistId, id).then((data) => {
                toast("Playlist", {
                    description: data?.message,
                });
            }).catch((error) => {
                console.error("Error:", error);
                toast("Error", {
                    description: "An error occurred. Please try again.",
                });
            });
        })
    }
    return (
        < PlusCircledIcon onClick={addToPlaylist} className='cursor-pointer w-6 h-6' />
    )
}

