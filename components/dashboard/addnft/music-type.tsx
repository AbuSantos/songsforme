"use server"
import { DesktopNFTForm } from "@/components/modal/list-NFTD"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { CreateSingle } from "./create-single"
import { AllMySingle } from "./all-singles"

export const MusicType = async () => {
    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger>Add Album</AccordionTrigger>
                <AccordionContent>
                    < DesktopNFTForm />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>Add Single Track</AccordionTrigger>
                <AccordionContent>
                    < AllMySingle />
                    {/* < DesktopNFTForm /> */}
                </AccordionContent>
            </AccordionItem>

        </Accordion>
    )
}
