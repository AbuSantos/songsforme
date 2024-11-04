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
type PlaylistTypes = {
    data: Playlist[]
    userId: string
    mode: string
}

export const MyPlaylist = ({ data, userId, mode }: PlaylistTypes) => {
    return (
        <Accordion type="single" collapsible className="w-full">
            {
                data && data?.map((item: any, index: number) => (
                    <AccordionItem key={item.id} value={String(index)} className="border-b-[0.5px] border-b-[#2A2A2A]">
                        <AccordionTrigger>
                            <div className="flex justify-between text-[#7B7B7B] items-center bg-[#FFFFFF22] hover:bg-[#353232] hover:text-[#EEEEEE]  px-2 py-4 w-full text-start rounded-md ">
                                <div className="flex spacee-x-3 items-center justify-center">
                                    <Image src="/images/playlisty.jpg" width={45} height={45} alt="playlist" className="rounded-md" />
                                    <p className="text-[1rem] capitalize ml-2">
                                        {item.name}
                                    </p>
                                </div>
                                <small>
                                    {item?.listednft?.length}
                                </small>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4">
                            {
                                item.listednft?.length === 0 ? <small>NO Songs here</small> : item.listednft?.map((song: ListedNFT) => (
                                    <div key={song.id} className="flex items-center justify-between gap-2 space-y-2">
                                        {/* <small>{song.id}</small> */}
                                        <div>
                                            <small>{song.tokenId}</small>
                                        </div>
                                        <div className="hidden md:flex space-x-1">
                                            {/* <PauseListen userId={userId} playlistId={item.id} /> */}
                                            <Playlisten userId={userId} nftId={song?.id} playlistId={item.id} />
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

}