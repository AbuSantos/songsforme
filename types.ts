import { ActionType, BidStatus } from "@prisma/client";

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
  isSaleEnabled: boolean;
  recentPlays?: [];
  priceData?: [];
  totalAccumulatedTime?: number | null;
  listeningSession?: ListeningSession[];
  NFTListeningTime?: NFTListeningTime[];
  Bid?: Bid[];
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
  cover?: string;
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
  genre: string;
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
export type Favorites = {
  id: string;
  userId: string;
  nftId: string;
  createdAt: Date;
  updatedAt: Date;
  listednft: ListedNFT;
};

export interface MakeBidParams {
  tokenId: string;
  nftAddress: string;
  nftId: string;
  bidder: string;
  bidAmount: number;
  transactionHash: string;
  userId: string;
}

export interface Bid {
  id: string;
  tokenId: string;
  owner: User;
  nftAddress: string;
  bidder: string;
  listedNFT: ListedNFT;
  bidAmount: number;
  status: BidStatus;
  createdAt: Date;
  sold: boolean;
  transactionHash: string;
  userId?: string;
  nftId: string;
}

export type Activity = {
  id: string; // Unique identifier (UUID)
  userId: string; // Foreign key referencing the User
  user: User; // Relation to the User model
  action: ActionType; // Enum or type representing the action
  entityId: string; // ID of the related entity
  metadata: Metadata; // JSON metadata
  createdAt: Date; // Timestamp when created
  updatedAt: Date; // Timestamp when last updated
};

interface Metadata {
  price?: string;
  timestamp?: Date;
  nftAddress?: string | undefined;
  message?: string;
}
