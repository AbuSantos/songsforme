import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

type ToggleBuySellTypes = {
    toggleBuySell: () => void,
    isEnabled: boolean
}

export const TogglingSell = ({ toggleBuySell, isEnabled }: ToggleBuySellTypes) => {
    return (
        <div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        {/* Location toggle switch for teachers */}
                        <div className="flex items-center space-x-1 flex-col">
                            <Switch id="location-toggle" onClick={toggleBuySell} checked={isEnabled} />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Mark NFT for sale</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}
