import { Return } from "@/components/actions/return";
import Image from "next/image";
import { db } from "@/lib/db";
import { truncate } from "@/lib/utils";
import dynamic from "next/dynamic";

const PlaylistInfo = dynamic(() => import("@/components/playlists/playlist-info/playlist-info"), { ssr: false });
const PlaylistPlay = dynamic(() => import("@/components/startlistening/play-listen-playlist"), { ssr: false });
const Tracktable = dynamic(() => import("@/components/musicNFTs/listedNFT/data-table"), { ssr: false });

const page = async ({ params }: { params: { id: string } }) => {
    const id = params.id;
    if (!id) return;

    try {
        const rawTrack = await db.playlist.findUnique({
            where: { id },
            include: {
                listednft: {
                    include: {
                        Single: {
                            select: {
                                song_name: true,
                                song_cover: true,
                                genre: true,
                                contractAddress: true,
                                owner: true,
                            },
                        },
                    },
                },
                owner: true,
            },
        });

        const track = rawTrack ? JSON.parse(JSON.stringify(rawTrack)) : null;

        if (!track) {
            return (
                <div className="text-red-50 px-3">
                    <h1 className="text-2xl capitalize">Track not found</h1>
                </div>
            );
        }

        return (
            <div className="text-red-50 px-1 py-6">
                <Return />
                <header className="md:flex w-full">
                    <div className="flex space-x-6 items-end px-4 w-full md:w-5/12">
                        <Image src={track?.cover || "/images/playlist.jpg"} width={150} height={200} alt="cover" className="rounded-md" />
                        <div className="text-gray-100">
                            <h1 className="text-2xl capitalize">{track?.name}</h1>
                            <div className="text-[#7B7B7B] flex flex-col space-x-2 items-start">
                                <small>{track?.owner?.username}</small>
                                <div className="flex items-center space-x-1">
                                    <small className="truncate">{truncate(track?.owner?.userId)}</small>
                                    <PlaylistPlay tracks={track?.listednft} playlistId={track?.id} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="md:w-7/12 w-full">
                        <PlaylistInfo data={track} />
                    </div>
                </header>
                <div className="mt-4">
                    {track?.listednft && <Tracktable data={track?.listednft} />}
                </div>
            </div>
        );
    } catch (error) {
        console.log(error);
    }
};

export default page;
