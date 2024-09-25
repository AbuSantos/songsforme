
import { Poppins } from "next/font/google";
import { Menu } from "@/components/dashboard/menu"
import BottomNav from "@/components/dashboard/bottom-nav";
import { Sidebar } from "@/components/dashboard/sidebar";
import { playlists } from "@/data/playlists"
import { Aside } from "@/components/dashboard/my-playlist";

const poppins = Poppins({ weight: "500", subsets: ["latin"] });

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {

    return (
        <div className={` h-screen hidden md:block bg-[var(--bg-root)] ${poppins.className}`}>
            <Menu />
            <div className="border-t border-gray-700 py-2">
                <div className="bg-[var(--bg-root)]">
                    <div className="grid lg:grid-cols-7">
                        <Sidebar playlists={playlists} className="hidden lg:block bg-[var(--bg-root)] text-[var(--text)]" />
                        <div className="col-span-3 lg:col-span-4 lg:border-l bg-[var(--bg-root)] text-[var(--text)]">
                            {children}
                        </div>

                        <Aside playlists={playlists} className="hidden lg:block lg:col-span-2 bg-[var(--bg-root)] text-[var(--text)] border-l-2 border-gray-300" />
                    </div>
                </div>
            </div>
            <BottomNav />
        </div>
    );
};

export default DashboardLayout;
