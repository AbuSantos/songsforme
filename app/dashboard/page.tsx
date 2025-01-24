import { Metadata } from "next"
import { Button } from "@/components/ui/button"
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
import { Filter } from "@/components/marketplace/filter"
import { FilterByName } from "@/components/marketplace/filter/filter-by-name"
import { ListedNFT, Playlist, PlaylistListedNFT, Single } from "@/types"
import { AllPlaylist } from "@/components/playlists/all-playlist"
import { MobileNav } from "@/components/mobile/mobilenav/mobile-nav";
import { getSession } from "@/lib/helper"
import { TrendingPlaylist } from "@/components/playlists/trending-playlist"
import { FilterPlace } from "@/components/playlists/filter-playlist"
import { Search } from "@/components/dashboard/search/search-songs"
import { MarketSkeleton } from "@/components/marketplace/marketplace-skeleton"
import { Suspense } from "react"
import { FilterByTime } from "@/components/marketplace/filter/filter-by-time"
import { Ratio } from "@/components/marketplace/filter/filter-by-ratio"
import dynamic from "next/dynamic"
import { TopChart } from "@/components/chart/top-chart"
import { Minter } from "@/components/minter/minter"
import { SingleGenre } from "@/components/singles-genre/single-genre"
import { getAddressOrName, getTimeThreshold } from "@/lib/utils"
import { Prisma } from "@prisma/client"
import NotificationFeed from "@/components/knock/notification-feed"
import { ArtisteHub } from "@/components/artiste-hub/artiste-hub"
import { MyArtisteHub } from "@/components/artiste-hub/my-artiste-hub"
import { DesktopTab } from "@/components/page-menu/desktop-tab"
import { MobileTab } from "@/components/page-menu/mobile-tab"

const MarketPlace = dynamic(() => import("@/components/marketplace/market"), {
    suspense: true,
});

const BoughtNFT = dynamic(() => import("@/components/buy-folder/my-bought-nft"), {
    suspense: true,
});

export const metadata: Metadata = {
    title: "songs for me",
    description: "Earn songs as your listen to music.",
}


export default async function MusicPage({ searchParams }: { searchParams: { filter?: string; q?: string } }) {

    const filter = searchParams.filter?.trim() || "ratio" || undefined;
    const orderBy = filter === "ratio" ? { rewardRatio: "desc" as const } : filter === "playtime" ? { accumulatedTime: "asc" as const } : undefined
    const filterByName = filter !== "ratio" && filter !== "playtime" ? filter : ""

    try {
        {/* @ts-ignore */ }
        const listedData: ListedNFT[] = await db.listedNFT.findMany({
            where: {
                sold: false
            }
        });

        revalidateTag("nft");
        {/* @ts-ignore */ }
        const singleNft: Single[] = await db.single.findMany({
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
        })

        {/* @ts-ignore */ }
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
            <>
                <div className="w-full md:max-w-full lg:block md:block col-span-3 lg:col-span-4 rounded-lg text-[var(--text)] p-0">
                    <div className="h-full w-full lg:px-8">
                        <Tabs defaultValue="music" className="h-full border-0 ">
                            <div className="hidden md:flex items-center fixed py-5 space-x-4 justify-between w-full bg-[#111111] md:w-[67.5%] box-border">
                                <TabsList className="space-x-3 w-full hidden md:flex">
                                    < DesktopTab artistesIds={whitelistedArtists} />
                                </TabsList>

                                <div className=" space-x-2 md:flex hidden z-20">
                                    <Sheet >
                                        <SheetTrigger asChild>
                                            <Button variant="outline" size="nav" className="text-gray-950">Help</Button>
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
                                    {/* <div className="bg-white"  >
                                        < NotificationFeed />
                                    </div> */}

                                </div>
                            </div>
                            <TabsContent
                                value="music"
                                className="border-none md:pt-24 pt-2 outline-none px-2 "
                            >
                                <div className="w-full ">
                                    <div className="w-[99%] md:hidden flex mb-4">
                                        <Search placeholder="Search songs..." />
                                    </div>
                                    <div className="flex items-center justify-between ">
                                        <div className="space-y-1">

                                            <h2 className="text-[1.5rem] md:text-2xl font-semibold tracking-normal">
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
                                                    // @ts-ignore  
                                                    album={playlist}
                                                    className="w-[180px] snap-start flex-shrink-0"
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                    </div>
                                    <Separator className="my-4 " />
                                    < SingleGenre singleNft={singleNft} />
                                </div>

                            </TabsContent>
                            <TabsContent
                                value="podcasts"
                                className="w-full data-[state=active]:flex md:pt-16 pt-2 px-2"
                            >
                                <div className="h-screen w-full flex-col border-none p-0 ">
                                    <div className="md:flex space-x-2 justify-between bg-[#111111] fixed md:w-[90%] w-full m-auto">
                                        <div className="w-[98%] flex items-center m-auto ">
                                            <Search placeholder="Search songs..." />
                                        </div>
                                        <div className="flex items-center w-[100%] space-x-2">
                                            <FilterPlace />
                                            <FilterByTime />
                                        </div>
                                    </div>
                                    {/* <Separator className="my-4 bg-[#7B7B7B] hidden md:block" /> */}
                                    <div className="w-full pt-20 md:pt-[2rem] pb-10 overflow-y-auto scroll-smooth scrollbar-none">
                                        <Suspense fallback={<MarketSkeleton />}>
                                            <div className="flex flex-wrap space-x-4 md:pb-4 pb-14">
                                                < MarketPlace />
                                                {/* < MarketPlace filter={filter} /> */}
                                            </div>
                                        </Suspense>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent
                                value="mynft"
                                className="border-none p-0 md:pt-24 pt-2 outline-none"
                            >
                                <Suspense fallback={<MarketSkeleton />}>
                                    <BoughtNFT />
                                </Suspense>
                            </TabsContent>
                            <TabsContent
                                value="trendingPlaylist"
                                className="border-none p-0 md:pt-24 pt-2 px-2 outline-none"
                            >
                                <div className="fixed md:w-[67.2%] w-[95%] bg-[#111111] space-x-2 ">
                                    <div className="flex items-center justify-between ">
                                        <div className="space-y-1">
                                            <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                                                All Playlist
                                            </h2>
                                            <p className="text-sm text-muted-foreground hidden md:block">
                                                Top picks for you. Updated daily.
                                            </p>
                                        </div>
                                        <div>
                                            <FilterPlace />
                                        </div>
                                    </div>
                                    <div>
                                        <Separator className="my-4 " />
                                    </div>
                                </div>
                                <div className="pt-16" >
                                    <AllPlaylist />
                                </div>
                            </TabsContent>
                            <TabsContent
                                value="chart"
                                className="border-none md:pt-[4.8rem] pt-8 outline-none px-2 "
                            >
                                <div className="fixed md:w-[67.2%] w-[95%] bg-[#111111] space-x-2 ">
                                    <div className="space-y-1">
                                        <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                                            Top songs
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            Top picks for you. Updated daily.
                                        </p>
                                    </div>
                                    <div>
                                        <Separator className="my-4 " />
                                    </div>
                                </div>

                                <div className="w-full pt-20 md:pt-[2rem] pb-6 overflow-y-auto scroll-smooth scrollbar-none">
                                    <Suspense fallback={<MarketSkeleton />}>
                                        <TopChart />
                                    </Suspense>
                                </div>
                            </TabsContent>

                            <TabsContent
                                value="artiste_hub"
                                className="border-none p-0 md:pt-24 pt-2 outline-none"
                            >
                                <div className="space-y-1">

                                    <h2 className="text-[1.5rem] md:text-2xl font-semibold tracking-normal">
                                        Artiste Hub
                                    </h2>

                                    <p className="text-sm hidden text-muted-foreground">
                                        Track Sales, listed and playlists
                                    </p>
                                </div>
                                <Separator className="my-4 " />

                                {/* @ts-ignore */}
                                <MyArtisteHub />
                            </TabsContent>

                            <div className="mt-auto w-full fixed bottom-0  md:hidden h-20">
                                <TabsList className="w-full py-5 h-20  rounded-none bg-black">
                                    < MobileTab artistesIds={whitelistedArtists} />
                                    <div className=" mobile absolute right-4 bottom-20 mb-2">
                                        <MobileNav />
                                    </div>
                                </TabsList>

                            </div>

                        </Tabs>
                    </div>
                </div >
            </>
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