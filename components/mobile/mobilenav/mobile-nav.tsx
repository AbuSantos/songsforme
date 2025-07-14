"use client"
import { AddMusicModal } from "@/components/modal/add-music"
import { AddToWhitelist } from "@/components/modal/add-to-whitelist"
import { ListNFTForm } from "@/components/modal/list-nft"
import { Button } from "@/components/ui/button"
import { WithdrawRewards } from "@/components/withdraw/withdrawal"
import { PlusCircledIcon } from "@radix-ui/react-icons"
import { useEffect, useState } from "react"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { MobilePlaylist } from "../m-playlist/mobile-playlist"
import { useRecoilValue } from "recoil"
import { isConnected } from "@/atoms/session-atom"
import { DesktopNFTForm } from "@/components/musicNFTs/listedNFT/list-NFTD"
import Link from "next/link"
import dynamic from "next/dynamic"

const ConnecttButton = dynamic(
    () => import("@/web3/connect-button").then(mod => mod.ConnecttButton),
    { ssr: false }
);


export const MobileNav = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [listModalOpen, setListModalOpen] = useState<boolean>(false)
    const userId = useRecoilValue(isConnected)?.userId;

    const handleListModal = () => {
        setListModalOpen(!listModalOpen)
    }

    return (
        <Sheet >
            <SheetTrigger asChild>
                <button className=" rounded-full size-16 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" style={{ fill: "#000", transform: "msFilter", marginLeft: "2px" }}>
                        <path d="M4 6h16v2H4zm4 5h12v2H8zm5 5h7v2h-7z"></path>
                    </svg>
                </button>
            </SheetTrigger>
            <SheetContent className="w-full ">
                <div className="flex flex-col h-full w-full">
                    <div className="mt-6 w-full flex justify-between items-center ">
                        <Link href="/dashboard/earning" className="text-2xl font-semibold">My Earnings</Link>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ fill: "rgba(0, 0, 0, 1)", transform: "msFilter" }}><path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path></svg>
                    </div>

                    {/* CHANGE THE BUTTON WIDTH */}
                    <div className="overflow-y-auto scroll-smooth">
                        <MobilePlaylist userId={userId} />
                    </div>

                    <div className="mt-auto w-full absolute bottom-0  p-3">
                        <ConnecttButton />
                        {/* < ConnectMenu /> */}
                    </div>

                    {isOpen && <AddMusicModal setIsOpen={setIsOpen} />}
                    {listModalOpen && <DesktopNFTForm />}
                </div>
            </SheetContent>
        </Sheet>
    )
}
