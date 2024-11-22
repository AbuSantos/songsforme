"use client"
import { addToFavorite } from '@/actions/add-to-fav';
import { Button } from '@/components/ui/button'
import React, { useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner';
import { mutate } from 'swr';

type FavTypes = {
    userId: string
    nftId: string
}
export const Favorite = ({ userId, nftId }: FavTypes) => {
    const [added, setAdded] = useState<boolean>(false); // Tracks if NFT is already added to favorite
    const [favorite, setFavorite] = useState([]); // List of tracks in favorite fetched from the server
    const [loading, setLoading] = useState<boolean>(true); // Loading state for fetching favorite
    const [isPending, startTransition] = useTransition();



    const handleFav = () => {
        if (isPending) return;

        startTransition(async () => {
            try {
                const result = await addToFavorite(userId, nftId);
                if (result.message) {
                    setAdded(true);
                    window.localStorage.setItem(`favorite-${nftId}`, 'true');
                    toast.success(result.message);
                    mutate(`/api/favorites/${userId}`);
                } else {
                    toast.error('Could not add to favorites.');
                }
            } catch (error) {
                console.error('Error adding to favorites:', error);
                toast.error('Something went wrong.');
            }
        });
    };

    useEffect(() => {
        const storedFavorite = window.localStorage.getItem("favorite")
        console.log(storedFavorite)
    }, [userId])
    return (
        <div>
            <Button className='bg-[var(--button-bg)] shadow-md' onClick={handleFav} >
                {
                    !added ?
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ fill: "#EDEEF0", transform: "msFilter" }}><path d="m6.516 14.323-1.49 6.452a.998.998 0 0 0 1.529 1.057L12 18.202l5.445 3.63a1.001 1.001 0 0 0 1.517-1.106l-1.829-6.4 4.536-4.082a1 1 0 0 0-.59-1.74l-5.701-.454-2.467-5.461a.998.998 0 0 0-1.822 0L8.622 8.05l-5.701.453a1 1 0 0 0-.619 1.713l4.214 4.107zm2.853-4.326a.998.998 0 0 0 .832-.586L12 5.43l1.799 3.981a.998.998 0 0 0 .832.586l3.972.315-3.271 2.944c-.284.256-.397.65-.293 1.018l1.253 4.385-3.736-2.491a.995.995 0 0 0-1.109 0l-3.904 2.603 1.05-4.546a1 1 0 0 0-.276-.94l-3.038-2.962 4.09-.326z"></path></svg> :

                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ fill: "#FFD60A", transform: "msFilter" }}><path d="M21.947 9.179a1.001 1.001 0 0 0-.868-.676l-5.701-.453-2.467-5.461a.998.998 0 0 0-1.822-.001L8.622 8.05l-5.701.453a1 1 0 0 0-.619 1.713l4.213 4.107-1.49 6.452a1 1 0 0 0 1.53 1.057L12 18.202l5.445 3.63a1.001 1.001 0 0 0 1.517-1.106l-1.829-6.4 4.536-4.082c.297-.268.406-.686.278-1.065z"></path></svg>
                }
            </Button>
        </div>
    )
}
