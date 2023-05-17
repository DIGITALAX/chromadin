import { Profile, Publication } from "@/components/Home/types/lens.types";
import { FollowerOnlyState } from "@/redux/reducers/followerOnlySlice";
import { MainVideoState } from "@/redux/reducers/mainVideoSlice";
import { PostCollectValuesState } from "@/redux/reducers/postCollectSlice";
import { VideoSyncState } from "@/redux/reducers/videoSyncSlice";
import { NextRouter } from "next/router";
import { Ref } from "react";
import ReactPlayer from "react-player";
import { AnyAction, Dispatch } from "redux";
import { QuickProfilesInterface } from "../../Wavs/types/wavs.types";

export type IndexingModalProps = {
  message: string | undefined;
};

export type CollectModalProps = {
  message: string;
};

export type CollectInfoProps = {
  buttonText: string;
  symbol?: string;
  value?: string;
  limit?: string;
  time?: string;
  totalCollected?: number;
  canClick?: boolean;
  isApproved?: boolean;
  approveCurrency?: () => Promise<void>;
  handleCollect?: (id?: string) => Promise<void>;
  collectLoading: boolean;
  approvalLoading?: boolean;
  handleLensSignIn: () => Promise<void>;
  commentId: string;
};

export type PurchaseProps = {
  collectInfoLoading: boolean;
  approvalLoading: boolean;
  address: `0x${string}` | undefined;
  collectModuleValues: PostCollectValuesState;
  lensProfile: string;
  collectComment: (id?: any) => Promise<void>;
  collectLoading: boolean;
  approveCurrency: () => Promise<void>;
  handleLensSignIn: () => Promise<void>;
  commentId: string;
};

export type FollowerOnlyProps = {
  profile: Profile | undefined;
  followProfile: () => Promise<void>;
  followLoading: boolean;
  approved: boolean;
  approveCurrency: () => Promise<void>;
  dispatch: Dispatch<AnyAction>;
  followDetails: FollowerOnlyState;
  unfollowProfile: () => Promise<void>;
};

export type ImageLargeProps = {
  mainImage: string;
};

export type SuccessProps = {
  media: string;
  dispatch: Dispatch<AnyAction>;
};

export type ImageViewerProps = {
  dispatch: Dispatch<AnyAction>;
  image: string;
  type: string;
};

export type WhoProps = {
  accounts: any[];
  fetchMore: () => Promise<void>;
  loading: boolean;
  dispatch: Dispatch<AnyAction>;
  hasMore: boolean;
  type: number;
  router: NextRouter;
};

export type FullScreenVideoProps = {
  dispatch: Dispatch<AnyAction>;
  mainVideo: MainVideoState;
  videoRef: Ref<HTMLDivElement>;
  streamRef: Ref<ReactPlayer>;
  videos: Publication[];
  wrapperRef: Ref<HTMLDivElement>;
  dispatchVideos: Publication[];
  videoSync: VideoSyncState;
  viewer: string;
};

export type SuperFollowProps = {
  dispatch: Dispatch<AnyAction>;
  followSuper: () => Promise<void>;
  quickProfiles: QuickProfilesInterface[];
  router: NextRouter;
  superCreatorLoading: boolean;
  rain: boolean;
  canvasRef: Ref<HTMLCanvasElement>;
};
