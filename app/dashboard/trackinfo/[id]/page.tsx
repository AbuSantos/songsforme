import { Actions } from "@/components/actions/actions"
import { TrackChart } from "@/components/dashboard/track-info/track-chart"
import { TrackInfo } from "@/components/dashboard/track-info/track-info"
import { db } from "@/lib/db"
import { getSession } from "@/lib/helper"
import { ListedNFT } from "@/types"
import { revalidateTag } from "next/cache"

const page = async ({ params }: { params: { id: string } }) => {
    const id = params.id
    const userId = await getSession()

    if (!id || !userId) return
    const track: ListedNFT = await db.listedNFT.findUnique({
        where: { id },
        include: {
            playlist: {
                select: {
                    id: true
                }
            }
        }
    })
    revalidateTag("track")
    if (!track) return

    console.log(track, "track")
    return (
        <div>
            <TrackChart track={track} />
            <TrackInfo data={track} />
            < Actions
                nftAddress={track?.contractAddress}
                nftId={track?.id}
                userId={userId}
                tokenId={track?.tokenId}
                price={track?.price}
                listedNftId={track?.id}
            />
        </div>
    )
}

export default page
