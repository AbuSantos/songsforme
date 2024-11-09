import { Tracktable } from "@/components/musicNFTs/listedNFT/data-table"
import { PlaylistInfo } from "@/components/playlists/playlist-info/playlist-info";
import { db } from "@/lib/db"
import { truncate } from "@/lib/utils";
import { ListedNFT, Playlist, Single } from "@/types";
import { shortenIfAddress } from "@thirdweb-dev/react";
import { revalidateTag } from "next/cache";
import Image from "next/image"

type dataProps = {
    id: string;
    tokenId: string;
    seller: string;
    price: string;
    contractAddress: string;
    sold: boolean;
}
const page = async ({ params }: { params: { id: string } }) => {
    const id = params.id
    if (!id) return

    try {
        revalidateTag("playlist")
        //@ts-ignore
        const track: Playlist | null = await db.playlist.findUnique({
            where: {
                id
            },
            include: {
                listednft: true,
                owner: true

            }
        })
        console.log(track)

        if (!track) {
            return (
                <div className="text-red-50 px-3">
                    <h1 className="text-2xl capitalize">Track not found</h1>
                </div>
            );
        }


        return (
            <div className='text-red-50 px-3'>
                <header className="md:flex w-full">
                    <div className=" flex space-x-2 items-end px-4 w-full md:w-5/12 ">
                        <Image src={track?.cover || "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=300&dpr=2&q=80"} width={150} height={200} alt="cover" className="rounded-md" />
                        <div className="text-gray-100">
                            <h1 className="text-2xl capitalize">{track?.name}</h1>

                            <p className="text-[#7B7B7B] flex space-x-2 items-center">
                                <small className="">
                                    {track?.owner?.username}
                                </small>

                                <small className="truncate">
                                    {
                                        truncate(track?.owner?.userId)
                                    }
                                </small>
                            </p>
                        </div>
                    </div>
                    <div className="md:w-7/12 w-full">
                        < PlaylistInfo data={track} />
                    </div>
                </header>
                <div className="mt-4 ">
                    {
                        track?.listednft &&
                        < Tracktable data={track?.listednft} />
                    }
                </div>
            </div>

        )
    } catch (error) {
        console.log(error)

    }

}

export default page