import { ArtisteHub } from "@/components/artiste-hub/artiste-hub"
import { db } from "@/lib/db"
import { User } from "@/types"
import { revalidateTag } from "next/cache"

const page = async ({ params }: { params: { id: string } }) => {
    const artisteId = params.id
    if (!artisteId) return
    try {
        const user = await db.user.findUnique({ where: { userId: artisteId } })

        const followerCount = await db.follow.count({
            where: {
                followedId: artisteId
            }
        })

        revalidateTag(`followed_${artisteId}`);

        return (
            <div className="px-1 py-6">
                {/* @ts-ignore */}
                <ArtisteHub artisteId={artisteId} userData={user} count={followerCount} />
            </div>
        )
    } catch (error) {
        console.log(error)
    }


}

export default page
