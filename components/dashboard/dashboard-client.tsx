"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ListedNFT, Playlist, Single } from "@/types"
import { FilterPlace } from "@/components/playlists/filter-playlist"
import { MarketSkeleton } from "@/components/marketplace/marketplace-skeleton"
import { Suspense } from "react"
import { FilterByTime } from "@/components/marketplace/filter/filter-by-time"
import dynamic from "next/dynamic"

const MobileNav = dynamic(
    () => import("@/components/mobile/mobilenav/mobile-nav").then(mod => mod.MobileNav),
    { ssr: false }
);

const TrendingPlaylist = dynamic(
    () => import("@/components/playlists/trending-playlist").then(mod => mod.TrendingPlaylist),
    { ssr: false }
);

const TopChart = dynamic(
    () => import("@/components/chart/top-chart").then(mod => mod.TopChart),
    { ssr: false }
);

const SingleGenre = dynamic(
    () => import("@/components/singles-genre/single-genre").then(mod => mod.SingleGenre),
    { ssr: false }
);

const MyArtisteHub = dynamic(
    () => import("@/components/artiste-hub/my-artiste-hub").then(mod => mod.MyArtisteHub),
    { ssr: false }
);

const MarketPlace = dynamic(
    () => import("@/components/marketplace/market").then(mod => mod.default),
    { ssr: false, loading: () => <MarketSkeleton /> }
);

const DesktopTab = dynamic(
    () => import("@/components/page-menu/desktop-tab").then(mod => mod.DesktopTab),
    { ssr: false }
);

const MobileTab = dynamic(
    () => import("@/components/page-menu/mobile-tab").then(mod => mod.MobileTab),
    { ssr: false }
);

const BoughtNFT = dynamic(
    () => import("@/components/buy-folder/my-bought-nft").then(mod => mod.default),
    { ssr: false }
);

const AllPlaylist = dynamic(
    () => import("@/components/playlists/all-playlist").then(mod => mod.AllPlaylist),
    { ssr: false }
);

const Search = dynamic(
    () => import("@/components/dashboard/search/search-songs").then(mod => mod.Search),
    { ssr: false }
);

const Tracktable = dynamic(
    () => import("@/components/musicNFTs/listedNFT/data-table").then(mod => mod.Tracktable),
    { ssr: false }
);

interface DashboardClientProps {
    listedData: ListedNFT[];
    singleNft: Single[];
    sortedPlaylists: Playlist[];
    whitelistedArtists: any[];
}

export function DashboardClient({
    listedData,
    singleNft,
    sortedPlaylists,
    whitelistedArtists
}: DashboardClientProps) {
    return (
        <div className="w-full md:max-w-full lg:!block md:!block col-span-3 lg:col-span-4 rounded-lg text-[var(--text)] p-0">
            <div className="h-full w-full lg:px-8">
                <Tabs defaultValue="music" className="h-full border-0 ">
                    <div className="fixed  inset-x-0  ml-10 w-full max-w-6xl z-50">
                        <div className="hidden md:flex items-center py-5 space-x-4 justify-between bg-[#111111] w-full box-border">
                            <TabsList className="space-x-3 md:w-[67.5%] hidden md:flex z-50">
                                <DesktopTab artistesIds={whitelistedArtists} />
                            </TabsList>
                        </div>
                    </div>
                    <TabsContent
                        value="music"
                        className="border-none md:pt-24 pt-2 outline-none px-2 z-50"
                    >
                        <div className="w-full ">
                            <div className="w-[99%] md:!hidden flex mb-4">
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
                                            album={playlist}
                                            className="w-[180px] snap-start flex-shrink-0"
                                        />
                                    ))}
                                </div>
                            </div>

                            <Separator className="my-4 " />
                            <SingleGenre singleNft={singleNft} />
                        </div>

                    </TabsContent>
                    <TabsContent
                        value="podcasts"
                        className="w-full data-[state=active]:flex md:pt-16 pt-2 px-2"
                    >
                        <div className="h-screen w-full flex-col border-none p-0 ">
                            <div className="md:grid grid-cols-2 space-x-2 justify-between bg-[#111111] fixed md:w-[65%] w-[98%] -mt-4 md:-mt-0 z-50">
                                <div className="w-[98%] flex items-center m-auto ">
                                    <Search placeholder="Search songs..." />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <FilterPlace />
                                    <FilterByTime />
                                </div>
                            </div>
                            <div className="w-full pt-20 md:pt-[2rem] pb-10 overflow-y-auto scroll-smooth scrollbar-none">
                                <Suspense fallback={<MarketSkeleton />}>
                                    <div className="flex flex-wrap space-x-4 md:pb-4 pb-14">
                                        <MarketPlace />
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
                        <MyArtisteHub />
                    </TabsContent>
                    <div className="mt-auto w-full fixed bottom-0  md:hidden h-20">
                        <TabsList className="w-full py-5 h-20 rounded-none bg-black">
                            <MobileTab artistesIds={whitelistedArtists} />
                            <div className=" mobile absolute right-4 bottom-20 mb-2">
                                <MobileNav />
                            </div>
                        </TabsList>

                    </div>
                </Tabs>
            </div>
        </div>
    )
} 