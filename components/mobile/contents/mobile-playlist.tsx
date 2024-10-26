import { FilterByName } from '@/components/marketplace/filter/filter-by-name'
import { AllPlaylist } from '@/components/playlists/all-playlist'
import { Separator } from '@/components/ui/separator'

export const MobilePlaylist = async () => {
    return (
        <div className='w-full'>
            <div className="flex items-center justify-between w-full">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        All Playlist
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Top picks for you. Updated daily.
                    </p>
                </div>
                <div>
                    {/* <FilterByName items={listedData} /> */}
                </div>
            </div>
            <Separator className="my-4 w-full" />

            <AllPlaylist />
        </div>
    )
}

