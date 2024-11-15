"use client"
import { useRecoilValue } from "recoil"
import { BuyNFT } from "../buy-folder/buy-nft"
import { MakeBid } from "../modal/make-bid"
import { SelectPlaylist } from "../playlists/selectplaylist"
import { isConnected } from "@/atoms/session-atom"

type ActionsProps = {
  nftAddress: string
  tokenId: string
  price: number
  nftId: string
  userId?: string
  listedNftId: string
}
export const Actions = ({ nftAddress, tokenId, price, nftId, listedNftId }: ActionsProps) => {
  const userId = useRecoilValue(isConnected);


  return (
    <div className=" justify-center items-center space-x-2 flex md:flex w-4/12">
      < MakeBid nftAddress={nftAddress} tokenId={tokenId} />
      <BuyNFT buyer={userId} nftAddress={nftAddress} tokenId={tokenId} price={price} listedNftId={listedNftId} />
      <SelectPlaylist userId={userId} nftId={nftId} />
    </div>
  )
}


