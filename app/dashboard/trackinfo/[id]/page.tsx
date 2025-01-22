import { Actions } from "@/components/actions/actions";
import { Return } from "@/components/actions/return";
import { TrackChart } from "@/components/dashboard/track-info/track-chart";
import { TrackInfo } from "@/components/dashboard/track-info/track-info";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { ListedNFT } from "@/types";
import { revalidateTag } from "next/cache";
import { headers } from "next/headers";

interface PageProps {
    params: { id: string };
    searchParams: { tokenId?: string };
}

export async function Page({ params, searchParams }: PageProps) {
  
    const { id } = params;
    const tokenId = searchParams?.tokenId;

    if (!id) {
        console.error("Missing ID parameter");
        return null;
    }

    try {
        // Retrieve headers and construct the current URL
        const headersList = headers();
        const protocol = headersList.get("x-forwarded-proto") || "http";
        const host = headersList.get("host");

        const currentUrl = `${protocol}://${host}/dashboard/trackinfo/${id}${tokenId ? `?tokenId=${tokenId}` : ""
            }`;

        //@ts-ignore
        const track: ListedNFT = await db.listedNFT.findFirst({
            where: {
                AND: [
                    { contractAddress: id },
                    { tokenId: tokenId }
                ]
            },
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

        // Revalidate the tag to keep the data fresh
        revalidateTag("track");

        // Render the page with fetched data
        return (
            <>
                <Return />
                <div className="flex items-center justify-center flex-col space-y-2">
                    <TrackChart track={track} />
                    <Separator className="my-4 w-full" />
                    <TrackInfo data={track} />
                    <Actions
                        nftAddress={track.contractAddress}
                        nftId={track.id}
                        tokenId={track.tokenId}
                        price={track.price}
                        listedNftId={track.id}
                        isSaleEnabled={track.isSaleEnabled}
                        seller={track.seller}
                        mode="page"
                        songName={track.Single?.song_name}
                    />
                </div>
            </>
        );
    } catch (error) {
        console.error("Error fetching track data:", error);
        return null;
    }
}

export default Page;
