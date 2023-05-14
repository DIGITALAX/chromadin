import { Collection } from "@/components/Home/types/home.types";
import {
  Erc20,
  Profile,
  Publication,
} from "@/components/Home/types/lens.types";
import { CommentFeedCountState } from "@/redux/reducers/commentFeedCountSlice";
import { IndividualFeedCountState } from "@/redux/reducers/individualFeedCountReducer";
import { ProfileFeedCountState } from "@/redux/reducers/profileFeedCountSlice";
import { ReactionFeedCountState } from "@/redux/reducers/reactionFeedCountSlice";
import { NextRouter } from "next/router";
import { FormEvent, KeyboardEvent, Ref } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { AnyAction, Dispatch } from "redux";

export enum MediaType {
  Video,
  Image,
  Gif,
}

export interface UploadedMedia {
  cid: string;
  type: MediaType;
}

export interface PostImage {
  item: string;
  type: string;
  altTag: string;
}

export type FeedPublicationProps = {
  router: NextRouter;
  publication: Publication;
  dispatch: Dispatch<AnyAction>;
  hasReacted?: boolean | undefined;
  hasMirrored?: boolean | undefined;
  hasCollected?: boolean | undefined;
  followerOnly: boolean;
  height?: string;
  address: `0x${string}` | undefined;
  collectPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mirrorPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  reactPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  index: number;
  mirrorLoading: boolean;
  reactLoading: boolean;
  collectLoading: boolean;
  reactAmount: number;
  collectAmount: number;
  mirrorAmount: number;
  commentAmount: number;
  feedType: string;
  setCollectLoader?: (e: boolean[]) => void;
  setReactLoader?: (e: boolean[]) => void;
  setMirrorLoader?: (e: boolean[]) => void;
  openComment: string;
  profileType: string;
};

export type ProfileSideBarProps = {
  publication: Publication;
  followerOnly: boolean | undefined;
  dispatch: Dispatch<AnyAction>;
  hasMirrored: boolean | undefined;
  hasReacted: boolean | undefined;
  index: number;
  address: `0x${string}` | undefined;
  collectPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mirrorPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  reactPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mirrorLoading: boolean;
  reactLoading: boolean;
  collectLoading: boolean;
  reactAmount: number;
  collectAmount: number;
  mirrorAmount: number;
  hasCollected: boolean | undefined;
  commentAmount: number;
  setCollectLoader?: (e: boolean[]) => void;
  setReactLoader?: (e: boolean[]) => void;
  setMirrorLoader?: (e: boolean[]) => void;
  openComment: string;
  feedType: string;
  router: NextRouter;
  profileType: string;
};

export type ReactionProps = {
  id?: string;
  textColor: string;
  commentColor: string;
  mirrorColor: string;
  collectColor: string;
  heartColor: string;
  dispatch: Dispatch<AnyAction>;
  hasReacted: boolean;
  hasMirrored: boolean;
  hasCollected: boolean;
  followerOnly: boolean;
  publication: Publication;
  address: `0x${string}` | undefined;
  collectPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mirrorPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  reactPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  index: number;
  mirrorLoading: boolean;
  reactLoading: boolean;
  collectLoading: boolean;
  reactAmount: number;
  collectAmount: number;
  mirrorAmount: number;
  commentAmount: number;
  setCollectLoader?: (e: boolean[]) => void;
  setReactLoader?: (e: boolean[]) => void;
  setMirrorLoader?: (e: boolean[]) => void;
  openComment: string;
  feedType: string;
  profileType: string;
};

export type FeedProps = {
  profile: Profile | undefined;
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  followerOnly: boolean[];
  feedDispatch: Publication[];
  postsLoading: boolean;
  hasMore: boolean;
  fetchMore: () => Promise<void>;
  address: `0x${string}` | undefined;
  collectPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mirrorPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  reactPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mirrorLoading: boolean[];
  reactLoading: boolean[];
  collectLoading: boolean[];
  profileType: string;
  reactionAmounts: ReactionFeedCountState;
  mainPost: Publication;
  followerOnlyMain: boolean;
  mainPostLoading: boolean;
  hasMoreComments: boolean;
  getMorePostComments: () => Promise<void>;
  commentors: Publication[];
  commentsLoading: boolean;
  reactCommentLoading: boolean[];
  mirrorCommentLoading: boolean[];
  collectCommentLoading: boolean[];
  followerOnlyComments: boolean[];
  commentAmounts: CommentFeedCountState;
  collectPostLoading: boolean[];
  mirrorPostLoading: boolean[];
  reactPostLoading: boolean[];
  setMirrorCommentLoading: (e: boolean[]) => void;
  setCollectCommentLoading: (e: boolean[]) => void;
  setReactCommentLoading: (e: boolean[]) => void;
  setCollectPostLoading: (e: boolean[]) => void;
  setMirrorPostLoading: (e: boolean[]) => void;
  setReactPostLoading: (e: boolean[]) => void;
  commentOpen: string;
  commentPost: (id: string) => Promise<void>;
  commentDescription: string;
  handleCommentDescription: (e: FormEvent) => Promise<void>;
  textElement: Ref<HTMLTextAreaElement>;
  caretCoord: {
    x: number;
    y: number;
  };
  mentionProfiles: Profile[];
  profilesOpen: boolean;
  handleMentionClick: (user: any) => void;
  commentLoading: boolean;
  gifOpen: boolean;
  handleKeyDownDelete: (e: KeyboardEvent<Element>) => void;
  handleGifSubmit: () => Promise<void>;
  handleGif: (e: FormEvent) => void;
  results: any[];
  handleSetGif: (result: any) => void;
  setGifOpen: (e: boolean) => void;
  videoLoading: boolean;
  imageLoading: boolean;
  uploadImages: (e: FormEvent) => Promise<void>;
  uploadVideo: (e: FormEvent) => Promise<void>;
  handleRemoveImage: (e: UploadedMedia) => void;
  postImagesDispatched?: UploadedMedia[];
  mappedFeaturedFiles: UploadedMedia[];
  collectOpen: boolean;
  enabledCurrencies: Erc20[];
  audienceTypes: string[];
  setAudienceType: (e: string) => void;
  audienceType: string;
  setEnabledCurrency: (e: string) => void;
  enabledCurrency: string | undefined;
  setChargeCollectDropDown: (e: boolean) => void;
  setAudienceDropDown: (e: boolean) => void;
  setCurrencyDropDown: (e: boolean) => void;
  chargeCollectDropDown: boolean;
  audienceDropDown: boolean;
  currencyDropDown: boolean;
  referral: number;
  setReferral: (e: number) => void;
  limit: number;
  setLimit: (e: number) => void;
  value: number;
  setValue: (e: number) => void;
  collectibleDropDown: boolean;
  setCollectibleDropDown: (e: boolean) => void;
  collectible: string;
  setCollectible: (e: string) => void;
  chargeCollect: string;
  setChargeCollect: (e: string) => void;
  limitedDropDown: boolean;
  setLimitedDropDown: (e: boolean) => void;
  limitedEdition: string;
  setLimitedEdition: (e: string) => void;
  setTimeLimit: (e: string) => void;
  timeLimit: string;
  timeLimitDropDown: boolean;
  setTimeLimitDropDown: (e: boolean) => void;
  collectNotif: string;
  canComment: boolean;
  profileId: string;
  handleLensSignIn: () => Promise<void>;
  handleConnect: () => void;
  feedType: {
    value: string;
    index: number;
  };
  scrollRef: Ref<InfiniteScroll>;
  setScrollPos: (e: MouseEvent) => void;
  scrollPos: number;
  individualAmounts: IndividualFeedCountState;
  fetchMoreProfile: () => Promise<void>;
  hasMoreProfile: boolean;
  followerOnlyProfile: boolean[];
  profileRef: Ref<InfiniteScroll>;
  profileDispatch: Publication[];
  profileAmounts: ProfileFeedCountState;
  profileLoading: boolean;
  setCollectProfileLoading: (e: boolean[]) => void;
  setMirrorProfileLoading: (e: boolean[]) => void;
  setReactProfileLoading: (e: boolean[]) => void;
  collectProfileLoading: boolean[];
  mirrorProfileLoading: boolean[];
  reactProfileLoading: boolean[];
  setProfileScroll: (e: MouseEvent) => void;
  profileScroll: number;
  quickProfiles: QuickProfilesInterface[];
  profileCollections: Collection[];
  searchProfiles: (e: FormEvent) => Promise<void>;
  profilesFound: Profile[];
  profilesOpenSearch: boolean;
  hasMoreSearch: boolean;
  fetchMoreSearch: () => Promise<void>;
  setProfilesOpenSearch: (e: boolean) => void;
  setProfilesFound: (e: Profile[]) => void;
};

export interface ApprovalArgs {
  to: string;
  from: string;
  data: string;
}

export type PersonalTimelineProps = {
  feed: Publication[];
  feedDispatch: Publication[];
  reactionAmounts: ReactionFeedCountState;
  dispatch: Dispatch<AnyAction>;
  hasMirrored: boolean[];
  hasReacted: boolean[];
  hasCollected: boolean[];
  followerOnly: boolean[];
  collectPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mirrorPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  reactPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  address: `0x${string}` | undefined;
  viewerOpen: boolean;
  router: NextRouter;
  mirrorLoading: boolean[];
  reactLoading: boolean[];
  collectLoading: boolean[];
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

export type IndividualProps = {
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  mainPost: Publication;
  feedType: {
    value: string;
    index: number;
  };
  profileType: string;
  address: `0x${string}` | undefined;
  followerOnlyMain: boolean;
  collectPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mirrorPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  reactPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mainPostLoading: boolean;
  commentAmounts: CommentFeedCountState;
  commentors: Publication[];
  mirrorCommentLoading: boolean[];
  reactCommentLoading: boolean[];
  collectCommentLoading: boolean[];
  followerOnlyComments: boolean[];
  hasMoreComments: boolean;
  fetchMoreComments: () => Promise<void>;
  commentsLoading: boolean;
  collectPostLoading: boolean[];
  mirrorPostLoading: boolean[];
  reactPostLoading: boolean[];
  setMirrorCommentLoading: (e: boolean[]) => void;
  setCollectCommentLoading: (e: boolean[]) => void;
  setReactCommentLoading: (e: boolean[]) => void;
  setCollectPostLoading: (e: boolean[]) => void;
  setMirrorPostLoading: (e: boolean[]) => void;
  setReactPostLoading: (e: boolean[]) => void;
  postAmounts: ReactionFeedCountState;
  commentOpen: string;
  commentPost: (id: string) => Promise<void>;
  commentDescription: string;
  handleCommentDescription: (e: FormEvent) => Promise<void>;
  textElement: Ref<HTMLTextAreaElement>;
  caretCoord: {
    x: number;
    y: number;
  };
  mentionProfiles: Profile[];
  profilesOpen: boolean;
  handleMentionClick: (user: any) => void;
  commentLoading: boolean;
  gifOpen: boolean;
  handleKeyDownDelete: (e: KeyboardEvent<Element>) => void;
  handleGifSubmit: () => Promise<void>;
  handleGif: (e: FormEvent) => void;
  results: any[];
  handleSetGif: (result: any) => void;
  setGifOpen: (e: boolean) => void;
  videoLoading: boolean;
  imageLoading: boolean;
  uploadImages: (e: FormEvent) => Promise<void>;
  uploadVideo: (e: FormEvent) => Promise<void>;
  handleRemoveImage: (e: UploadedMedia) => void;
  postImagesDispatched?: UploadedMedia[];
  mappedFeaturedFiles: UploadedMedia[];
  collectOpen: boolean;
  enabledCurrencies: Erc20[];
  audienceTypes: string[];
  setAudienceType: (e: string) => void;
  audienceType: string;
  setEnabledCurrency: (e: string) => void;
  enabledCurrency: string | undefined;
  setChargeCollectDropDown: (e: boolean) => void;
  setAudienceDropDown: (e: boolean) => void;
  setCurrencyDropDown: (e: boolean) => void;
  chargeCollectDropDown: boolean;
  audienceDropDown: boolean;
  currencyDropDown: boolean;
  referral: number;
  setReferral: (e: number) => void;
  limit: number;
  setLimit: (e: number) => void;
  value: number;
  setValue: (e: number) => void;
  collectibleDropDown: boolean;
  setCollectibleDropDown: (e: boolean) => void;
  collectible: string;
  setCollectible: (e: string) => void;
  chargeCollect: string;
  setChargeCollect: (e: string) => void;
  limitedDropDown: boolean;
  setLimitedDropDown: (e: boolean) => void;
  limitedEdition: string;
  setLimitedEdition: (e: string) => void;
  setTimeLimit: (e: string) => void;
  timeLimit: string;
  timeLimitDropDown: boolean;
  setTimeLimitDropDown: (e: boolean) => void;
  collectNotif: string;
  canComment: boolean;
  profileId: string;
  handleLensSignIn: () => Promise<void>;
  handleConnect: () => void;
  individualAmounts: IndividualFeedCountState;
};

export type CommentsProps = {
  router: NextRouter;
  commentAmounts: CommentFeedCountState;
  commentors: Publication[];
  mirrorLoading: boolean[];
  reactLoading: boolean[];
  collectLoading: boolean[];
  feedType: string;
  dispatch: Dispatch<AnyAction>;
  address: `0x${string}` | undefined;
  followerOnly: boolean[];
  collectPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mirrorPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  reactPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  fetchMoreComments: () => Promise<void>;
  hasMoreComments: boolean;
  commentsLoading: boolean;
  setReactLoader: (e: boolean[]) => void;
  setMirrorLoader: (e: boolean[]) => void;
  setCollectLoader: (e: boolean[]) => void;
  profileId: string;
  commentPost: (id: string) => Promise<void>;
  handleLensSignIn: () => Promise<void>;
  handleConnect: () => void;
  commentDescription: string;
  commentLoading: boolean;
  handleCommentDescription: (e: FormEvent) => Promise<void>;
  textElement: Ref<HTMLTextAreaElement>;
  caretCoord: {
    x: number;
    y: number;
  };
  mentionProfiles: Profile[];
  profilesOpen: boolean;
  handleMentionClick: (user: any) => void;
  videoLoading: boolean;
  imageLoading: boolean;
  uploadImages: (e: FormEvent) => Promise<void>;
  uploadVideo: (e: FormEvent) => Promise<void>;
  handleRemoveImage: (e: UploadedMedia) => void;
  postImagesDispatched?: UploadedMedia[];
  mappedFeaturedFiles: UploadedMedia[];
  handleGifSubmit: () => Promise<void>;
  handleGif: (e: FormEvent) => void;
  results: any[];
  handleSetGif: (result: any) => void;
  setGifOpen: (e: boolean) => void;
  gifOpen: boolean;
  collectOpen: boolean;
  enabledCurrencies: Erc20[];
  audienceTypes: string[];
  setAudienceType: (e: string) => void;
  audienceType: string;
  setEnabledCurrency: (e: string) => void;
  enabledCurrency: string | undefined;
  setChargeCollectDropDown: (e: boolean) => void;
  setAudienceDropDown: (e: boolean) => void;
  setCurrencyDropDown: (e: boolean) => void;
  chargeCollectDropDown: boolean;
  audienceDropDown: boolean;
  currencyDropDown: boolean;
  referral: number;
  setReferral: (e: number) => void;
  limit: number;
  setLimit: (e: number) => void;
  value: number;
  setValue: (e: number) => void;
  collectibleDropDown: boolean;
  setCollectibleDropDown: (e: boolean) => void;
  collectible: string;
  setCollectible: (e: string) => void;
  chargeCollect: string;
  setChargeCollect: (e: string) => void;
  limitedDropDown: boolean;
  setLimitedDropDown: (e: boolean) => void;
  limitedEdition: string;
  setLimitedEdition: (e: string) => void;
  setTimeLimit: (e: string) => void;
  timeLimit: string;
  timeLimitDropDown: boolean;
  setTimeLimitDropDown: (e: boolean) => void;
  collectNotif: string;
  handleKeyDownDelete: (e: KeyboardEvent<Element>) => void;
  commentId: string;
  canComment: boolean;
  openComment: string;
  profileType: string;
};

export interface UploadedMedia {
  cid: string;
  type: MediaType;
}

export interface PostImage {
  item: string;
  type: string;
  altTag: string;
}

export interface CollectValueType {
  freeCollectModule?: {
    followerOnly: boolean;
  };
  revertCollectModule?: boolean;
  feeCollectModule?: {
    amount: {
      currency: string;
      value: string;
    };
    recipient: string;
    referralFee: number;
    followerOnly: boolean;
  };
  limitedFeeCollectModule?: {
    collectLimit: string;
    amount: {
      currency: string;
      value: string;
    };
    recipient: string;
    referralFee: number;
    followerOnly: boolean;
  };
  limitedTimedFeeCollectModule?: {
    collectLimit: string;
    amount: {
      currency: string;
      value: string;
    };
    recipient: string;
    referralFee: number;
    followerOnly: boolean;
  };
  timedFeeCollectModule?: {
    amount: {
      currency: string;
      value: string;
    };
    recipient: string;
    referralFee: number;
    followerOnly: boolean;
  };
}

export type ImageUploadsProps = {
  handleRemoveImage: (e: UploadedMedia) => void;
  commentLoading: boolean;
  postImagesDispatched?: UploadedMedia[];
};

export type MakeCommentProps = {
  address: `0x${string}` | undefined;
  profileId: string;
  commentPost: (id: string) => Promise<void>;
  handleLensSignIn: () => Promise<void>;
  handleConnect: () => void;
  commentDescription: string;
  commentLoading: boolean;
  handleCommentDescription: (e: FormEvent) => Promise<void>;
  textElement: Ref<HTMLTextAreaElement>;
  caretCoord: {
    x: number;
    y: number;
  };
  mentionProfiles: Profile[];
  profilesOpen: boolean;
  handleMentionClick: (user: any) => void;
  videoLoading: boolean;
  imageLoading: boolean;
  uploadImages: (e: FormEvent) => Promise<void>;
  uploadVideo: (e: FormEvent) => Promise<void>;
  handleRemoveImage: (e: UploadedMedia) => void;
  postImagesDispatched?: UploadedMedia[];
  mappedFeaturedFiles: UploadedMedia[];
  handleGifSubmit: () => Promise<void>;
  handleGif: (e: FormEvent) => void;
  results: any[];
  handleSetGif: (result: any) => void;
  setGifOpen: (e: boolean) => void;
  gifOpen: boolean;
  collectOpen: boolean;
  enabledCurrencies: Erc20[];
  audienceTypes: string[];
  setAudienceType: (e: string) => void;
  audienceType: string;
  setEnabledCurrency: (e: string) => void;
  enabledCurrency: string | undefined;
  setChargeCollectDropDown: (e: boolean) => void;
  setAudienceDropDown: (e: boolean) => void;
  setCurrencyDropDown: (e: boolean) => void;
  chargeCollectDropDown: boolean;
  audienceDropDown: boolean;
  currencyDropDown: boolean;
  referral: number;
  setReferral: (e: number) => void;
  limit: number;
  setLimit: (e: number) => void;
  value: number;
  setValue: (e: number) => void;
  collectibleDropDown: boolean;
  setCollectibleDropDown: (e: boolean) => void;
  collectible: string;
  setCollectible: (e: string) => void;
  chargeCollect: string;
  setChargeCollect: (e: string) => void;
  limitedDropDown: boolean;
  setLimitedDropDown: (e: boolean) => void;
  limitedEdition: string;
  setLimitedEdition: (e: string) => void;
  setTimeLimit: (e: string) => void;
  timeLimit: string;
  timeLimitDropDown: boolean;
  setTimeLimitDropDown: (e: boolean) => void;
  collectNotif: string;
  dispatch: Dispatch<AnyAction>;
  handleKeyDownDelete: (e: KeyboardEvent<Element>) => void;
  commentId: string;
  canComment: boolean;
};

export type OptionsCommentProps = {
  videoLoading: boolean;
  imageLoading: boolean;
  commentLoading: boolean;
  uploadImages: (e: FormEvent) => Promise<void>;
  uploadVideo: (e: FormEvent) => Promise<void>;
  setGifOpen: (e: boolean) => void;
  gifOpen: boolean;
  collectOpen: boolean;
  dispatch: Dispatch<AnyAction>;
};

export interface CollectValueType {
  freeCollectModule?: {
    followerOnly: boolean;
  };
  revertCollectModule?: boolean;
  feeCollectModule?: {
    amount: {
      currency: string;
      value: string;
    };
    recipient: string;
    referralFee: number;
    followerOnly: boolean;
  };
  limitedFeeCollectModule?: {
    collectLimit: string;
    amount: {
      currency: string;
      value: string;
    };
    recipient: string;
    referralFee: number;
    followerOnly: boolean;
  };
  limitedTimedFeeCollectModule?: {
    collectLimit: string;
    amount: {
      currency: string;
      value: string;
    };
    recipient: string;
    referralFee: number;
    followerOnly: boolean;
  };
  timedFeeCollectModule?: {
    amount: {
      currency: string;
      value: string;
    };
    recipient: string;
    referralFee: number;
    followerOnly: boolean;
  };
}

export type ProfileFeedProps = {
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  followerOnly: boolean[];
  profileDispatch: Publication[];
  hasMoreProfile: boolean;
  fetchMoreProfile: () => Promise<void>;
  address: `0x${string}` | undefined;
  collectPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mirrorPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  reactPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mirrorLoading: boolean[];
  reactLoading: boolean[];
  collectLoading: boolean[];
  profileType: string;
  profileAmounts: ProfileFeedCountState;
  setCollectProfileLoading: (e: boolean[]) => void;
  setMirrorProfileLoading: (e: boolean[]) => void;
  setReactProfileLoading: (e: boolean[]) => void;
  commentOpen: string;
  commentPost: (id: string) => Promise<void>;
  commentDescription: string;
  handleCommentDescription: (e: FormEvent) => Promise<void>;
  textElement: Ref<HTMLTextAreaElement>;
  caretCoord: {
    x: number;
    y: number;
  };
  mentionProfiles: Profile[];
  profilesOpen: boolean;
  handleMentionClick: (user: any) => void;
  commentLoading: boolean;
  gifOpen: boolean;
  handleKeyDownDelete: (e: KeyboardEvent<Element>) => void;
  handleGifSubmit: () => Promise<void>;
  handleGif: (e: FormEvent) => void;
  results: any[];
  handleSetGif: (result: any) => void;
  setGifOpen: (e: boolean) => void;
  videoLoading: boolean;
  imageLoading: boolean;
  uploadImages: (e: FormEvent) => Promise<void>;
  uploadVideo: (e: FormEvent) => Promise<void>;
  handleRemoveImage: (e: UploadedMedia) => void;
  postImagesDispatched?: UploadedMedia[];
  mappedFeaturedFiles: UploadedMedia[];
  collectOpen: boolean;
  enabledCurrencies: Erc20[];
  audienceTypes: string[];
  setAudienceType: (e: string) => void;
  audienceType: string;
  setEnabledCurrency: (e: string) => void;
  enabledCurrency: string | undefined;
  setChargeCollectDropDown: (e: boolean) => void;
  setAudienceDropDown: (e: boolean) => void;
  setCurrencyDropDown: (e: boolean) => void;
  chargeCollectDropDown: boolean;
  audienceDropDown: boolean;
  currencyDropDown: boolean;
  referral: number;
  setReferral: (e: number) => void;
  limit: number;
  setLimit: (e: number) => void;
  value: number;
  setValue: (e: number) => void;
  collectibleDropDown: boolean;
  setCollectibleDropDown: (e: boolean) => void;
  collectible: string;
  setCollectible: (e: string) => void;
  chargeCollect: string;
  setChargeCollect: (e: string) => void;
  limitedDropDown: boolean;
  setLimitedDropDown: (e: boolean) => void;
  limitedEdition: string;
  setLimitedEdition: (e: string) => void;
  setTimeLimit: (e: string) => void;
  timeLimit: string;
  timeLimitDropDown: boolean;
  setTimeLimitDropDown: (e: boolean) => void;
  collectNotif: string;
  canComment: boolean;
  profileId: string;
  handleLensSignIn: () => Promise<void>;
  handleConnect: () => void;
  feedType: {
    value: string;
    index: number;
  };
  profileRef: Ref<InfiniteScroll>;
  setScrollPos: (e: MouseEvent) => void;
  scrollPos: number;
  profile: Profile | undefined;
  profileCollections: Collection[];
};

export type SwitchProps = {
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  followerOnly: boolean[];
  feedDispatch: Publication[];
  hasMore: boolean;
  profileType: string;
  fetchMore: () => Promise<void>;
  address: `0x${string}` | undefined;
  collectPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mirrorPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  reactPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mirrorLoading: boolean[];
  reactLoading: boolean[];
  collectLoading: boolean[];
  reactionAmounts: ReactionFeedCountState;
  commentOpen: string;
  commentPost: (id: string) => Promise<void>;
  commentDescription: string;
  handleCommentDescription: (e: FormEvent) => Promise<void>;
  textElement: Ref<HTMLTextAreaElement>;
  caretCoord: {
    x: number;
    y: number;
  };
  mentionProfiles: Profile[];
  profilesOpen: boolean;
  handleMentionClick: (user: any) => void;
  commentLoading: boolean;
  gifOpen: boolean;
  handleKeyDownDelete: (e: KeyboardEvent<Element>) => void;
  handleGifSubmit: () => Promise<void>;
  handleGif: (e: FormEvent) => void;
  results: any[];
  handleSetGif: (result: any) => void;
  setGifOpen: (e: boolean) => void;
  videoLoading: boolean;
  imageLoading: boolean;
  uploadImages: (e: FormEvent) => Promise<void>;
  uploadVideo: (e: FormEvent) => Promise<void>;
  handleRemoveImage: (e: UploadedMedia) => void;
  postImagesDispatched?: UploadedMedia[];
  mappedFeaturedFiles: UploadedMedia[];
  collectOpen: boolean;
  enabledCurrencies: Erc20[];
  audienceTypes: string[];
  setAudienceType: (e: string) => void;
  audienceType: string;
  setEnabledCurrency: (e: string) => void;
  enabledCurrency: string | undefined;
  setChargeCollectDropDown: (e: boolean) => void;
  setAudienceDropDown: (e: boolean) => void;
  setCurrencyDropDown: (e: boolean) => void;
  chargeCollectDropDown: boolean;
  audienceDropDown: boolean;
  currencyDropDown: boolean;
  referral: number;
  setReferral: (e: number) => void;
  limit: number;
  setLimit: (e: number) => void;
  value: number;
  setValue: (e: number) => void;
  collectibleDropDown: boolean;
  setCollectibleDropDown: (e: boolean) => void;
  collectible: string;
  setCollectible: (e: string) => void;
  chargeCollect: string;
  setChargeCollect: (e: string) => void;
  limitedDropDown: boolean;
  setLimitedDropDown: (e: boolean) => void;
  limitedEdition: string;
  setLimitedEdition: (e: string) => void;
  setTimeLimit: (e: string) => void;
  timeLimit: string;
  timeLimitDropDown: boolean;
  setTimeLimitDropDown: (e: boolean) => void;
  collectNotif: string;
  canComment: boolean;
  profileId: string;
  handleLensSignIn: () => Promise<void>;
  handleConnect: () => void;
  feedType: {
    value: string;
    index: number;
  };
  scrollRef: Ref<InfiniteScroll>;
  profileRef: Ref<InfiniteScroll>;
  setScrollPos: (e: MouseEvent) => void;
  scrollPos: number;
  profile: Profile | undefined;
  hasMoreProfile: boolean;
  fetchMoreProfile: () => Promise<void>;
  profileDispatch: Publication[];
  followerOnlyProfile: boolean[];
  profileAmounts: ProfileFeedCountState;
  setCollectProfileLoading: (e: boolean[]) => void;
  setMirrorProfileLoading: (e: boolean[]) => void;
  setReactProfileLoading: (e: boolean[]) => void;
  collectProfileLoading: boolean[];
  mirrorProfileLoading: boolean[];
  reactProfileLoading: boolean[];
  setProfileScroll: (e: MouseEvent) => void;
  profileScroll: number;
  quickProfiles: QuickProfilesInterface[];
  profileCollections: Collection[];
  searchProfiles: (e: FormEvent) => Promise<void>;
  profilesFound: Profile[];
  profilesOpenSearch: boolean;
  fetchMoreSearch: () => Promise<void>;
  hasMoreSearch: boolean;
  setProfilesOpenSearch: (e: boolean) => void;
  setProfilesFound: (e: Profile[]) => void;
};

export type AllPostsProps = {
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  followerOnly: boolean[];
  feedDispatch: Publication[];
  hasMore: boolean;
  fetchMore: () => Promise<void>;
  address: `0x${string}` | undefined;
  collectPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mirrorPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  reactPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mirrorLoading: boolean[];
  reactLoading: boolean[];
  collectLoading: boolean[];
  reactionAmounts: ReactionFeedCountState;
  commentOpen: string;
  commentPost: (id: string) => Promise<void>;
  commentDescription: string;
  handleCommentDescription: (e: FormEvent) => Promise<void>;
  textElement: Ref<HTMLTextAreaElement>;
  caretCoord: {
    x: number;
    y: number;
  };
  mentionProfiles: Profile[];
  profilesOpen: boolean;
  handleMentionClick: (user: any) => void;
  commentLoading: boolean;
  gifOpen: boolean;
  handleKeyDownDelete: (e: KeyboardEvent<Element>) => void;
  handleGifSubmit: () => Promise<void>;
  handleGif: (e: FormEvent) => void;
  results: any[];
  handleSetGif: (result: any) => void;
  setGifOpen: (e: boolean) => void;
  videoLoading: boolean;
  imageLoading: boolean;
  uploadImages: (e: FormEvent) => Promise<void>;
  uploadVideo: (e: FormEvent) => Promise<void>;
  handleRemoveImage: (e: UploadedMedia) => void;
  postImagesDispatched?: UploadedMedia[];
  mappedFeaturedFiles: UploadedMedia[];
  collectOpen: boolean;
  enabledCurrencies: Erc20[];
  audienceTypes: string[];
  setAudienceType: (e: string) => void;
  audienceType: string;
  setEnabledCurrency: (e: string) => void;
  enabledCurrency: string | undefined;
  setChargeCollectDropDown: (e: boolean) => void;
  setAudienceDropDown: (e: boolean) => void;
  setCurrencyDropDown: (e: boolean) => void;
  chargeCollectDropDown: boolean;
  audienceDropDown: boolean;
  currencyDropDown: boolean;
  referral: number;
  setReferral: (e: number) => void;
  limit: number;
  setLimit: (e: number) => void;
  value: number;
  setValue: (e: number) => void;
  collectibleDropDown: boolean;
  setCollectibleDropDown: (e: boolean) => void;
  collectible: string;
  setCollectible: (e: string) => void;
  chargeCollect: string;
  setChargeCollect: (e: string) => void;
  limitedDropDown: boolean;
  setLimitedDropDown: (e: boolean) => void;
  limitedEdition: string;
  setLimitedEdition: (e: string) => void;
  setTimeLimit: (e: string) => void;
  timeLimit: string;
  timeLimitDropDown: boolean;
  setTimeLimitDropDown: (e: boolean) => void;
  collectNotif: string;
  canComment: boolean;
  profileId: string;
  handleLensSignIn: () => Promise<void>;
  handleConnect: () => void;
  feedType: {
    value: string;
    index: number;
  };
  scrollRef: Ref<InfiniteScroll>;
  setScrollPos: (e: MouseEvent) => void;
  scrollPos: number;
  quickProfiles: QuickProfilesInterface[];
  searchProfiles: (e: FormEvent) => Promise<void>;
  profilesFound: Profile[];
  profilesOpenSearch: boolean;
  hasMoreSearch: boolean;
  fetchMoreSearch: () => Promise<void>;
  setProfilesOpenSearch: (e: boolean) => void;
  setProfilesFound: (e: Profile[]) => void;
  profileType: string;
};

export interface QuickProfilesInterface {
  handle: string;
  id: string;
  image: string;
}

export type QuickProfilesProps = {
  quickProfiles: QuickProfilesInterface[];
  router: NextRouter;
};

export type AccountProps = {
  profile: Profile | undefined;
  profileCollections: Collection[];
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
};

export type SearchProps = {
  searchProfiles: (e: FormEvent) => Promise<void>;
  profilesFound: Profile[];
  profilesOpenSearch: boolean;
  router: NextRouter;
  hasMoreSearch: boolean;
  fetchMoreSearch: () => Promise<void>;
  setProfilesOpenSearch: (e: boolean) => void;
  setProfilesFound: (e: Profile[]) => void;
};
