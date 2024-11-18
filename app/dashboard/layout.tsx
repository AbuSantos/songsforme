import { Poppins } from "next/font/google";
import { Menu } from "@/components/dashboard/menu/menu";
import BottomNav from "@/components/dashboard/bottom-nav";
import { Sidebar } from "@/components/dashboard/sidebar";
import { playlists } from "@/data/playlists";
import { Aside } from "@/components/dashboard/my-playlist";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getSession } from "@/lib/helper";
import { MobileNav } from "@/components/mobile/mobilenav/mobile-nav";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"


const poppins = Poppins({ weight: "500", subsets: ["latin"] });

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {

    return (
        <div className={`h-screen w-full bg-[var(--bg-root)] ${poppins.className}`}>
            <div className=" md:block h-screen max-h-screen top-0 left-0 right-0 z-50">
                <Menu />
                <div className="border-t border-gray-700 py-2 flex flex-col  md:pt-[80px] h-screen">
                    <div className=" flex-1 h-full bg-[#111111] ">
                        <div className="grid lg:grid-cols-7  h-full">
                            {/* <div className="hidden lg:block  bg-[#111111] text-[var(--text)] rounded-lg">
                                <ScrollArea>
                                    <Sidebar playlists={playlists} />
                                </ScrollArea>
                            </div> */}
                            <div className="col-span-3 lg:col-span-5 lg:border-l text-[var(--text)] h-full overflow-y-auto">
                                <ScrollArea>
                                    {children}
                                </ScrollArea>
                            </div>
                            <div className="hidden  lg:block lg:col-span-2 text-[var(--text)] overflow-y-auto rounded-lg border-l-8 border-black h-[100%]">
                                <ScrollArea>
                                    <Aside />
                                </ScrollArea>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <BottomNav /> */}
            </div>

        </div>
    );
};

export default DashboardLayout;
