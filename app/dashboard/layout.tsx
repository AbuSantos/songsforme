import { Poppins } from "next/font/google";
import { Menu } from "@/components/dashboard/menu";
import BottomNav from "@/components/dashboard/bottom-nav";
import { Sidebar } from "@/components/dashboard/sidebar";
import { playlists } from "@/data/playlists";
import { Aside } from "@/components/dashboard/my-playlist";
import { ScrollArea } from "@/components/ui/scroll-area";

const poppins = Poppins({ weight: "500", subsets: ["latin"] });

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    return (
        <div className={`h-screen hidden md:block bg-[var(--bg-root)] ${poppins.className}`}>
            <Menu />
            <div className="border-t border-gray-700 py-2 h-full flex flex-col">
                <div className="bg-[var(--bg-root)] flex-1">
                    <div className="grid lg:grid-cols-7 h-full">
                        {/* Sidebar Scrollable Area */}
                        <div className="hidden lg:block  bg-[#111111] text-[var(--text)] rounded-lg">
                            <ScrollArea>
                                <Sidebar playlists={playlists} />
                            </ScrollArea>
                        </div>

                        {/* Main Content Scrollable Area */}
                        <div className="col-span-3 lg:col-span-4 lg:border-l bg-[#111111] text-[var(--text)]">
                            <ScrollArea>
                                {children}
                            </ScrollArea>
                        </div>


                        <div className="hidden lg:block lg:col-span-2 text-[var(--text)] bg-[#111111] rounded-lg border-l-8 border-black">
                            <ScrollArea>
                                <Aside playlists={playlists} />
                            </ScrollArea>
                        </div>
                    </div>
                </div>
            </div>
            <BottomNav />
        </div>
    );
};

export default DashboardLayout;
