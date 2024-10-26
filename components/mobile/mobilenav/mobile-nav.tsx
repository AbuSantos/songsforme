import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Discovery } from "../contents/mobile-content"
import { MobileMarket } from "../contents/mobile-market"

export const MobileNav = () => {
    return (
        <div className="p-2">
            <Tabs defaultValue="music" className="space-y-6 border-0 w-full">
                <TabsList className="fixed bottom-4 w-full mx-auto flex justify-between p-2 bg-gray-100 rounded-lg shadow-md">
                    <TabsTrigger value="discovery" className="text-xs  " aria-label="Discovery">
                        Discovery
                    </TabsTrigger>
                    <TabsTrigger value="market" className="text-xs  " aria-label="Market Place">
                        Market Place
                    </TabsTrigger>
                    <TabsTrigger value="trending" className="text-xs  " aria-label="Trending">
                        Trending
                    </TabsTrigger>
                    <TabsTrigger value="mynft" className="text-xs  " aria-label="My NFT">
                        My NFT
                    </TabsTrigger>
                </TabsList>

                <TabsContent
                    value="discovery"
                    className="border-none p-0 outline-none"
                >
                    < Discovery />
                </TabsContent>

                <TabsContent
                    value="market"
                    className="border-none p-0 outline-none"
                >
                    <MobileMarket />
                </TabsContent>
                {/* Content for each tab can be added here */}
            </Tabs>
        </div>
    )
}
