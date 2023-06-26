import { Publication } from "@/components/Home/types/lens.types";
import { MainVideoState } from "@/redux/reducers/mainVideoSlice";
import { VideoSyncState } from "@/redux/reducers/videoSyncSlice";
import { FormEvent, MouseEvent, Ref } from "react";
import ReactPlayer from "react-player";
import { AnyAction, Dispatch } from "redux";

export type ControlsProps = {
  videoSync: VideoSyncState;
  formatTime: (time: number) => string;
  volume: number;
  volumeOpen: boolean;
  setVolumeOpen: (volumeOpen: boolean) => void;
  handleVolumeChange: (e: FormEvent) => void;
  handleHeart: () => void;
  collected: boolean;
  mirrored: boolean;
  liked: boolean;
  mirrorVideo: () => Promise<void>;
  likeVideo: () => Promise<void>;
  collectVideo: () => Promise<void>;
  mirrorLoading: boolean;
  collectLoading: boolean;
  likeLoading: boolean;
  authStatus: boolean;
  profileId: string;
  mainVideo: MainVideoState;
  progressRef: Ref<HTMLDivElement>;
  handleSeek: (
    e: MouseEvent<HTMLDivElement, MouseEvent<Element, MouseEvent>>
  ) => void;
  dispatchVideos: Publication[];
  collectAmount: number[];
  mirrorAmount: number[];
  likeAmount: number[];
  dispatch: Dispatch<AnyAction>;
  hasMore: boolean;
  fetchMoreVideos: () => Promise<
    | { videos: any[]; mirrors: any[]; collects: boolean[]; likes: any[] }
    | undefined
  >;
  videosLoading: boolean;
  setVideosLoading: (e: boolean) => void;
  viewer: string;
};

export type UseControlsResults = {
  streamRef: Ref<ReactPlayer>;
  fullVideoRef: Ref<ReactPlayer>;
  formatTime: (time: number) => string;
  volume: number;
  volumeOpen: boolean;
  setVolumeOpen: (volumeOpen: boolean) => void;
  handleVolumeChange: (e: FormEvent) => void;
  handleHeart: () => void;
  mirrorVideo: () => Promise<void>;
  likeVideo: () => Promise<void>;
  collectVideo: () => Promise<void>;
  mirrorLoading: boolean;
  collectLoading: boolean;
  likeLoading: boolean;
  authStatus: boolean;
  profileId: string;
  mainVideo: MainVideoState;
  mirrorCommentLoading: boolean[];
  likeCommentLoading: boolean[];
  collectCommentLoading: boolean[];
  approvalLoading: boolean;
  collectInfoLoading: boolean;
  approveCurrency: () => Promise<void>;
  wrapperRef: Ref<HTMLDivElement>;
  progressRef: Ref<HTMLDivElement>;
  handleSeek: (
    e: MouseEvent<HTMLDivElement, MouseEvent<Element, MouseEvent>>
  ) => void;
};

export type VideoProps = {
  viewer: string;
};

export type PlayerProps = {
  streamRef: Ref<ReactPlayer>;
  mainVideo: MainVideoState;
  volume: number;
  wrapperRef: Ref<HTMLDivElement>;
  dispatchVideos: Publication[];
  fullScreen: boolean;
  muted: boolean;
  videoSync: VideoSyncState;
  viewer: string;
  dispatch: Dispatch<AnyAction>;
  hasMore: boolean;
  fetchMoreVideos: () => Promise<
    | { videos: any[]; mirrors: any[]; collects: boolean[]; likes: any[] }
    | undefined
  >;
  videosLoading: boolean;
  setVideosLoading: (e: boolean) => void;
};

export type ComponentProps = {
  streamRef: Ref<ReactPlayer>;
  mainVideo: MainVideoState;
  isPlaying: boolean;
  volume: number;
  dispatchVideos: Publication[];
  muted: boolean;
  videoSync: VideoSyncState;
  dispatch: Dispatch<AnyAction>;
  hasMore: boolean;
  fetchMoreVideos: () => Promise<
    | { videos: any[]; mirrors: any[]; collects: boolean[]; likes: any[] }
    | undefined
  >;
  videosLoading: boolean;
  setVideosLoading: (e: boolean) => void;
};
