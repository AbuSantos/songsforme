"use client"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { useEffect, useState } from "react"
import useSWR from "swr"
import { fetcher, truncate } from "@/lib/utils"
import { Bid, ListedNFT } from "@/types"
import { Copy } from "@/components/actions/copy"
import { AcceptBidOffer } from "@/components/bids/accept-offer"
import { RejectBidOffer } from "@/components/bids/reject-offer"


export const MyNFTOFfers = ({ data }: { data: ListedNFT[] }) => {
    const apiUrl = `/api/playlists?`;

    const { data: playlists, error, isLoading } = useSWR(apiUrl, fetcher);

    if (error) return <div>Failed to load playlists</div>;

    if (isLoading) {
        return (
            <div className="flex flex-col space-y-3">
                {/* <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div> */}
            </div>
        );
    }
    try {
        return (
            <Accordion type="single" collapsible className="w-full">
                {
                    data.map((item: ListedNFT, index: number) => (
                        <AccordionItem key={item.id} value={String(index)} className="border-none md:border-b-[0.5px] md:border-b-[#2A2A2A]">
                            <AccordionTrigger className="md:py-1 ">
                                <div className="flex justify-between text-[#7B7B7B] items-center  md:bg-[#222222] md:hover:bg-[#353232] hover:text-[#EEEEEE]  px-2 md:py-4 w-full text-start rounded-md ">
                                    <div className="flex spacee-x-3 items-center justify-center">
                                        <p className="text-[1rem] capitalize ml-2">
                                            {item.Single?.song_name}
                                            <span className="ml-1">
                                                {truncate(item.contractAddress)}
                                            </span>
                                        </p>
                                    </div>
                                    <small>
                                        {item?.Bid?.length}
                                    </small>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 hidden md:block">
                                {
                                    item.Bid?.length === 0 ? <small>No Bids here</small> : item.Bid?.map((bid: Bid) => (
                                        <div key={bid.id} className="flex items-center justify-between gap-2 space-y-2">
                                            {/* <small>{song.id}</small> */}
                                            <div>
                                                <p>{bid.owner?.username}</p>
                                                <Copy address={bid.owner?.userId} />
                                            </div>

                                            <div>
                                                <h1>
                                                    {bid?.bidAmount}
                                                </h1>

                                            </div>
                                            <div className="hidden md:flex space-x-1">
                                                {
                                                    bid.status === "WIN" ? <p>Bid is Over</p> :
                                                        <div className="flex space-x-1 items-center justify-center">
                                                            <AcceptBidOffer bidId={bid.id} nftAddress={bid?.nftAddress} tokenId={bid?.tokenId} nftId={item?.id} />
                                                            < RejectBidOffer bidId={bid.id} nftAddress={bid?.nftAddress} tokenId={bid?.tokenId} />
                                                        </div>
                                                }
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