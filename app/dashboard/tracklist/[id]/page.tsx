import { Tracktable } from "@/components/musicNFTs/listedNFT/data-table"
import { db } from "@/lib/db"
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
    const track = await db.single.findUnique({
        where: {
            id
        },
        include: {
            listedNft: {
                where: {
                    sold: false
                }
            }
        }
    })
    // Handle case where track is not found
    if (!track) {
        return (
            <div className="text-red-50 px-3">
                <h1 className="text-2xl capitalize">Track not found</h1>
            </div>
        );
    }
    return (
        <div className='text-red-50 px-3'>
            <header className=" flex space-x-2 items-end px-4">
                <Image src={track?.cover || "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=300&dpr=2&q=80"} width={150} height={200} alt="cover" className="rounded-md" />
                <div className="text-gray-100">
                    <h1 className="text-2xl capitalize">{track?.song_name}</h1>
                    <p className="text-[#7B7B7B]">{track?.artist_name}</p>
                </div>
            </header>
            <div className="mt-4">
                < Tracktable data={track?.listedNft} />
            </div>
        </div>

    )
}

export default page