"use client"

import { useEffect, useState } from "react";
import { ListedNFT } from "@/types";
import { rankedSong } from "./ranked-song";
import dynamic from "next/dynamic";
// import Tracktable from "../musicNFTs/listedNFT/data-table";

const Tracktable = dynamic(
    () => import("../musicNFTs/listedNFT/data-table").then(mod => mod.Tracktable),
    { ssr: false }
);

export const TopChart = () => {
    const [chartData, setChartData] = useState<ListedNFT[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await rankedSong();
                setChartData(data);
            } catch (error) {
                console.error("Error fetching chart data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="w-full mt-16">
                <p>Loading chart data...</p>
            </div>
        );
    }

    return (
        <div className="w-full mt-8">
            < Tracktable data={chartData} />
        </div>
    )
}
