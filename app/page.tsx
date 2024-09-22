
import { Metadata } from "next"
import Image from "next/image"
import { PlusCircledIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"


// import { PodcastEmptyPlaceholder } from "./components/podcast-empty-placeholder"
import { Menu } from "@/components/dashboard/menu"
import { Sidebar } from "@/components/dashboard/sidebar"
import { playlists } from "@/data/playlists"
import { listenNowAlbums, madeForYouAlbums } from "@/data/albums"
import { AlbumArtwork } from "@/components/dashboard/album-artwork"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import BottomNav from "@/components/dashboard/bottom-nav"


export const metadata: Metadata = {
  title: "songs for me",
  description: "Earn songs as your listen to music.",
}
interface AlbumArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
  album: {
    cover: string;
    name: string;
    title: string;
    url: string;
    artiste: string;
  };
  index: number;
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
}

export default async function MusicPage() {
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:4000/songs", { cache: "no-cache" });
      const data = await response.json();
      return data
    }
    catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  const NewSongs = await fetchData()

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/music-light.png"
          width={1280}
          height={1114}
          alt="Music"
          className="block dark:hidden"
        />
        <Image
          src="/examples/music-dark.png"
          width={1280}
          height={1114}
          alt="Music"
          className="hidden dark:block"
        />
      </div>

      <div className="hidden md:block bg-[var(--bg-root)]">
        <Menu />
        <div className="border-t border-gray-700 py-2">
          <div className="bg-[var(--bg-root)]">
            <div className="grid lg:grid-cols-5">
              <Sidebar playlists={playlists} className="hidden lg:block bg-[var(--bg-root)] text-[var(--text)]" />
              <div className="col-span-3 lg:col-span-4 lg:border-l bg-[var(--bg-root)] text-[var(--text)]">
                <div className="h-full px-4 py-6 lg:px-8">
                  <Tabs defaultValue="music" className="h-full space-y-6">
                    <div className="space-between flex items-center">
                      <TabsList>
                        <TabsTrigger value="music" className="relative">
                          Music
                        </TabsTrigger>
                        <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
                      </TabsList>

                    </div>
                    <TabsContent
                      value="music"
                      className="border-none p-0 outline-none"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold tracking-tight">
                            Listen Now
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Top picks for you. Updated daily.
                          </p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="relative">
                        <ScrollArea>
                          <div className="flex flex-wrap space-x-4 pb-4">
                            {NewSongs?.map((data: AlbumArtworkProps, index: number) => (
                              <AlbumArtwork
                                key={data.id}
                                album={data}
                                index={index}
                                className="w-[250px]"
                                aspectRatio="portrait"
                                width={250}
                                height={330}
                              />
                            ))}
                          </div>
                          <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                      </div>
                      <div className="mt-6 space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight">
                          Made for You
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Your personal playlists. Updated daily.
                        </p>
                      </div>
                      <Separator className="my-4" />
                    </TabsContent>
                    <TabsContent
                      value="podcasts"
                      className="h-full flex-col border-none p-0 data-[state=active]:flex"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold tracking-tight">
                            New Episodes
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Your favorite podcasts. Updated daily.
                          </p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      {/* <PodcastEmptyPlaceholder /> */}
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    </>
  )
}