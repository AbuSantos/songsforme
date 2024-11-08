
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { AlbumArtwork } from "@/components/dashboard/album-artwork"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { HelpComponent } from "@/components/dashboard/addnft/help"
import { MusicAccordion } from "@/components/dashboard/addnft/music-type"
import { db } from "@/lib/db"
import { revalidateTag } from "next/cache"
import MarketPlace from "@/components/marketplace/market"
import { Filter } from "@/components/marketplace/filter"
import { FilterByName } from "@/components/marketplace/filter/filter-by-name"
import BoughtNFT from "@/components/buy-folder/my-bought-nft"
import { ListedNFT, Playlist, PlaylistListedNFT, Single } from "@/types"
import { AllPlaylist } from "@/components/playlists/all-playlist"
import { MobileNav } from "@/components/mobile/mobilenav/mobile-nav";
import { getSession } from "@/lib/helper"
import { TrendingPlaylist } from "@/components/playlists/trending-playlist"
import { FilterPlace } from "@/components/playlists/filter-playlist"

export const metadata: Metadata = {
    title: "songs for me",
    description: "Earn songs as your listen to music.",
}

export default async function MusicPage({ searchParams }: { searchParams: { filter?: string } }) {
    const userId = await getSession()
    const filter = searchParams.filter || "ratio";

    const orderBy = filter === "ratio" ? { rewardRatio: "desc" as const } : filter === "playtime" ? { accumulatedTime: "asc" as const } : undefined
    // const playlists: Playlist[] = await db.playlist.findMany({
    //     select: {
    //         rewardRatio: true,
    //         accumulatedTime: true,
    //         name: true,
    //         id: true,

    //     },
    //     ...(orderBy ? { orderBy } : {})
    // })



    try {
        const listedData: ListedNFT[] = await db.listedNFT.findMany({
            where: {
                sold: false
            }
        });

        revalidateTag("nft");

        const singleNft: Single[] = await db.single.findMany({
            include: {
                listedNft: true
            }
        })

        const playlists: Playlist[] = await db.playlist.findMany({
            select: {
                rewardRatio: true,
                accumulatedTime: true,
                name: true,
                id: true,
                listednft: {
                    select: {
                        id: true
                    }
                }
            },
            ...(orderBy ? { orderBy } : {})
        })


        // Sort playlists by the lowest `rewardRatio` of their `listednft`
        const getSortedPlaylists = () => {
            if (!playlists || playlists.length === 0) return [];

            return playlists.sort((a, b) => {
                const aRewardRatio = a?.rewardRatio || Infinity
                const bRewardRatio = b?.rewardRatio || Infinity

                return aRewardRatio - bRewardRatio
            })
        }
        const sortedPlaylists = getSortedPlaylists();
        if (!listedData) {
            return
        }

        return (
            <>
                <div className="w-[100vw] md:max-w-full lg:block md:block col-span-3 lg:col-span-4 lg:border-l bg-[#111111] rounded-lg text-[var(--text)]">
                    <div className="h-full px-4 py-6 lg:px-8">
                        <Tabs defaultValue="music" className="h-full space-y-6 border-0">
                            <div className="flex items-center justify-between">
                                <TabsList>
                                    <div className="hidden md:block">
                                        <TabsTrigger value="music" className="relative">
                                            Music
                                        </TabsTrigger>
                                        <TabsTrigger value="podcasts">Market</TabsTrigger>
                                        <TabsTrigger value="trendingPlaylist">
                                            Trending
                                        </TabsTrigger>
                                        <TabsTrigger value="mynft">My NFT</TabsTrigger>
                                    </div>
                                    <div className="md:hidden  ">
                                        <TabsTrigger value="music" className="relative">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" style={{ fill: "rgba(0, 0, 0, 1)", transform: "msFilter", marginLeft: "2px" }}><path d="m19.684 5.821-9-3.272A1.998 1.998 0 0 0 8 4.428v6.129A3.953 3.953 0 0 0 6 10c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4V4.428L19 7.7v6.856A3.962 3.962 0 0 0 17 14c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4V7.7c0-.838-.529-1.594-1.316-1.879zM6 16c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2zm11 4c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z"></path></svg>
                                        </TabsTrigger>
                                        <TabsTrigger value="podcasts">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" style={{ fill: "rgba(0, 0, 0, 1)", transform: "msFilter", marginLeft: "2px" }}><path d="M19.148 2.971A2.008 2.008 0 0 0 17.434 2H6.566c-.698 0-1.355.372-1.714.971L2.143 7.485A.995.995 0 0 0 2 8a3.97 3.97 0 0 0 1 2.618V19c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2v-8.382A3.97 3.97 0 0 0 22 8a.995.995 0 0 0-.143-.515l-2.709-4.514zm.836 5.28A2.003 2.003 0 0 1 18 10c-1.103 0-2-.897-2-2 0-.068-.025-.128-.039-.192l.02-.004L15.22 4h2.214l2.55 4.251zM10.819 4h2.361l.813 4.065C13.958 9.137 13.08 10 12 10s-1.958-.863-1.993-1.935L10.819 4zM6.566 4H8.78l-.76 3.804.02.004C8.025 7.872 8 7.932 8 8c0 1.103-.897 2-2 2a2.003 2.003 0 0 1-1.984-1.749L6.566 4zM10 19v-3h4v3h-4zm6 0v-3c0-1.103-.897-2-2-2h-4c-1.103 0-2 .897-2 2v3H5v-7.142c.321.083.652.142 1 .142a3.99 3.99 0 0 0 3-1.357c.733.832 1.807 1.357 3 1.357s2.267-.525 3-1.357A3.99 3.99 0 0 0 18 12c.348 0 .679-.059 1-.142V19h-3z"></path></svg>
                                        </TabsTrigger>
                                        <TabsTrigger value="trendingPlaylist">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" style={{ fill: "rgba(0, 0, 0, 1)", transform: "msFilter", marginLeft: "2px" }}><path d="M13 16.493C13 18.427 14.573 20 16.507 20s3.507-1.573 3.507-3.507c0-.177-.027-.347-.053-.517H20V6h2V4h-3a1 1 0 0 0-1 1v8.333a3.465 3.465 0 0 0-1.493-.346A3.51 3.51 0 0 0 13 16.493zM2 5h14v2H2z"></path><path d="M2 9h14v2H2zm0 4h9v2H2zm0 4h9v2H2z"></path></svg>
                                        </TabsTrigger>
                                        <TabsTrigger value="mynft">My NFT</TabsTrigger>
                                    </div>

                                </TabsList>
                                <div className="flex space-x-1">
                                    <Sheet >
                                        <SheetTrigger asChild>
                                            <Button variant="outline" size="nav" className="text-gray-950">Add NFT</Button>
                                        </SheetTrigger>
                                        <SheetContent>
                                            <SheetHeader>
                                                <SheetTitle>List Music</SheetTitle>
                                            </SheetHeader>
                                            <MusicAccordion />

                                            <div className="mt-8">
                                                <div>
                                                    <h1 className="text-2xl font-semibold">Check our FAQs</h1>
                                                    <small className="text-slate-600 capitalize" >Cant find help, please contact support@songsforme</small>
                                                </div>
                                                <HelpComponent />
                                            </div>
                                        </SheetContent>
                                    </Sheet>
                                    <div className="md:hidden">
                                        <MobileNav userId={userId} />
                                    </div>
                                </div>
                            </div>

                            <TabsContent
                                value="music"
                                className="border-none p-0 outline-none "
                            >
                                <div className="w-full">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <h2 className="text-xl md:text-2xl font-semibold tracking-normal">
                                                Trending playlist
                                            </h2>
                                            <p className="text-sm hidden text-muted-foreground">
                                                Good ratios. Updated daily.
                                            </p>
                                        </div>
                                    </div>
                                    <Separator className="my-4 " />

                                    <div className="max-w-[100vw] overflow-auto " >
                                        <div className="flex flex-nowrap overflow-auto pb-4 snap-x snap-mandatory scroll-smooth ">
                                            {sortedPlaylists.map((playlist) => (
                                                <TrendingPlaylist
                                                    key={playlist.id}
                                                    album={playlist}
                                                    className="w-[180px] snap-start flex-shrink-0"
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <h2 className="text-xl md:text-2xl font-semibold tracking-normal">
                                                Singles and Albums
                                            </h2>
                                            <p className="text-sm hidden text-muted-foreground">
                                                Top picks for you. Updated daily.
                                            </p>
                                        </div>
                                    </div>
                                    <Separator className="my-4 " />
                                    <div className="relative">
                                        <ScrollArea>
                                            <div className="flex flex-wrap space-x-2 pb-4 gap-2">
                                                {singleNft?.map((data: Single, index: number) => (
                                                    <AlbumArtwork
                                                        key={data.id}
                                                        album={data}
                                                        index={index}
                                                        className="w-[180px]"
                                                    />
                                                ))}
                                            </div>
                                            <ScrollBar orientation="horizontal" />
                                        </ScrollArea>
                                    </div>
                                </div>

                            </TabsContent>
                            <TabsContent
                                value="podcasts"
                                className="h-full flex-col border-none p-0 data-[state=active]:flex"
                            >
                                <div className="flex items-center justify-between ">
                                    <div className="space-y-1">
                                        <h2 className=" font-medium text-2xl  md:font-semibold tracking-tight text-[#B4B4B4]">
                                            Buy and Sell NFTs
                                        </h2>
                                        <small className="text-sm text-[#6E6E6E]">
                                            create playlist and earn
                                        </small>
                                    </div>

                                    <div>
                                        {/* @ts-ignore */}
                                        <FilterByName items={listedData} />
                                    </div>
                                </div>
                                <Separator className="my-4 bg-[#7B7B7B]" />
                                <div className="relative">
                                    <ScrollArea>
                                        <div className="flex flex-wrap space-x-4 pb-4">
                                            < MarketPlace />
                                        </div>
                                        <ScrollBar orientation="horizontal" />
                                    </ScrollArea>
                                </div>
                            </TabsContent>
                            <TabsContent
                                value="mynft"
                                className="border-none p-0 outline-none"
                            >
                                <BoughtNFT />
                            </TabsContent>
                            <TabsContent
                                value="trendingPlaylist"
                                className="border-none p-0 outline-none"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-semibold tracking-tight">
                                            All Playlist
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            Top picks for you. Updated daily.
                                        </p>
                                    </div>
                                    <div>
                                        <FilterPlace />
                                        {/* @ts-ignore */}
                                        {/* <FilterByName items={listedData} /> */}
                                    </div>
                                </div>
                                <Separator className="my-4 " />
                                <AllPlaylist data={playlists} />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </>
        )
    } catch (error) {
        console.log(error)
    }
}