
import { Metadata } from "next"
import Image from "next/image"
import { PlusCircledIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import { listenNowAlbums, madeForYouAlbums } from "@/data/albums"
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
import { DesktopNFTForm } from "@/components/modal/list-NFTD"
import { HelpComponent } from "@/components/dashboard/addnft/help"
import { MusicAccordion } from "@/components/dashboard/addnft/music-type"
import { db } from "@/lib/db"
import { revalidateTag } from "next/cache"
export const metadata: Metadata = {
    title: "songs for me",
    description: "Earn songs as your listen to music.",
}
interface AlbumArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
    album: {
        contract: string;
        price: string;
        seller: string;
        tokenId: string;
        sold: boolean;
        uri: string | null
        userId: string | null
    };
    index: number;
    aspectRatio?: "portrait" | "square";
    width?: number;
    height?: number;
}

export default async function MusicPage() {


    const listedData = await db.listedNFT.findMany({
        include: {
            Single: {
                include: {
                    listedNft: true,
                },
            },
        },
    });

    revalidateTag("nft");

    const singleNft = await db.single.findMany({
        include: {
            listedNft: true
        }
    })

    console.log(singleNft[0], "singles")
    // console.log(listedData, "nft")

    if (!listedData) {
        console.log("no nft");
    }

    return (
        <>
            <div className="col-span-3 lg:col-span-4 lg:border-l bg-[#111111] rounded-lg text-[var(--text)]">
                <div className="h-full px-4 py-6 lg:px-8">
                    <Tabs defaultValue="music" className="h-full space-y-6">
                        <div className="flex items-center justify-between">
                            <TabsList>
                                <TabsTrigger value="music" className="relative">
                                    Music
                                </TabsTrigger>
                                <TabsTrigger value="podcasts">Market Place</TabsTrigger>
                            </TabsList>
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
                        </div>
                        <TabsContent
                            value="music"
                            className="border-none p-0 outline-none"
                        >
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-semibold tracking-tight">
                                        Listen Now
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Top picks for you. Updated daily.
                                    </p>
                                </div>
                            </div>
                            <Separator className="my-4 " />
                            <div className="relative">
                                <ScrollArea>
                                    <div className="flex flex-wrap space-x-4 pb-4">
                                        {singleNft?.map((data: AlbumArtworkProps, index: number) => (
                                            <AlbumArtwork
                                                key={data.id}
                                                album={data}
                                                index={index}
                                                className="w-[200px]"
                                            />
                                        ))}
                                    </div>
                                    <ScrollBar orientation="horizontal" />
                                </ScrollArea>
                            </div>

                        </TabsContent>
                        <TabsContent
                            value="podcasts"
                            className="h-full flex-col border-none p-0 data-[state=active]:flex"
                        >
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-semibold tracking-tight text-[#B4B4B4]">
                                        Buy and Sell Music NFTS
                                    </h2>
                                    <small className="text-sm text-[#6E6E6E]">
                                        create playlist and earn
                                    </small>
                                </div>
                            </div>
                            <Separator className="my-4 bg-black" />
                        </TabsContent>
                    </Tabs>
                </div>

            </div>
        </>
    )
}