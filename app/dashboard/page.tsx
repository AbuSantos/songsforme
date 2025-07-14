import { Metadata } from "next"
import { db } from "@/lib/db"
import { revalidateTag } from "next/cache"
import { ListedNFT, Playlist, Single } from "@/types"
import dynamic from "next/dynamic"

const DashboardClient = dynamic(
    () => import("@/components/dashboard/dashboard-client").then(mod => mod.DashboardClient),
    { ssr: false }
);

export const metadata: Metadata = {
    title: "songs for me",
    description: "Earn coins as your listen to music.",
}

export default async function MusicPage({ searchParams }: { searchParams: { filter?: string; q?: string } }) {

    const filter = searchParams.filter?.trim() || "ratio" || undefined;
    const orderBy = filter === "ratio" ? { rewardRatio: "desc" as const } : filter === "playtime" ? { accumulatedTime: "asc" as const } : undefined
    const filterByName = filter !== "ratio" && filter !== "playtime" ? filter : ""
    revalidateTag("nft");

    try {
        const listedData = await db.listedNFT.findMany({
            where: {
                sold: false
            }
        }) as unknown as ListedNFT[];

        const singleNft = await db.single.findMany({
            select: {
                id: true,
                artist_name: true,
                song_name: true,
                song_cover: true,
                contractAddress: true,
                genre: true,
                owner: true,
                listedNft: {
                    select: {
                        contractAddress: true,
                        tokenId: true,
                        id: true
                    }
                }
            }
        }) as unknown as Single[];

        const playlists = await db.playlist.findMany({
            select: {
                rewardRatio: true,
                accumulatedTime: true,
                name: true,
                id: true,
                owner: {
                    select: {
                        userId: true,
                        username: true,
                    }
                },
                listednft: {
                    select: {
                        id: true
                    }
                }
            },
            ...(orderBy ? { orderBy } : {})
        }) as unknown as Playlist[];

        // Sort playlists by the lowest `rewardRatio` of their `listednft`
        const getSortedPlaylists = (): Playlist[] => {
            if (!playlists || playlists.length === 0) return [];

            return playlists.sort((a: Playlist, b: Playlist) => {
                const aRewardRatio = a?.rewardRatio || Infinity
                const bRewardRatio = b?.rewardRatio || Infinity

                return aRewardRatio - bRewardRatio
            })
        }

        const whitelistedArtists = await db.whitelist.findMany({
            select: {
                id: true,
                userId: true
            }
        })

        const sortedPlaylists = getSortedPlaylists();

        if (!listedData) {
            return
        }

        return (
            <DashboardClient
                listedData={listedData}
                singleNft={singleNft}
                sortedPlaylists={sortedPlaylists}
                whitelistedArtists={whitelistedArtists}
            />
        )
    } catch (error) {
        console.log(error, "from dashboard page")
        return (
            <div className="text-center pt-5">
                <h2 className="text-red-500">Failed to load the page.</h2>
                <p>Please refresh</p>
            </div>)
    }
}