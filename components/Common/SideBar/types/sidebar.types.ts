import { Profile, Publication } from "@/components/Home/types/lens.types";
import { VideoSyncState } from "@/redux/reducers/videoSyncSlice";
import { AnyAction, Dispatch } from "redux";

export type ChannelsProps = {
  dispatch: Dispatch<AnyAction>;
  dispatchVideos: Publication[];
  videoSync: VideoSyncState;
  fetchMoreVideos: () => Promise<
    | { videos: any[]; mirrors: any[]; collects: boolean[]; likes: any[] }
    | undefined
  >;
  hasMore: boolean;
};

export type UseChannelsResults = {
  tab: number;
  setTab: (e: number) => void;
  fetchMoreVideos: () => Promise<
    | { videos: any[]; mirrors: any[]; collects: boolean[]; likes: any[] }
    | undefined
  >;
  videosLoading: boolean;
  setVideosLoading: (e: boolean) => void;
};

export type UseConnectResults = {
  handleConnect: () => void;
  handleLensSignIn: () => Promise<void>;
  handleRefreshProfile: () => Promise<void>;
  connected: boolean;
  signInLoading: boolean;
};

export type ConnectProps = {
  handleConnect: () => void;
  handleLensSignIn: () => Promise<void>;
  connected: boolean;
  authStatus: boolean;
  profile: Profile | undefined;
};

export type AuthProps = {
  handleConnect: () => void;
  handleLensSignIn: () => Promise<void>;
  connected: boolean;
  authStatus: boolean;
  profile: Profile | undefined;
};

export type WalletProps = {
  handleTransaction: () => void;
  isConnected: boolean;
  buttonText: string;
};

export type ProfileProps = {
  profile: Profile | undefined;
};

export type TabProps = {
  tab: number;
  setTab: (e: number) => void;
  viewer: string;
};

export type SideBarProps = {
  handleConnect: () => void;
  handleLensSignIn: () => Promise<void>;
  connected: boolean;
  authStatus: boolean;
  profile: Profile | undefined;
  tab: number;
  setTab: (e: number) => void;
  dispatch: Dispatch<AnyAction>;
  viewer: string;
  dispatchVideos: Publication[];
  options: string;
  videoSync: VideoSyncState;
  fetchMoreVideos: () => Promise<
    | { videos: any[]; mirrors: any[]; collects: boolean[]; likes: any[] }
    | undefined
  >;
  hasMore: boolean;
};

export type SwitcherProps = {
  options: string;
  dispatch: Dispatch<AnyAction>;
};
