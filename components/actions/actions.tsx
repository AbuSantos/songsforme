"use client"
import { useRecoilValue } from "recoil"
import { BuyNFT } from "../buy-folder/buy-nft"
import { MakeBid } from "../modal/make-bid"
import { SelectPlaylist } from "../playlists/selectplaylist"
import { isConnected } from "@/atoms/session-atom"
import { TogglingSell } from "../musicNFTs/listedNFT/toggle-buy-sell"

type ActionsProps = {
  nftAddress: string
  tokenId: string
  price: number
  nftId: string
  userId?: string
  listedNftId: string
  isSaleEnabled: boolean
  seller: string
}
export const Actions = ({ seller, nftAddress, tokenId, price, nftId, listedNftId, isSaleEnabled }: ActionsProps) => {
  const userId = useRecoilValue(isConnected);


  return (
    <div className="justify-center items-center space-x-2 flex md:flex w-4/12 p-3">
      <div>


        {userId && (seller === userId) ? ("")
          :
          <div className="flex items-center justify-center space-x-2">
            <BuyNFT buyer={userId} nftAddress={nftAddress} tokenId={tokenId} price={price} listedNftId={listedNftId} />
            <MakeBid nftAddress={nftAddress} tokenId={tokenId} />
          </div>
        }
      </div>
      <SelectPlaylist userId={userId} nftId={nftId} />
    </div>
  )
}


