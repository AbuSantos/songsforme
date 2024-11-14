"use client";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { AllMySingle } from "./singles/all-singles";
import { useActiveAccount } from "thirdweb/react";
import { getSession } from "@/lib/helper";
import { revalidateTag } from "next/cache";
import { DesktopNFTForm } from "@/components/musicNFTs/listedNFT/list-NFTD";
import { useRecoilValue } from "recoil";
import { isConnected } from "@/atoms/session-atom";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";

export const MusicAccordion = () => {
    const userId = useRecoilValue(isConnected)
    const { data, error, isLoading } = useSWR(`/api/singles/${userId}`, fetcher)

    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger>Add Album</AccordionTrigger>
                <AccordionContent>
                    <DesktopNFTForm />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>Add Single Track</AccordionTrigger>
                <AccordionContent>
                    {
                        isLoading ? <p>loading...</p> :
                            <AllMySingle data={data} />
                    }
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};
