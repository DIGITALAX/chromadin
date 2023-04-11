import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/image";
import { FormEvent, FunctionComponent } from "react";
import { ControlsProps } from "../types/controls.types";
import { AiOutlineLoading } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { setMainVideo } from "@/redux/reducers/mainVideoSlice";
import lodash from "lodash";

const Controls: FunctionComponent<ControlsProps> = ({
  fullScreen,
  setFullScreen,
  formatTime,
  duration,
  currentTime,
  volume,
  handleVolumeChange,
  handlePlay,
  handlePause,
  isPlaying,
  volumeOpen,
  setVolumeOpen,
  handleHeart,
  collected,
  mirrored,
  liked,
  likeVideo,
  collectVideo,
  mirrorVideo,
  authStatus,
  profileId,
  likeLoading,
  mirrorLoading,
  collectLoading,
  videos,
  mainVideo,
  likedArray,
  mirroredArray,
}): JSX.Element => {
  const dispatch = useDispatch();
  const currentIndex = lodash.findIndex(videos, { id: mainVideo.id });
  return (
    <div className="relative h-fit flex flex-col preG:flex-row w-full gap-3 items-center galaxy:px-2 justify-center">
      <div className="relative w-fit h-full flex justify-center items-center gap-3">
        <div className="relative flex flex-row w-full h-full items-center">
          <div
            className="relative w-4 h-4 cursor-pointer flex"
            onClick={() => setFullScreen(!fullScreen)}
          >
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmVpncAteeF7voaGu1ZV5qP63UpZW2xmiCWVftL1QnL5ja`}
              alt="expand"
              fill
              className="flex items-center"
            />
          </div>
        </div>
        <div className="relative w-fit h-full flex items-center font-digi text-base text-white">
          <span className="text-rosa">{formatTime(currentTime)}</span>/
          <span className="text-light">{formatTime(duration)}</span>
        </div>
      </div>
      <div className="relative w-full flex flex-row gap-3 items-center justify-center preG:justify-end">
        <div
          className={`${profileId && authStatus && "cursor-pointer"} relative ${
            likeLoading && "animate-spin"
          }`}
          onClick={() => {
            handleHeart();
            likeVideo();
          }}
        >
          {likeLoading ? (
            <AiOutlineLoading size={12} color="white" />
          ) : liked ? (
            <Image
              src={`${INFURA_GATEWAY}/ipfs/Qmc3KCKWRgN8iKwwAPM5pYkAYNeVwWu3moa5RDMDTBV6ZS`}
              width={12}
              height={12}
              alt="heart"
            />
          ) : (
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmSX1Y5cKp8p53jv2CnfQBuhu3dgLANjZMTyAMKtgFtvV6`}
              width={12}
              height={12}
              alt="backward"
            />
          )}
        </div>
        <div
          className={`${profileId && authStatus && "cursor-pointer"} relative ${
            collectLoading && "animate-spin"
          }`}
          onClick={() => collectVideo()}
        >
          {collectLoading ? (
            <AiOutlineLoading size={12} color="white" />
          ) : collected ? (
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmXG1mnHdBDXMzMZ9t1wE1Tqo8DRXQ1oNLUxpETdUw17HU`}
              width={12}
              height={12}
              alt="collect"
              draggable={false}
            />
          ) : (
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmRGf1cz8h9bdw9VKp9zYXZoDfy15nRA1fKc7ARhxnRPwr`}
              width={12}
              height={12}
              alt="collect"
              draggable={false}
            />
          )}
        </div>
        <div
          className={`${profileId && authStatus && "cursor-pointer"} relative ${
            mirrorLoading && "animate-spin"
          }`}
          onClick={() => mirrorVideo()}
        >
          {mirrorLoading ? (
            <AiOutlineLoading size={12} color="white" />
          ) : mirrored ? (
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmcMNSnbKvUfx3B3iHBd9deZCDf7E4J8W6UtyNer3xoMsB`}
              width={12}
              height={12}
              alt="mirror"
              draggable={false}
            />
          ) : (
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmXZi8e6UQaXm3BMMdsAUTnxoQSEr97nvuc19v7kBAgFsY`}
              width={12}
              height={12}
              alt="mirror"
              draggable={false}
            />
          )}
        </div>
        <div
          className="relative cursor-pointer rotate-180"
          onClick={() =>
            dispatch(
              setMainVideo({
                actionVideo: `${INFURA_GATEWAY}/ipfs/${
                  videos[
                    currentIndex === videos.length - 1
                      ? 0
                      : currentIndex === 0
                      ? videos.length - 1
                      : currentIndex + 1
                  ].metadata.media[0].original.url.split("ipfs://")[1]
                }`,
                actionCollected:
                  videos[
                    currentIndex === videos.length - 1
                      ? 0
                      : currentIndex === 0
                      ? videos.length - 1
                      : currentIndex + 1
                  ].hasCollectedByMe,
                actionLiked:
                  likedArray[
                    currentIndex === videos.length - 1
                      ? 0
                      : currentIndex === 0
                      ? videos.length - 1
                      : currentIndex + 1
                  ],
                actionMirrored:
                  mirroredArray[
                    currentIndex === videos.length - 1
                      ? 0
                      : currentIndex === 0
                      ? videos.length - 1
                      : currentIndex + 1
                  ],
                actionId:
                  videos[
                    currentIndex === videos.length - 1
                      ? 0
                      : currentIndex === 0
                      ? videos.length - 1
                      : currentIndex + 1
                  ].id,
                actionLocal: `/videos/${videos[
                  currentIndex === videos.length - 1
                    ? 0
                    : currentIndex === 0
                    ? videos.length - 1
                    : currentIndex + 1
                ]?.metadata?.content
                  ?.split("\n\n")[0]
                  .replace(/\s/g, "")
                  .toLowerCase()}.mp4`,
              })
            )
          }
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmcYHKZJWJjgibox8iLqNozENnkgD4CZQqYsmmVJpoYUyo`}
            width={12}
            height={12}
            alt="backward"
            draggable={false}
          />
        </div>
        <div
          className="relative cursor-pointer"
          onClick={isPlaying ? () => handlePause() : () => handlePlay()}
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/${
              isPlaying
                ? "Qmbg8t4xoNywhtCexD5Ln5YWvcKMXGahfwyK6UHpR3nBip"
                : "QmXw52mJFnzYXmoK8eExoHKv7YW9RBVEwSFtfvxXgy7sfp"
            }`}
            draggable={false}
            width={12}
            height={12}
            alt="play"
          />
        </div>
        <div
          className="relative cursor-pointer"
          onClick={() =>
            dispatch(
              setMainVideo({
                actionVideo: `${INFURA_GATEWAY}/ipfs/${
                  videos[
                    (currentIndex + 1) % videos.length
                  ].metadata.media[0].original.url.split("ipfs://")[1]
                }`,
                actionCollected:
                  videos[(currentIndex + 1) % videos.length].hasCollectedByMe,
                actionLiked: likedArray[(currentIndex + 1) % videos.length],
                actionMirrored:
                  mirroredArray[(currentIndex + 1) % videos.length],
                actionId: videos[(currentIndex + 1) % videos.length].id,
                actionLocal: `/videos/${videos[
                  (currentIndex + 1) % videos.length
                ]?.metadata?.content
                  ?.split("\n\n")[0]
                  .replace(/\s/g, "")
                  .toLowerCase()}.mp4`,
              })
            )
          }
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmcYHKZJWJjgibox8iLqNozENnkgD4CZQqYsmmVJpoYUyo`}
            width={12}
            height={12}
            alt="forward"
            draggable={false}
          />
        </div>
        <div
          className="relative cursor-pointer"
          onClick={() => setVolumeOpen(!volumeOpen)}
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/${
              volume === 0
                ? "QmVVzvq68RwGZFi46yKEthuG6PXQf74BaMW4yCrZCkgtzK"
                : "Qme1i88Yd1x4SJfgrSCFyXp7GELCZRnnPQeFUt6jbfPbqL"
            }`}
            width={12}
            height={12}
            alt="volume"
            draggable={false}
          />
        </div>
        {volumeOpen && (
          <input
            className="absolute w-40 h-fit bottom-10"
            type="range"
            value={volume}
            max={1}
            min={0}
            step={0.1}
            onChange={(e: FormEvent) => handleVolumeChange(e)}
          />
        )}
      </div>
    </div>
  );
};

export default Controls;
