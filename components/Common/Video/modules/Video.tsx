import { FunctionComponent } from "react";
import Controls from "@/components/Common/Video/modules/Controls";
import useControls from "../hooks/useControls";
import { VideoProps } from "../types/controls.types";
import Player from "./Player";
import useChannels from "../../SideBar/hooks/useChannels";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const Video: FunctionComponent<VideoProps> = ({ viewer }): JSX.Element => {
  const {
    streamRef,
    formatTime,
    volume,
    handleVolumeChange,
    volumeOpen,
    setVolumeOpen,
    handleHeart,
    mirrorVideo,
    collectVideo,
    likeVideo,
    mirrorLoading,
    collectLoading,
    likeLoading,
    profileId,
    authStatus,
    mainVideo,
    wrapperRef,
    progressRef,
    handleSeek,
  } = useControls();
  const { videos } = useChannels();
  const dispatch = useDispatch();
  const dispatchVideos = useSelector(
    (state: RootState) => state.app.channelsReducer.value
  );
  const videoSync = useSelector(
    (state: RootState) => state.app.videoSyncReducer
  );
  const reactions = useSelector(
    (state: RootState) => state.app.videoCountReducer
  );
  return (
    <div
      className={`${
        viewer === "sampler"
          ? "absolute top-0 z-2 w-0 h-0"
          : viewer === "collect" || viewer === "chat"
          ? "h-28 bg-chroma bg-cover z-0 relative w-full"
          : "h-[15rem] galaxy:h-[20rem] preG:h-[25rem] sm:h-[30rem] mid:h-[35.8rem] z-0 relative w-full"
      } flex gap-2 justify-center items-center`}
    >
      <div
        className={`relative w-full h-full flex gap-2 items-center justify-center ${
          viewer === "collect" || viewer === "chat"
            ? "flex-row bg-black/50 p-2"
            : "flex-col"
        }`}
      >
        <Player
          viewer={viewer}
          streamRef={streamRef}
          mainVideo={mainVideo}
          videos={videos}
          volume={volume}
          wrapperRef={wrapperRef}
          dispatchVideos={dispatchVideos}
          fullScreen={false}
          videoSync={videoSync}
          muted={false}
          dispatch={dispatch}
        />
        {viewer !== "sampler" && (
          <Controls
            formatTime={formatTime}
            volume={volume}
            handleVolumeChange={handleVolumeChange}
            volumeOpen={volumeOpen}
            setVolumeOpen={setVolumeOpen}
            handleHeart={handleHeart}
            collected={mainVideo.collected}
            mirrored={mainVideo.mirrored}
            liked={mainVideo.liked}
            mirrorVideo={mirrorVideo}
            collectVideo={collectVideo}
            likeVideo={likeVideo}
            likeLoading={likeLoading}
            collectLoading={collectLoading}
            mirrorLoading={mirrorLoading}
            authStatus={authStatus}
            profileId={profileId}
            mainVideo={mainVideo}
            videos={videos}
            progressRef={progressRef}
            handleSeek={handleSeek}
            dispatchVideos={dispatchVideos}
            collectAmount={reactions.collect}
            mirrorAmount={reactions.mirror}
            likeAmount={reactions.like}
            videoSync={videoSync}
            dispatch={dispatch}
          />
        )}
      </div>
    </div>
  );
};

export default Video;
