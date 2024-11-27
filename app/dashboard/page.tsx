
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
// import BoughtNFT from "@/components/buy-folder/my-bought-nft"
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

export default async function MusicPage({ searchParams }: { searchParams: { filter?: string; ratio?: string } }) {
    const filter = searchParams.filter || "ratio";
    const ratio = searchParams.ratio

    const orderBy = filter === "ratio" ? { rewardRatio: "desc" as const } : filter === "playtime" ? { accumulatedTime: "asc" as const } : undefined
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
                <div className="w-full md:max-w-full lg:block md:block col-span-3 lg:col-span-4 lg:border-l rounded-lg text-[var(--text)] p-0">
                    <div className="h-full w-full lg:px-8">
                        <Tabs defaultValue="music" className="h-full border-0">
                            <div className="flex items-center fixed py-5 justify-between w-full bg-[#111111] md:w-[67.5%] box-border">
                                <TabsList className="space-x-3">
                                    <div className="hidden md:block px-2 py-2 ">
                                        <TabsTrigger value="music" className="relative">
                                            Music
                                        </TabsTrigger>
                                        <TabsTrigger value="podcasts">Market</TabsTrigger>
                                        <TabsTrigger value="trendingPlaylist">
                                            Trending
                                        </TabsTrigger>
                                        <TabsTrigger value="mynft">My NFT</TabsTrigger>
                                        <TabsTrigger value="chart">Chart</TabsTrigger>
                                        <TabsTrigger value="minter">Minter</TabsTrigger>
                                    </div>
                                    <div className="md:hidden  py-2 ">
                                        <TabsTrigger value="music" className="relative">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" color="#000000" fill="none">
                                                <path d="M11 7.13678V17M11 7.13678C12.8928 8.81698 14.5706 10.0042 16.0063 10.6818C16.6937 11.0062 17.3165 11.0682 18.0198 10.7552C19.7751 9.97419 21 8.20629 21 6.15045C19.0715 7.50911 16.6876 6.77163 14.6847 5.50548C13.0454 4.46918 12.2258 3.95102 11.8569 4.00364C11.5781 4.0434 11.4283 4.1242 11.244 4.33421C11 4.61216 11 5.4537 11 7.13678Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M11 17C11 19.2091 9.20914 21 7 21C4.79086 21 3 19.2091 3 17C3 14.7909 4.79086 13 7 13C9.20914 13 11 14.7909 11 17Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </TabsTrigger>
                                        <TabsTrigger value="podcasts">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" color="#000000" fill="none">
                                                <path d="M14 16V8C14 7.05719 14 6.58579 13.7071 6.29289C13.4142 6 12.9428 6 12 6C11.0572 6 10.5858 6 10.2929 6.29289C10 6.58579 10 7.05719 10 8V16C10 16.9428 10 17.4142 10.2929 17.7071C10.5858 18 11.0572 18 12 18C12.9428 18 13.4142 18 13.7071 17.7071C14 17.4142 14 16.9428 14 16Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M21 9V7C21 6.05719 21 5.58579 20.7071 5.29289C20.4142 5 19.9428 5 19 5C18.0572 5 17.5858 5 17.2929 5.29289C17 5.58579 17 6.05719 17 7V9C17 9.94281 17 10.4142 17.2929 10.7071C17.5858 11 18.0572 11 19 11C19.9428 11 20.4142 11 20.7071 10.7071C21 10.4142 21 9.94281 21 9Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M7 14V12C7 11.0572 7 10.5858 6.70711 10.2929C6.41421 10 5.94281 10 5 10C4.05719 10 3.58579 10 3.29289 10.2929C3 10.5858 3 11.0572 3 12V14C3 14.9428 3 15.4142 3.29289 15.7071C3.58579 16 4.05719 16 5 16C5.94281 16 6.41421 16 6.70711 15.7071C7 15.4142 7 14.9428 7 14Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M12 21L12 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M19 13L19 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M12 6L12 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M19 5L19 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M5 18L5 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M5 10L5 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </TabsTrigger>
                                        <TabsTrigger value="trendingPlaylist">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" color="#000000" fill="none">
                                                <path d="M2 9C2 5.70017 2 4.05025 3.02513 3.02513C4.05025 2 5.70017 2 9 2H11C14.2998 2 15.9497 2 16.9749 3.02513C18 4.05025 18 5.70017 18 9V11C18 14.2998 18 15.9497 16.9749 16.9749C15.9497 18 14.2998 18 11 18H9C5.70017 18 4.05025 18 3.02513 16.9749C2 15.9497 2 14.2998 2 11V9Z" stroke="currentColor" stroke-width="1.5" />
                                                <path d="M18.2383 7C19.5732 7.08138 20.4232 7.30467 21.036 7.91738C22 8.88143 22 10.433 22 13.5363V15.4171C22 18.5203 22 20.0719 21.036 21.036C20.0719 22 18.5203 22 15.4171 22H13.5363C10.433 22 8.88143 22 7.91738 21.036C7.30467 20.4232 7.08138 19.5732 7 18.2383" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                                                <path d="M11 12V6C11.2222 6.4 11.4 8.08 13 8.4M11 12C11 13.1046 10.1046 14 9 14C7.89543 14 7 13.1046 7 12C7 10.8954 7.89543 10 9 10C10.1046 10 11 10.8954 11 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </TabsTrigger>
                                        <TabsTrigger value="mynft">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" color="#000000" fill="none">
                                                <path d="M14 18.5C14 18.5 15 18.5 16 20.5C16 20.5 19.1765 15.5 22 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M5.5 11.5H5.49102" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M11 19.5H10.5C6.74142 19.5 4.86213 19.5 3.60746 18.5091C3.40678 18.3506 3.22119 18.176 3.0528 17.9871C2 16.8062 2 15.0375 2 11.5C2 7.96252 2 6.19377 3.0528 5.0129C3.22119 4.82403 3.40678 4.64935 3.60746 4.49087C4.86213 3.5 6.74142 3.5 10.5 3.5H13.5C17.2586 3.5 19.1379 3.5 20.3925 4.49087C20.5932 4.64935 20.7788 4.82403 20.9472 5.0129C21.8957 6.07684 21.9897 7.61799 21.999 10.5V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M14.5 11.5C14.5 12.8807 13.3807 14 12 14C10.6193 14 9.5 12.8807 9.5 11.5C9.5 10.1193 10.6193 9 12 9C13.3807 9 14.5 10.1193 14.5 11.5Z" stroke="currentColor" stroke-width="1.5" />
                                            </svg>
                                        </TabsTrigger>
                                        <TabsTrigger value="chart">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" color="#000000" fill="none">
                                                <path d="M3 4V14C3 16.8284 3 18.2426 3.87868 19.1213C4.75736 20 6.17157 20 9 20H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M6 14L9.25 10.75C9.89405 10.1059 10.2161 9.78392 10.5927 9.67766C10.8591 9.60254 11.1409 9.60254 11.4073 9.67766C11.7839 9.78392 12.1059 10.1059 12.75 10.75C13.3941 11.3941 13.7161 11.7161 14.0927 11.8223C14.3591 11.8975 14.6409 11.8975 14.9073 11.8223C15.2839 11.7161 15.6059 11.3941 16.25 10.75L20 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </TabsTrigger>
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
                                        <MobileNav />
                                    </div>
                                </div>
                            </div>
                            <TabsContent
                                value="music"
                                className="border-none pt-24 outline-none px-2 "
                            >
                                <div className="w-full ">
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
                                        <div className="">
                                            <h2 className="text-[1.5rem] md:text-2xl font-semibold tracking-normal">
                                                Singles and Albums
                                            </h2>
                                            <p className="text-sm hidden text-muted-foreground">
                                                Top picks for you. Updated daily.
                                            </p>
                                        </div>
                                    </div>
                                    <Separator className="my-4 " />
                                    <div className="relative">
                                        <div className="flex flex-wrap space-x-2 pb-4 gap-2">
                                            {singleNft?.map((data: Single, index: number) => (
                                                <AlbumArtwork
                                                    key={data.id}
                                                    album={data}
                                                    className="w-[180px]"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                            </TabsContent>
                            <TabsContent
                                value="podcasts"
                                className="w-full data-[state=active]:flex pt-16  px-2"
                            >
                                <div className="h-screen w-full flex-col border-none p-0 ">
                                    <div className="md:flex  space-x-2 justify-between bg-[#111111] fixed md:w-[67.2%] w-full">
                                        <div className="w-[98%] ">
                                            <Search placeholder="Search songs..." />
                                        </div>
                                        <div className="flex items-center w-[95%] space-x-2">
                                            <FilterPlace />
                                            <FilterByTime />
                                        </div>
                                    </div>
                                    <Separator className="my-4  bg-[#7B7B7B]" />
                                    <div className="w-full pt-20 md:pt-[2rem] pb-6 overflow-y-auto scroll-smooth scrollbar-none">
                                        <Suspense fallback={<MarketSkeleton />}>
                                            <div className="flex flex-wrap space-x-4 pb-4">
                                                < MarketPlace filter={filter} />
                                            </div>
                                        </Suspense>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent
                                value="mynft"
                                className="border-none p-0 pt-20 outline-none"
                            >
                                <Suspense fallback={<MarketSkeleton />}>
                                    <BoughtNFT />
                                </Suspense>
                            </TabsContent>
                            <TabsContent
                                value="trendingPlaylist"
                                className="border-none p-0 pt-20 px-2 outline-none"
                            >
                                <div className="fixed md:w-[67.2%] w-[95%] bg-[#111111] space-x-2 ">
                                    <div className="flex items-center justify-between ">
                                        <div className="space-y-1">
                                            <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
                                                All Playlist
                                            </h2>
                                            <p className="text-sm text-muted-foreground">
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
                                className="border-none pt-[4.8rem] outline-none px-2 "
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
                                value="minter"
                                className="border-none pt-[58px] outline-none px-2 "
                            >
                                <div className="fixed md:w-[67.2%] w-[95%] bg-[#111111] space-x-2 ">
                                    <div className="space-y-1">
                                        <h2 className="text-xl md:text-2xl font-semibold tracking-tight py-3">
                                            MINTER
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            All Minted NFTS will be listed on the MarketPlace
                                        </p>
                                    </div>
                                    <div>
                                        <Separator className="my-4 " />
                                    </div>
                                </div>

                                <div className="w-full pt-16 md:pt-[2rem] pb-6 overflow-y-auto scroll-smooth scrollbar-none">
                                    <Suspense fallback={<MarketSkeleton />}>
                                        <Minter />
                                    </Suspense>
                                </div>

                            </TabsContent>
                        </Tabs>
                    </div>
                </div >
            </>
        )
    } catch (error) {
        console.log(error)
        return (
            <div className="text-center pt-5">
                <h2 className="text-red-500">Failed to load the page.</h2>
                <p>Please refresh</p>
            </div>)
    }
}