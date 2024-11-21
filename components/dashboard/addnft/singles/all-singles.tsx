"use client"
import { CreateSingle } from "./create-single"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { DesktopNFTForm } from "@/components/musicNFTs/listedNFT/list-NFTD";

export const AllMySingle = ({ data }: { data: any[] }) => {

    
    return (
        <div>
            <header className="flex items-center justify-between">
                <p>
                    My Singles
                </p>
                <CreateSingle />
            </header>
            <ul className="h-auto overflow-y-scroll">
                {data && data?.map((single: any) => (
                    <li key={single.id} className="capitalize p-2 ">
                        <div className="flex justify-between cursor-pointer">
                            <p className="flex flex-col">
                                <span className="text-[#111111] text-sm">
                                    {single.song_name}
                                </span>
                                <small className="text-[#484848]">
                                    {single.artist_name}
                                </small>
                            </p>
                            <Popover>
                                <PopoverTrigger asChild >
                                    <Button variant="outline" className="text-gray-800" size="nav">
                                        <PlusIcon />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full">
                                    <DesktopNFTForm singleId={single.id} />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </li>
                ))}
            </ul>
        </div >
    )
}
