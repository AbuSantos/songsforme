import { TrackInfo } from "@/components/dashboard/track-info/track-info"
import { db } from "@/lib/db"
import { ListedNFT } from "@/types"
import { revalidateTag } from "next/cache"

const page = async ({ params }: { params: { id: string } }) => {
    const id = params.id
    if (!id) return
    const track:ListedNFT = await db.listedNFT.findUnique({
        where: { id },
    })
    revalidateTag("track")
    if (!track) return
    console.log(track)
    return (
        <div>
            <TrackInfo data={track} />
        </div>
    )
}

export default page
