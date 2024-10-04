"use client"
import AllListed from "./all-listed"
import { BuyNFT } from "@/components/actions/buy-nft"
import { MakeBid } from "@/components/modal/make-bid"
import { AddSong } from "@/components/playlists/add-song-playlist"
import { getContractMetadata } from "thirdweb/extensions/common";
import { useReadContract } from "thirdweb/react";
import { getContract } from "thirdweb";


import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Text } from "@radix-ui/themes"
import { useEffect, useState } from "react"
import { client } from "@/lib/client"
import { polygonAmoy, sepolia } from "thirdweb/chains"
import { PlayTrack } from "./get-track"

const invoices = [
    {
        invoice: 10,
        paymentStatus: "Paid",
        totalAmount: "BNB: 250.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: 10,
        paymentStatus: "Pending",
        totalAmount: "BNB: 150.00",
        paymentMethod: "PayPal",
    }
]

export const Tracktable = () => {

    return (
        <div>
            <header className="flex border-b-[0.5px] border-b-[#2A2A2A] justify-between text-[#484848] px-2">
                <Text className="uppercase font-extralight w-10 text-[0.8rem] ">ns</Text>
                <Text className="font-[50] capitalize text-[0.8rem] w-6/12 ">title</Text>
                <Text className="font-[50] capitalize text-[0.8rem] w-2/12 ">price</Text>
                <Text className="font-[50] capitalize text-[0.8rem] w-4/12 ">action</Text>
            </header>

            {invoices.map((invoice, index) => (
                <Accordion type="single" collapsib le className="w-full">
                    <AccordionItem key={index} value={String(index)} className="border-b-[0.5px] border-b-[#2A2A2A] ">
                        <AccordionTrigger>
                            <div className="flex items-center text-[#7B7B7B] bg-[#FFFFFF22] hover:bg-[#484848] hover:text-[#EEEEEE]  px-2 py-2 w-full text-start rounded-md ">
                                <p className="w-10 ">
                                    10
                                </p>
                                <div className="flex flex-col w-6/12">
                                    <p className="text-[1rem] capitalize">
                                        {invoice.paymentMethod}
                                    </p>
                                    <small className=" uppercase">
                                        FT: Santos
                                    </small>
                                </div>
                                < PlayTrack address={"0x1e2E9727b494AE01Cf8a99292869462AAe3CeCd0"} />
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4">
                            <div className="flex items-center space-x-2">
                                < MakeBid />
                                <BuyNFT />
                                < AddSong />
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                </Accordion>
            ))}
        </div>

    )
}