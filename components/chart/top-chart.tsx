"use server"

import { db } from "@/lib/db";
import { ListedNFT } from "@/types";
import { rankedSong } from "./ranked-song";
import Tracktable from "../musicNFTs/listedNFT/data-table";

export const TopChart = async () => {
    const chartData = await rankedSong()

    if (chartData.length === 0) {
        return (
            <div className="w-full mt-16">
                <p>There currently no songs on the chart</p>
            </div>
        )
    }

    return (
        <div className="w-full mt-8">
            < Tracktable data={chartData} />
        </div>
    )
}
