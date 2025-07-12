import dynamic from "next/dynamic";
import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";

const ArtisteHub = dynamic(() => import("@/components/artiste-hub/artiste-hub").then(mod => mod.ArtisteHub), {
    ssr: false,
});

const page = async ({ params }: { params: { id: string } }) => {
    const artisteId = params.id;
    if (!artisteId) return;

    try {
        const user = await db.user.findUnique({ where: { userId: artisteId } });
        const followerCount = await db.follow.count({ where: { followedId: artisteId } });

        revalidateTag(`followed_${artisteId}`);

        return (
            <div className="px-1">
                {/* @ts-ignore?? */}
                <ArtisteHub artisteId={artisteId} userData={user} count={followerCount} />
            </div>
        );
    } catch (error: any) {
        const isError = error.message.includes("database server")
            ? <p className="text-center text-red-600">Network Error, please check your internet connection</p>
            : <p>Please refresh</p>;

        return <div className="p-6">{isError}</div>;
    }
};

export default page;
