import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import AllListed from "./all-listed"
import { BuyNFT } from "@/components/actions/buy-nft"
import { MakeBid } from "@/components/modal/make-bid"
import { AddSong } from "@/components/playlists/add-song-playlist"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Text } from "@radix-ui/themes"
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
    },
    {
        invoice: 10,
        paymentStatus: "Unpaid",
        totalAmount: "BNB: 350.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: 10,
        paymentStatus: "Paid",
        totalAmount: "BNB: 450.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: 10,
        paymentStatus: "Paid",
        totalAmount: "BNB: 550.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: 10,
        paymentStatus: "Pending",
        totalAmount: "BNB: 200.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: 10,
        paymentStatus: "Unpaid",
        totalAmount: "BNB: 300.00",
        paymentMethod: "Credit Card",
    },
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
                <Accordion type="single" collapsible className="w-full">
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
