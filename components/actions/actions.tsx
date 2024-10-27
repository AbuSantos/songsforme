"use client"
import { BuyNFT } from "../buy-folder/buy-nft"
import { MakeBid } from "../modal/make-bid"
import { SelectPlaylist } from "../playlists/selectplaylist"

type ActionsProps = {
  nftAddress: string
  tokenId: string
  price: number
  nftId: string
  userId: string
  listedNftId: string
}
export const Actions = ({ nftAddress, tokenId, price, nftId, userId, listedNftId }: ActionsProps) => {
  return (
    <div className=" items-center space-x-2 hidden md:flex w-4/12">
      < MakeBid nftAddress={nftAddress} tokenId={tokenId} />
      <BuyNFT nftAddress={nftAddress} tokenId={tokenId} price={price} listedNftId={listedNftId} />
      <SelectPlaylist nftId={nftId} userId={userId} />
    </div>
  )
}


