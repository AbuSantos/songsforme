"use client"
import { AddMusicModal } from "@/components/modal/add-music"
import { AddToWhitelist } from "@/components/modal/add-to-whitelist"
import { ListNFTForm } from "@/components/modal/list-nft"
import { Button } from "@/components/ui/button"
import { WithdrawRewards } from "@/components/withdraw/withdrawal"
import { ConnecttButton } from "@/web3/connect-button"
import { PlusCircledIcon } from "@radix-ui/react-icons"
import { useState } from "react"
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
export const MobileNav = ({ userId }: { userId: string }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [listModalOpen, setListModalOpen] = useState<boolean>(false)

    const handleModal = () => {
        setIsOpen(!isOpen)
    }
    const handleWhiteModal = () => {
        setIsModalOpen(!isModalOpen)
    }
    const handleListModal = () => {
        setListModalOpen(!listModalOpen)
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ fill: "rgba(0, 0, 0, 1)", transform: "msFilter", marginLeft: "2px" }}>
                        <path d="M4 6h16v2H4zm4 5h12v2H8zm5 5h7v2h-7z"></path>
                    </svg>
                </Button>
            </SheetTrigger>
            <SheetContent className=" ">

                <div className="flex flex-col justify-between h-full">
                    <div className="flex flex-col mt-8 space-y-4">
                        <Button onClick={handleModal} size="nav" className="p-3">
                            <PlusCircledIcon className="mr-2 h-4 w-4" />
                            Mint Music
                        </Button>
                        <Button onClick={handleListModal} size="nav" className="p-3">
                            <PlusCircledIcon className="mr-2 h-4 w-4" />
                            List MusicNFT
                        </Button>
                        <AddToWhitelist />
                    </div>

                    <div className="mt-4">
                        <WithdrawRewards userId={userId} />
                    </div>

                    <div className="mt-auto w-full">
                        <ConnecttButton />
                    </div>

                    {isOpen && <AddMusicModal setIsOpen={setIsOpen} />}
                    {listModalOpen && <ListNFTForm setListModalOpen={setListModalOpen} />}
                </div>



            </SheetContent>
        </Sheet>
    )
}
