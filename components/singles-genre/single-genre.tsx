import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlbumArtwork } from "../dashboard/album-artwork"
import { Single } from "@/types"

export const SingleGenre = ({ singleNft }: { singleNft: Single[] }) => {

    console.log(singleNft, "from single genre")
    // Filter songs by genre
    const afrobeats = singleNft.filter((track: Single) => track.genre === "afrobeats")
    const hiphop = singleNft.filter((track: Single) => track.genre === "hiphop")
    const pop = singleNft.filter((track: Single) => track.genre === "pop")
    const indie = singleNft.filter((track: Single) => track.genre === "indie")
    const jazz = singleNft.filter((track: Single) => track.genre === "jazz")

    return (
        <div className="w-full md:max-w-full lg:block md:block col-span-3 lg:col-span-4 rounded-lg text-[var(--text)] p-0">
            <div className="h-full w-full ">
                <Tabs defaultValue="all" className="h-full border-0">
                    <TabsList className="space-x-3 bg-[#111111] p-2">
                        <TabsTrigger value="all" className="relative py-2">
                            All
                        </TabsTrigger>
                        <TabsTrigger value="afrobeat" className="relative py-2">
                            Afrobeat
                        </TabsTrigger>
                        <TabsTrigger value="hiphop" className="relative py-2">
                            Hip Hop
                        </TabsTrigger>
                        <TabsTrigger value="pop" className="relative py-2">
                            Pop
                        </TabsTrigger>
                        <TabsTrigger value="indie" className="relative py-2">
                            Indie
                        </TabsTrigger>
                        <TabsTrigger value="jazz" className="relative py-2">
                            Jazz
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="border-none pt-4 outline-none px-2">
                        <div className="relative w-full">
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
                    </TabsContent>

                    <TabsContent value="afrobeat" className="border-none pt-4 outline-none px-2">
                        <div className="relative w-full">
                            <div className="flex flex-wrap space-x-2 pb-4 gap-2">
                                {afrobeats?.map((data: Single, index: number) => (
                                    <AlbumArtwork
                                        key={data.id}
                                        album={data}
                                        className="w-[180px]"
                                    />
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="hiphop" className="border-none pt-4 outline-none px-2">
                        <div className="relative w-full">
                            <div className="flex flex-wrap space-x-2 pb-4 gap-2">
                                {hiphop?.map((data: Single, index: number) => (
                                    <AlbumArtwork
                                        key={data.id}
                                        album={data}
                                        className="w-[180px]"
                                    />
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="pop" className="border-none pt-4 outline-none px-2">
                        <div className="relative w-full">
                            <div className="flex flex-wrap space-x-2 pb-4 gap-2">
                                {pop?.map((data: Single, index: number) => (
                                    <AlbumArtwork
                                        key={data.id}
                                        album={data}
                                        className="w-[180px]"
                                    />
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="indie" className="border-none pt-4 outline-none px-2">
                        <div className="relative w-full">
                            <div className="flex flex-wrap space-x-2 pb-4 gap-2">
                                {indie?.map((data: Single, index: number) => (
                                    <AlbumArtwork
                                        key={data.id}
                                        album={data}
                                        className="w-[180px]"
                                    />
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="jazz" className="border-none pt-4 outline-none px-2">
                        <div className="relative w-full">
                            <div className="flex flex-wrap space-x-2 pb-4 gap-2">
                                {jazz?.map((data: Single, index: number) => (
                                    <AlbumArtwork
                                        key={data.id}
                                        album={data}
                                        className="w-[180px]"
                                    />
                                ))}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
