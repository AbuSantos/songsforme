"use client"
import { useRecoilValue } from "recoil"
import { BuyNFT } from "../buy-folder/buy-nft"
import { MakeBid } from "../bids/make-bid"
import { SelectPlaylist } from "../playlists/selectplaylist"
import { isConnected } from "@/atoms/session-atom"
import { TogglingSell } from "../musicNFTs/listedNFT/toggle-buy-sell"
import { ShareToTwitter } from "../sharing/twitter"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import { ShareToTelegram } from "../sharing/telegram"

type ActionsProps = {
  nftAddress: string
  tokenId: string
  price: number
  nftId: string
  userId?: string
  listedNftId: string
  isSaleEnabled: boolean
  seller: string
  mode?: string
  songName?: string | null | undefined
}
export const Actions = ({ songName, mode, seller, nftAddress, tokenId, price, nftId, listedNftId, isSaleEnabled }: ActionsProps) => {
  const userId = useRecoilValue(isConnected)?.userId;
  const username = useRecoilValue(isConnected)?.username;
  const songUrl = typeof window !== "undefined" ? window.location.href : ""
  if (!userId) {
    return
  }

  return (
    <div className="justify-center items-center space-x-2 flex md:flex w-4/12 p-3">
      <div>
        {userId && (seller === userId) ? ("")
          :
          <div className="flex items-center justify-center space-x-2">
            <BuyNFT buyer={userId} nftAddress={nftAddress} tokenId={tokenId} price={price} listedNftId={listedNftId} usrname={username} />
            <MakeBid nftAddress={nftAddress} tokenId={tokenId} nftId={nftId} userId={userId} />
          </div>
        }
      </div>
      <SelectPlaylist userId={userId} nftId={nftId} mode={mode} />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="p-0 border-none
          bg-[var(--button-bg)] justify-center text-center items-center shadow-md py-2 px-4 rounded-md "  size="nav">

            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ fill: "#fff", transform: "msFilter" }}><path d="M11 7.05V4a1 1 0 0 0-1-1 1 1 0 0 0-.7.29l-7 7a1 1 0 0 0 0 1.42l7 7A1 1 0 0 0 11 18v-3.1h.85a10.89 10.89 0 0 1 8.36 3.72 1 1 0 0 0 1.11.35A1 1 0 0 0 22 18c0-9.12-8.08-10.68-11-10.95zm.85 5.83a14.74 14.74 0 0 0-2 .13A1 1 0 0 0 9 14v1.59L4.42 11 9 6.41V8a1 1 0 0 0 1 1c.91 0 8.11.2 9.67 6.43a13.07 13.07 0 0 0-7.82-2.55z"></path></svg>

          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] space-y-2">
          <h1 className="text-gray-100 text-center p-3">Share on Social Media</h1>

          <ShareToTwitter songName={songName} songUrl={songUrl} />
          < ShareToTelegram songName={songName} songUrl={songUrl} />
        </PopoverContent>
      </Popover>
    </div>
  )
}


