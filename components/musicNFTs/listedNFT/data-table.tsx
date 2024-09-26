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
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[20px]">Sold</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Method</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {invoices.map((invoice) => (
                    <TableRow key={invoice.invoice} className="space-y-5">
                        <TableCell className="font-medium py-4 text-slate-400">{invoice.invoice}</TableCell>
                        <TableCell>
                            <div className="flex flex-col ">
                                <p>
                                    {invoice.paymentStatus}
                                </p>
                                <small className="text-gray-600 uppercase">
                                    FT: Santos
                                </small>
                            </div>
                        </TableCell>
                        <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                        <TableCell>
                            <div className="flex space-x-2">
                                < MakeBid />
                                <BuyNFT />
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
