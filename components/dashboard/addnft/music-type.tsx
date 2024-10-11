"use server";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { AllMySingle } from "./singles/all-singles";
import { useActiveAccount } from "thirdweb/react";
import SingleMusic from "./singles/single-music";
import { getSession } from "@/lib/helper";
import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";
import { DesktopNFTForm } from "@/components/musicNFTs/listedNFT/list-NFTD";

export const MusicAccordion = async () => {

    const address = await getSession()

    const singles = await db.single.findMany({
        where: {
            owner: address
        },
    });

    revalidateTag("single")

    if (!singles) {
        console.log("no single")
    }
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
                    <AllMySingle singles={singles} />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
};
