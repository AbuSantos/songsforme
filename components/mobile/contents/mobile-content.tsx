import { AlbumArtwork } from "@/components/dashboard/album-artwork"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { db } from "@/lib/db"
import { Single } from "@/types"
import { revalidateTag } from "next/cache"

export const Discovery = async () => {

    const singleNft = await db.single.findMany({
        include: {
            listedNft: true
        }
    })
    revalidateTag("nft");
    return (
        <div className="w-full">

            <div className="relative">
                <ScrollArea>
                    <div className="flex flex-wrap space-x-4 pb-4 w-full">
                        {singleNft?.map((data, index: number) => (
                            <AlbumArtwork
                                key={data.id}
                                //@ts-ignore
                                album={data}
                                className="w-[150px] md:w-[200px]"
                            />
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </div>
    )
}

