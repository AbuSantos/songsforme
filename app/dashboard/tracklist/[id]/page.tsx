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

    const track = await db.listedNFT.findUnique({
        where: {
            id
        }
    })

    return (
        <div className='text-red-50 px-3'>
            <header className=" flex space-x-2 items-end px-4">
                <Image src={track?.cover} width={150} height={200} alt="cover" className="rounded-md" />
                <div className="text-gray-100">
                    <h1 className="text-2xl capitalize">{track?.title}</h1>
                    <p>{track?.artist}</p>
                </div>
            </header>
            <div className="mt-4">
                < Tracktable data={track} />
            </div>
        </div>

    )
}

export default page