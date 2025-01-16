"use client"
import { useRecoilValue } from "recoil";
import { TabsTrigger } from "../ui/tabs"
import { isConnected } from "@/atoms/session-atom";

type ArtistesId = {
    id: string,
    userId: string
}

type DesktopTabType = {
    artistesIds: ArtistesId[]
}
export const DesktopTab = ({ artistesIds }: DesktopTabType) => {
    const userId = useRecoilValue(isConnected)?.userId;

    const isWhitelisted = artistesIds.some((id: ArtistesId) => id.userId === userId)
    return (
        <div className=" px-2 py-2 flex items-start ">
            <TabsTrigger value="music" className="relative">
                Home
            </TabsTrigger>
            <TabsTrigger value="podcasts">Market</TabsTrigger>
            <TabsTrigger value="trendingPlaylist">
                Trending
            </TabsTrigger>

            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="mynft">
                Mine
            </TabsTrigger>
            {
                isWhitelisted &&
                <TabsTrigger value="artiste_hub">
                    Artiste Hub
                </TabsTrigger>
            }
        </div>
    )
}
