"use client"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Playlisten } from "../startlistening/play-listen"
import { ListedNFT, Playlist } from "@/types"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getNFTMetadata } from "@/actions/helper/get-metadata"
import { Skeleton } from "../ui/skeleton"
import useSWR from "swr"
import { fetcher } from "@/lib/utils"
type PlaylistTypes = {
    data: Playlist[]
    userId: string
    filter: string | null
    mode: string
}

export const MyPlaylist = ({ data, userId, filter, mode }: PlaylistTypes) => {
    const [nftData, setNftData] = useState<any>()

    useEffect(() => {
        const fetchMetaData = async () => {
            const response = await getNFTMetadata(
                "0xCeC2f962377c87dee0CA277c6FcC762254a8Dcd9",
                "0"
            );
            setNftData(response.raw.metadata)
            console.log("NFT Metadata:\n", response.raw.metadata);
        }

        fetchMetaData()

    }, [userId]) //USE THE ADDRESS

    const apiUrl = `/api/playlists?${new URLSearchParams({
        ratio: filter || "",
    })}`;




    const { data: playlists, error, isLoading } = useSWR(apiUrl, fetcher);

    const useData = mode === "aside" ? data : playlists

    if (error) return <div>Failed to load playlists</div>;

    if (isLoading) {
        return (
            <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        );
    }

    console.log(data, "from my playlist")

    // function convertIpfsToHttp(uri: string) {
    //     return uri.startsWith("ipfs://")
    //         ? uri.replace("ipfs://", "https://ipfs.io/ipfs/")
    //         : uri;
    // }
    try {
        return (
            <Accordion type="single" collapsible className="w-full">
                {
                    useData && useData?.map((item: any, index: number) => (
                        <AccordionItem key={item.id} value={String(index)} className="border-none md:border-b-[0.5px] md:border-b-[#2A2A2A]">
                            <AccordionTrigger className="md:py-1">
                                <Link href={`dashboard/playlist/${item.id}`} className="w-full">
                                    <div className="flex justify-between text-[#7B7B7B] items-center md:bg-[#FFFFFF22] md:hover:bg-[#353232] hover:text-[#EEEEEE]  px-2 md:py-4 w-full text-start rounded-md ">
                                        <div className="flex spacee-x-3 items-center justify-center">
                                            <Image src="/images/playlisty.jpg" width={45} height={65} alt="playlist" className="rounded-sm" />
                                            <p className="text-[1rem] capitalize ml-2">
                                                {item.name}
                                            </p>
                                        </div>
                                        <small>
                                            {item?.listednft?.length}
                                        </small>
                                    </div>
                                </Link>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 hidden md:block">
                                {
                                    item.listednft?.length === 0 ? <small>NO Songs here</small> : item.listednft?.map((song: ListedNFT) => (
                                        <div key={song.id} className="flex items-center justify-between gap-2 space-y-2">
                                            {/* <small>{song.id}</small> */}
                                            <div>
                                                <small>{song.tokenId}</small>
                                            </div>
                                            <div className="hidden md:flex space-x-1">
                                                {/* <PauseListen userId={userId} playlistId={item.id} /> */}
                                                <Playlisten userId={userId} nftId={song?.id} playlistId={item.id} nftData={nftData} nftContractAddress={song?.contractAddress} tokenId={song?.tokenId} />
                                            </div>
                                        </div>
                                    ))
                                }
                            </AccordionContent>
                        </AccordionItem>
                    ))
                }
            </Accordion>
        )
    } catch (error) {
        console.log(error)
    }
}