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
import { ChevronDownIcon } from "@radix-ui/react-icons"

//WHEN WE FETCH REAL DATA

export const TrackOptions = () => {
    return (
        <Menubar className="rounded-none border-b border-none p-4 lg:px-4 bg-[var(--bg-root)] text-[var(--text)]">
            <MenubarMenu>
                <MenubarTrigger className="relative">
                    <ChevronDownIcon />
                </MenubarTrigger>
                <MenubarContent>
                    <MenubarSub>
                        <MenubarSubTrigger>Playlists</MenubarSubTrigger>
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

        </Menubar>

    )
}