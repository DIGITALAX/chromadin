import { Profile, Publication } from "@/components/Home/types/lens.types";
import { AnyAction, Dispatch } from "redux";
import { MainNFT } from "../../NFT/types/nft.types";
import { Collection } from "@/components/Home/types/home.types";
import { NextRouter } from "next/router";

export type InteractionProps = {
  viewer: string;
};

export type CommentsProps = {
  commentors: Publication[];
  video: Publication;
  getMorePostComments: () => Promise<void>;
  commentsLoading: boolean;
  hasMoreComments: boolean;
  mirrorCommentLoading: boolean[];
  likeCommentLoading: boolean[];
  collectCommentLoading: boolean[];
  likeComment: (id?: string) => Promise<void>;
  collectComment: (id?: string) => Promise<void>;
  mirrorComment: (id?: string) => Promise<void>;
  dispatch: Dispatch<AnyAction>;
  hasMirrored: boolean[];
  hasReacted: boolean[];
  authStatus: boolean;
  lensProfile: Profile | undefined;
  commentId: string;
  router: NextRouter;
};

export type AccountProps = {
  profile: Profile | undefined;
  isCreator: boolean;
};

export type IRLOptionsProps = {
  baseColor: number;
  selectSize: number;
  setBaseColor: (e: number) => void;
  setSelectSize: (e: number) => void;
  posterSize: number;
  stickerPack: number;
  setPosterSize: (e: number) => void;
  setStickerPack: (e: number) => void;
  posterAmount: number;
  setPosterAmount: (e: number) => void;
};

export type FulfillmentProps = {
  baseColor: number;
  selectSize: number;
  setBaseColor: (e: number) => void;
  setSelectSize: (e: number) => void;
  posterSize: number;
  stickerPack: number;
  setPosterSize: (e: number) => void;
  setStickerPack: (e: number) => void;
  currency: string;
  setCurrency: (e: string) => void;
  posterAmount: number;
  setPosterAmount: (e: number) => void;
  totalAmount: number;
  acceptedtokens: string[];
  approved: boolean;
  mainNFT: MainNFT | undefined;
  approveSpend: () => Promise<void>;
  buyNFT: () => void;
  purchaseLoading: boolean;
  collections: Collection[];
  dispatch: Dispatch<AnyAction>;
};

export type CollectorsProps = {
  collectors: any[];
  collectLoading: boolean;
  getMorePostCollects: () => Promise<void>;
  hasMoreCollects: boolean;
  router: NextRouter;
};

export interface FollowArgs {
  follower: string;
  profileIds: [string];
  datas: [any];
  sig: {
    v: any;
    r: any;
    s: any;
    deadline: any;
  };
}

export type PurchaseProps = {
  acceptedtokens: string[];
  approved: boolean;
  currency: string;
  setCurrency: (e: string) => void;
  totalAmount: number;
  mainNFT: MainNFT | undefined;
  approveSpend: () => Promise<void>;
  buyNFT: () => void;
  purchaseLoading: boolean;
};

export interface History {
  tokenIds: string[];
  buyer: string;
  totalPrice: string;
  uri: {
    description: string;
    external_url: string;
    image: string;
    name: string;
  };
  name: string;
  creator: string;
  profile: any;
  transactionHash: string;
  blockTimestamp: string;
  type: string;
  chosenAddress: string;
  price: string;
}

export type useHistoryResults = {
  historyLoading: boolean;
  historySwitch: boolean;
  setHistorySwitch: (e: boolean) => void;
  getMoreUserHistory: () => Promise<void>;
  getMoreBuyerHistory: () => Promise<void>;
  moreHistoryLoading: boolean;
};

export type HistoryProps = {
  historyReducer: History[];
  historyLoading: boolean;
  buyerHistoryReducer: History[];
  historySwitch: boolean;
  setHistorySwitch: (e: boolean) => void;
  moreHistoryLoading: boolean;
  getMoreUserHistory: () => Promise<void>;
  getMoreBuyerHistory: () => Promise<void>;
  hasMoreHistory: boolean;
  hasMoreHistorySpecific: boolean;
};
