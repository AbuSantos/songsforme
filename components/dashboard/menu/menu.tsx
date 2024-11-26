"use client"
import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarLabel,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from "@/components/ui/menubar"
import { PlusCircledIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { AddMusicModal } from "../../modal/add-music"
import { useState } from "react"
import { ConnecttButton } from "@/web3/connect-button"
import { AddToWhitelist } from "../../modal/add-to-whitelist"
import { ListNFTForm } from "../../modal/list-nft"
import { WithdrawRewards } from "@/components/withdraw/withdrawal"


export function Menu() {
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
        <div className="md:fixed justify-between items-center p-3 hidden md:flex w-full bg-black">
            <Menubar className="rounded-none border-b border-none p-4 lg:px-4 bg-[var(--bg-root)] text-[var(--text)]">
                <MenubarMenu>
                    <MenubarTrigger className="font-bold text-xl">Music</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem>About Songs for me</MenubarItem>
                        <MenubarSeparator />
                        <MenubarShortcut />
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
            <div className="ml-auto flex mr-4 justify-end space-x-2">

                {/* <Button onClick={handleModal} size="nav">
                    <PlusCircledIcon className="mr-2 h-4 w-4" />
                    Mint Music
                </Button> */}
                <Button onClick={handleListModal} size="nav" className="lg:hidden">
                    <PlusCircledIcon className="mr-2 h-4 w-4" />
                    List MusicNFT
                </Button>
                <AddToWhitelist />

                <ConnecttButton />

            </div>
            <div className="flex items-center justify-center">
                <WithdrawRewards />
            </div>
            {
                isOpen &&
                <AddMusicModal setIsOpen={setIsOpen} />
            }
            {
                listModalOpen &&
                <ListNFTForm setListModalOpen={setListModalOpen} />
            }
        </div>
    )
}