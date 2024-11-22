"use server"

import { db } from "@/lib/db";
import { ListedNFT } from "@/types";
import { rankedSong } from "./ranked-song";
import Tracktable from "../musicNFTs/listedNFT/data-table";

export const TopChart = async () => {
    const chartData = await rankedSong()


    return (
        <div className="w-full mt-8">
            < Tracktable data={chartData} />
        </div>
    )
}
