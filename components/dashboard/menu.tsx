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
import { AddMusicModal } from "../modal/add-music"
import { useState } from "react"
import { ConnecttButton } from "@/web3/connect-button"
import { AddToWhitelist } from "../modal/add-to-whitelist"
import { ListNFTForm } from "../modal/list-nft"
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
import { DesktopNFTForm } from "../modal/list-NFTD"
import { CreatePlaylist } from "../playlists/create-playlist"
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
        <div className="flex justify-between p-3">
            <Menubar className="rounded-none border-b border-none p-4 lg:px-4 bg-[var(--bg-root)] text-[var(--text)]">
                <MenubarMenu>
                    <MenubarTrigger className="font-bold">Music</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem>About Songs for me</MenubarItem>
                        <MenubarSeparator />
                        <MenubarShortcut />
                        <MenubarItem>
                            Quit Music <MenubarShortcut>⌘Q</MenubarShortcut>
                        </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger className="relative">File</MenubarTrigger>
                    <MenubarContent>
                        <MenubarSub>
                            <MenubarSubTrigger>New</MenubarSubTrigger>
                            <MenubarSubContent className="w-[230px]">
                                <MenubarItem>
                                    Playlist <MenubarShortcut>⌘N</MenubarShortcut>
                                </MenubarItem>
                                <MenubarItem disabled>
                                    Playlist from Selection <MenubarShortcut>⇧⌘N</MenubarShortcut>
                                </MenubarItem>
                                <MenubarItem>
                                    Smart Playlist... <MenubarShortcut>⌥⌘N</MenubarShortcut>
                                </MenubarItem>
                                <MenubarItem>Playlist Folder</MenubarItem>
                                <MenubarItem disabled>Genius Playlist</MenubarItem>
                            </MenubarSubContent>
                        </MenubarSub>
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>View</MenubarTrigger>
                    <MenubarContent>
                        <MenubarCheckboxItem>Show Playing Next</MenubarCheckboxItem>
                        <MenubarCheckboxItem checked>Show Lyrics</MenubarCheckboxItem>
                        <MenubarSeparator />
                        <MenubarItem inset disabled>
                            Show Status Bar
                        </MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem inset>Hide Sidebar</MenubarItem>
                        <MenubarItem disabled inset>
                            Enter Full Screen
                        </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
            <div className="ml-auto flex mr-4 justify-end space-x-2">
                < CreatePlaylist />
                <Button onClick={handleModal} size="nav">
                    <PlusCircledIcon className="mr-2 h-4 w-4" />
                    Mint Music
                </Button>
                <Button onClick={handleListModal} size="nav" className="lg:hidden">
                    <PlusCircledIcon className="mr-2 h-4 w-4" />
                    List MusicNFT
                </Button>
                <AddToWhitelist />
                <Sheet >
                    <SheetTrigger asChild>
                        <Button variant="outline" size="nav">Open</Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>List Music</SheetTitle>
                        </SheetHeader>
                        <DesktopNFTForm />
                    </SheetContent>
                </Sheet>
                <ConnecttButton />

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