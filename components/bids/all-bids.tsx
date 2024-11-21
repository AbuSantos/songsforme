import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTrigger, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Text } from "@radix-ui/themes";
import useSWR from "swr";
import { fetcher, truncate } from "@/lib/utils";
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
import { Copy } from "../actions/copy";
import { AcceptBidOffer } from "./accept-offer";
import { RejectBidOffer } from "./reject-offer";

interface BidTypes {
    nftAddress: string,
    tokenId: string
    seller: string
    userId: string
    nftId: string
}
export const AllBids = ({ tokenId, nftAddress, userId, seller, nftId }: BidTypes) => {

    // API URL
    const apiUrl = `/api/bids/${tokenId}?nftAddress=${nftAddress}`;

    // Fetch data using SWR
    const { data: bids, error, isLoading } = useSWR(apiUrl, fetcher, {
        shouldRetryOnError: true,
        errorRetryCount: 3,
    });


    if (isLoading) return <div>Loading...</div>;  // Display loading text
    if (error) return <div>Error fetching bids.</div>; // Display error message

    console.log(bids, "bids")
    return (
        <div className="grid grid-cols-2 gap-2">
            <Sheet>
                <SheetTrigger asChild>
                    <Button className="bg-transparent border-none w-full" variant="outline">
                        All Bids
                    </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">T-ID</TableHead>
                                <TableHead>Bidder</TableHead>
                                <TableHead>Bid Amount</TableHead>
                                <TableHead>Transaction Hash</TableHead>
                                <TableHead className="w-[200px]">Time</TableHead>
                                <TableHead className="w-[100px]">Status</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                bids && bids.data.length > 0 ? (
                                    bids.data.map((bid: any) => (
                                        <TableRow key={bid.id}>
                                            <TableCell className="font-medium">{bid.tokenId}</TableCell>
                                            <TableCell className="">
                                                {truncate(bid.bidder)}
                                                <Copy address={bid.bidder} />
                                            </TableCell>
                                            <TableCell>{bid.bidAmount} ETH</TableCell>
                                            <TableCell >
                                                {truncate(bid.transactionHash)}
                                                <Copy address={bid.transactionHash} />
                                            </TableCell>
                                            <TableCell className="text-right">{new Date(bid.createdAt).toLocaleString()}</TableCell>
                                            <TableCell className="text-right">
                                                <span className="text-[0.8rem] bg-[#FFCA16] py-2 px-2 rounded-md">
                                                    {bid.status}
                                                </span>
                                            </TableCell>
                                            <TableCell >
                                                {
                                                    userId && userId === seller ?
                                                        <div >
                                                            {
                                                                bid.status === "WIN" ? <p>Bid is Over</p> :
                                                                    <div className="flex space-x-1 items-center justify-center">
                                                                        <AcceptBidOffer bidId={bid.id} nftAddress={nftAddress} tokenId={tokenId} nftId={nftId} />
                                                                        < RejectBidOffer bidId={bid.id} nftAddress={nftAddress} tokenId={tokenId} />
                                                                    </div>
                                                            }
                                                        </div> :
                                                        <div className="text-center">
                                                            {
                                                                bid.status === "WIN" ? <p>Bid is Over</p> :
                                                                    <p>
                                                                        AWAITING CONFIRMATION
                                                                    </p>
                                                            }
                                                        </div>
                                                }
                                            </TableCell>
                                        </TableRow>
                                    ))) :
                                    (<TableCell>No bids available</TableCell>)
                            }
                        </TableBody>
                    </Table>

                </SheetContent>
            </Sheet>
        </div >
    );
};

// <div className="grid gap-4 py-4">
//     {bids && bids.length > 0 ? (
//         bids.map((bid: any) => (
//             <div className="grid grid-cols-6 items-center gap-2" key={bid.id}>
//                 <Text>{bid.tokenId}</Text>
//                 <Text>{truncate(bid.bidder)}</Text>
//                 <Text>{bid.bidAmount} ETH</Text>
//                 <Text>{truncate(bid.transactionHash)}</Text>
//                 <Text>{new Date(bid.timestamp).toLocaleString()}</Text> {/* Assuming timestamp is a field */}
//                 <Text>{bid.status}</Text>
//             </div>
//         ))
//     ) : (
//         <div>No bids available</div>
//     )}
// </div>