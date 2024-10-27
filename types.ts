export enum PurchaseStatus {
  PENDING = "PENDING",
  COMPLETE = "COMPLETE",
  FAILED = "FAILED",
  NONE = "NONE",
}

export interface User {
  id: string;
  username?: string | null;
  userId: string;
  listenTimeThreshold: number;
  accumulatedTime: number;
  lastListeningTime?: Date | null;
  listeningSessionStartTime?: Date | null;
  currentNftId?: string | null;
  playlistId?: string | null;
  nftListeningTimes: NFTListeningTime[];
  playlist: Playlist[];
}

export interface NFTListeningTime {
  id: string;
  nftId: string;
  userId: string;
  accumulatedTime: number;
  nft: ListedNFT;
  user: User;
}

export interface ListedNFT {
  id: string;
  tokenId: string;
  seller: string;
  price: number;
  contractAddress: string;
  uri?: string | null;
  listedAt: Date;
  sold: boolean;
  userId?: string | null;
  playlist: Playlist[];
  PlaylistListedNFT?: PlaylistListedNFT[];
  Single?: Single | null;
  singleId?: string | null;
  purchases: BuyNFT[];
  accumulatedTime?: number | null;
  rewardRatio: number;
  playlistRewardRatio: number;
  recentPlays?: [];
  totalAccumulatedTime?: number | null;
  listeningSession?: ListeningSession[];
  NFTListeningTime?: NFTListeningTime[];
}

export interface ListeningSession {
  id: string;
  userId?: string | null;
  nft?: ListedNFT | null;
  nftId?: string | null;
  startTime: Date;
  endTime?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Playlist {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  listednft: ListedNFT[];
  owner: User;
  accumulatedTime?: number | null;
  PlaylistListedNFT: PlaylistListedNFT[];
  rewardRatio?: number | null;
}

export interface BuyNFT {
  id: string;
  buyer: string;
  listedNftId: string;
  listedNft: ListedNFT;
  price: number;
  purchaseDate: Date;
  transactionHash?: string | null;
  status?: PurchaseStatus | null;
  relisted: boolean;
}

export interface Single {
  id: string;
  song_name?: string | null;
  artist_name?: string | null;
  song_cover?: string | null;
  album_name?: string | null;
  uri?: string | null;
  owner: string;
  contractAddress?: string | null;
  tokenId?: string | null;
  listednftId?: string | null;
  listedNft: ListedNFT[];
}

export interface PlaylistListedNFT {
  playlistId: string;
  listedNFTId: string;
  playlist: Playlist;
  listedNFT: ListedNFT;
}

export interface LastPlayEntry {
  timestamp: Date;
  count: number;
}
