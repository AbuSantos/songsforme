import { Actions } from "@/components/actions/actions"
import { Return } from "@/components/actions/return"
import { TrackChart } from "@/components/dashboard/track-info/track-chart"
import { TrackInfo } from "@/components/dashboard/track-info/track-info"
import { Separator } from "@/components/ui/separator"
import { db } from "@/lib/db"
import { getSession } from "@/lib/helper"
import { ListedNFT } from "@/types"
import { revalidateTag } from "next/cache"

const page = async ({ params }: { params: { id: string } }) => {
    const id = params.id

    if (!id) return

    try {
        //@ts-ignore
        const track: ListedNFT = await db.listedNFT.findUnique({
            where: { id },
            include: {
                playlist: {
                    select: {
                        id: true
                    }
                },
                Single: {
                    select: {
                        song_name: true
                    }
                }

            }

        })
        console.log(track)

        revalidateTag("track")
        if (!track) return

        return (
            <>
                <Return />
                <div className="flex items-center justify-center flex-col space-y-2">
                    <TrackChart track={track} />
                    <Separator className="my-4 w-full  " />
                    <TrackInfo data={track} />
                    < Actions
                        nftAddress={track?.contractAddress}
                        nftId={track?.id}
                        tokenId={track?.tokenId}
                        price={track?.price}
                        listedNftId={track?.id}
                        isSaleEnabled={track?.isSaleEnabled}
                        seller={track?.seller}
                        mode="page"
                        songName={track?.Single?.song_name}
                    />
                </div>
            </>

        )
    } catch (error) {
        console.log(error);
    }

}

export default page
