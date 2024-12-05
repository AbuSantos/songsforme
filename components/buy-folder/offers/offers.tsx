"use client"

import { fetcher } from "@/lib/utils";
import useSWR from "swr";
import { MyNFTOFfers } from "./offer-component";

export const AllOffer = ({ userId }: { userId: string }) => {
    const apiUrl = userId ? `/api/listednft/${userId}` : null;

    // Use SWR to fetch data; only fetch if `apiUrl` is not null
    const { data: bids, error, isLoading } = useSWR(
        apiUrl,
        apiUrl ? fetcher : null,
        {
            shouldRetryOnError: true,
            errorRetryCount: 3,
        }
    );

    return (
        <div>
            <h1>MY Offers</h1>
            <div>
                < MyNFTOFfers data={bids} />
            </div>
        </div>
    )
}
