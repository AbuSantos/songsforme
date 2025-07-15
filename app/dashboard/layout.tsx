"use client";
import { Poppins } from "next/font/google";
import { Menu } from "@/components/dashboard/menu/menu";
import BottomNav from "@/components/dashboard/bottom-nav";
import { Aside } from "@/components/aside/my-playlist";
import { ClientOnly } from "@/lib/client-wrap";
import AudioWrapper from "@/lib/audio-wrapper";
import "@/style/styles.css";



const poppins = Poppins({ weight: "500", subsets: ["latin"] });


const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <ClientOnly>
            <div className={`h-screen w-full bg-[var(--bg-root)] ${poppins.className}`}>
                {/* <AudioWrapper /> */}
                <div className="md:block h-screen max-h-screen top-0 left-0 right-0">
                    <Menu />
                    <div className="border-t border-gray-700 flex flex-col md:pt-[65px] h-screen">
                        <div className="flex-1 h-full bg-[#111111]">
                            <div className="grid lg:grid-cols-7 h-full">
                                <div className="col-span-3 lg:col-span-5 lg:border-l text-[var(--text)] h-full overflow-y-auto">
                                    {children}
                                </div>
                                <div className="hidden lg:!block lg:col-span-2 text-[var(--text)] overflow-y-auto scrollbar-none rounded-lg border-l-8 border-black h-[100%] mt-2"
                                >
                                    <Aside />
                                </div>
                            </div>
                        </div>
                    </div>
                    <BottomNav />
                </div>
            </div>
        </ClientOnly >
    );
};

export default DashboardLayout;
