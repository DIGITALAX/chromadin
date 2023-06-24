import { FunctionComponent } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import moment from "moment";
import { MediaSet } from "@/components/Home/types/lens.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import FetchMoreLoading from "../../Loading/FetchMoreLoading";
import { CommentsProps } from "../types/interactions.types";
import descriptionRegex from "@/lib/helpers/descriptionRegex";
import { AiFillFastBackward, AiOutlineLoading } from "react-icons/ai";
import ReactPlayer from "react-player";
import { setPurchase } from "@/redux/reducers/purchaseSlice";
import { setFollowerOnly } from "@/redux/reducers/followerOnlySlice";
import { setSecondaryComment } from "@/redux/reducers/secondaryCommentSlice";

const Comments: FunctionComponent<CommentsProps> = ({
  commentors,
  video,
  getMorePostComments,
  commentsLoading,
  hasMoreComments,
  mirrorCommentLoading,
  likeCommentLoading,
  collectCommentLoading,
  mirrorComment,
  collectComment,
  likeComment,
  dispatch,
  hasMirrored,
  hasReacted,
  lensProfile,
  authStatus,
  commentId,
  router,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col bg-verde">
      <div className="relative w-full h-28  bg-offBlack">
        <div className="relative p-2 w-full h-full border border-white flex flex-col items-center gap-2 overflow-y-scroll">
          <div className="relative w-full h-fit flex flex-row items-center justify-start gap-2">
            <div className="relative w-fit h-1/2 flex justify-start">
              <Image
                src={`${INFURA_GATEWAY}/ipfs/QmfXzGt2RHdEfwgiLiYqEmdsDdSHm1SBdq1Cpys1gHTe5s`}
                height={5}
                width={10}
                alt="stripes"
                draggable={false}
              />
            </div>
            <div
              className="relative w-full h-fit text-lg font-arcade flex justify-start break-words"
              id={`record1`}
            >
              {video?.metadata?.content?.split("\n\n")[0]}
            </div>
          </div>
          <div
            className="relative w-full h-full flex font-arcade text-sm text-white whitespace-preline"
            dangerouslySetInnerHTML={{
              __html: video?.metadata?.content
                ?.split("\n\n")
                .slice(1)
                .join("<br><br>"),
            }}
          />
        </div>
      </div>
      <div className="relative w-full h-[15rem] xl:h-[27.7rem] border-white border bg-offBlack overflow-y-scroll">
        {commentId !== "" && (
          <div className="sticky z-0 w-full h-10 flex flex-col items-center justify-start px-3 bg-offBlack">
            <div
              className="relative w-full h-full flex items-center cursor-pointer"
              onClick={() => {
                dispatch(setSecondaryComment(""));
              }}
            >
              <AiFillFastBackward color="white" size={20} />
            </div>
          </div>
        )}
        {commentsLoading ? (
          <div className="relative w-full h-full justify-center items-center flex">
            <FetchMoreLoading size="6" />
          </div>
        ) : !commentsLoading && commentors?.length < 1 ? (
          <div className="relative text-white font-arcade w-full h-full justify-center items-center py-3 flex text-center">
            <div className="relative w-3/4 h-full items-start justify-center flex">
              {commentId !== ""
                ? "Reply to this comment in the message box"
                : "Be the first to comment on this stream :)"}
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full grid grid-flow-row auto-rows-auto gap-5">
            <InfiniteScroll
              className={`relative row-start-1 w-full h-full overflow-y-scroll`}
              hasMore={hasMoreComments}
              height={"27.7rem"}
              loader={<FetchMoreLoading size="3" />}
              dataLength={commentors?.length}
              next={getMorePostComments}
            >
              <div className="relative w-full h-fit grid grid-flow-row auto-rows-auto gap-3">
                {commentors?.map((comment: any, index: number) => {
                  const profileImage = createProfilePicture(comment, true);
                  return (
                    <div
                      key={index}
                      className="relative w-full h-fit flex flex-row font-arcade text-sm items-start gap-3 p-3"
                    >
                      <div
                        className="relative w-fit h-full flex items-start justify-start cursor-pointer"
                        onClick={() => {
                          router.push(
                            `https://www.chromadin.xyz/#chat?option=history&profile=${
                              comment?.profile?.handle?.split(".lens")[0]
                            }`
                          );
                        }}
                      >
                        <div
                          className="relative w-6 h-6 border border-white"
                          id="crt"
                        >
                          {profileImage !== "" && (
                            <Image
                              objectFit="cover"
                              alt="pfp"
                              layout="fill"
                              className="relative w-full h-full flex"
                              src={profileImage}
                              draggable={false}
                            />
                          )}
                        </div>
                      </div>
                      <div className="relative w-full h-full flex flex-col gap-2">
                        <div
                          className="relative w-full h-full text-ama justify-start flex cursor-pointer"
                          onClick={() => {
                            router.push(
                              `https://www.chromadin.xyz/#chat?option=history&profile=${
                                comment?.profile?.handle?.split(".lens")[0]
                              }`
                            );
                          }}
                        >
                          @{comment?.profile?.handle?.split(".lens")[0]}
                        </div>
                        <div className="relative w-full h-full text-verde flex flex-col">
                          <div
                            className="relative w-full h-full flex"
                            dangerouslySetInnerHTML={{
                              __html: descriptionRegex(
                                comment?.metadata?.content
                              ),
                            }}
                          ></div>
                          <div className="relative w-44 h-fit overflow-x-scroll grid grid-flow-col auto-cols-auto gap-3 z-10">
                            {comment?.metadata?.media?.map(
                              (media: MediaSet, index: number) => {
                                let formattedImageURL: string;
                                if (media?.original?.url?.includes("ipfs://")) {
                                  formattedImageURL = `${INFURA_GATEWAY}/ipfs/${
                                    media?.original?.url?.split("://")[1]
                                  }`;
                                } else {
                                  formattedImageURL = media?.original?.url;
                                }
                                return (
                                  <div
                                    key={index}
                                    className="relative w-24 h-24 grid grid-flow-col auto-cols-auto"
                                  >
                                    {!media?.original?.mimeType.includes(
                                      "video"
                                    ) ? (
                                      <Image
                                        src={formattedImageURL}
                                        layout="fill"
                                        objectFit="cover"
                                        draggable={false}
                                        className="rounded-lg"
                                      />
                                    ) : formattedImageURL.includes("index") ? (
                                      <div className="rounded-md absolute w-full h-full object-cover">
                                        <ReactPlayer
                                          url={formattedImageURL}
                                          controls={true}
                                          muted={true}
                                          playsinline
                                          loop
                                          style={{
                                            borderRadius: "0.375rem",
                                            objectFit: "cover",
                                          }}
                                          width="100%"
                                          height="100%"
                                          className="rounded-md"
                                        />
                                      </div>
                                    ) : (
                                      <video
                                        muted
                                        controls
                                        playsInline
                                        autoPlay
                                        loop
                                        className="rounded-md absolute w-full h-full object-cover"
                                      >
                                        <source
                                          src={formattedImageURL}
                                          type="video/mp4"
                                        />
                                      </video>
                                    )}
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                        <div className="relative w-full h-full text-moda justify-start flex">
                          {moment(`${comment?.createdAt}`).fromNow()}
                        </div>
                      </div>
                      <div className="relative grid grid-rows-2 w-full h-full gap-2 items-end justify-end flex-wrap">
                        <div className="relative w-full h-full grid grid-cols-2 gap-2 items-center justify-end">
                          <div
                            className={`relative w-full h-full grid grid-flow-col auto-cols-auto items-center justify-end flex-row gap-2 ${
                              lensProfile && authStatus && "cursor-pointer"
                            }`}
                            onClick={() => likeComment(comment?.id)}
                          >
                            {likeCommentLoading[index] ? (
                              <AiOutlineLoading
                                size={9}
                                color="white"
                                className={`${
                                  likeCommentLoading?.[index] && "animate-spin"
                                }
                                `}
                              />
                            ) : hasReacted?.[index] ? (
                              <Image
                                src={`${INFURA_GATEWAY}/ipfs/Qmc3KCKWRgN8iKwwAPM5pYkAYNeVwWu3moa5RDMDTBV6ZS`}
                                width={12}
                                height={12}
                                alt="mirror"
                                draggable={false}
                              />
                            ) : (
                              <Image
                                src={`${INFURA_GATEWAY}/ipfs/QmSX1Y5cKp8p53jv2CnfQBuhu3dgLANjZMTyAMKtgFtvV6`}
                                width={12}
                                height={12}
                                alt="backward"
                                draggable={false}
                              />
                            )}
                            <div className="relative w-fit h-fit font-arcade text-xs text-white flex">
                              {comment?.stats?.totalUpvotes}
                            </div>
                          </div>
                          <div
                            className={`relative w-full h-full grid grid-flow-col auto-cols-auto items-center justify-end flex-row gap-2 cursor-pointer`}
                            onClick={() =>
                              dispatch(setSecondaryComment(comment?.id))
                            }
                          >
                            <Image
                              src={`${INFURA_GATEWAY}/ipfs/QmeuR9Fzv8QF9R6ntjGKB78GteQgmEcXhBfVPhsTyWbumA`}
                              width={12}
                              height={12}
                              alt="backward"
                              draggable={false}
                            />
                            <div className="relative w-fit h-fit font-arcade text-xs text-white flex">
                              {comment?.stats?.totalAmountOfComments}
                            </div>
                          </div>
                        </div>
                        <div className="relative w-full h-full grid grid-cols-2 gap-2 items-center justify-end">
                          <div
                            className={`relative w-full h-full grid grid-flow-col auto-cols-auto items-center justify-end flex-row gap-2 ${
                              comment?.collectModule?.type !==
                                "RevertCollectModule" &&
                              authStatus &&
                              lensProfile &&
                              "cursor-pointer"
                            }`}
                            onClick={
                              comment?.collectModule?.type ===
                              "RevertCollectModule"
                                ? () => {}
                                : comment?.collectModule?.followerOnly &&
                                  !comment?.profile?.isFollowedByMe
                                ? () =>
                                    dispatch(
                                      setFollowerOnly({
                                        actionOpen: true,
                                        actionFollowerId: comment?.profile?.id,
                                        actionId: comment?.id,
                                        actionIndex: index,
                                      })
                                    )
                                : comment?.collectModule?.type ===
                                    "FreeCollectModule" ||
                                  ((comment?.collectModule?.__typename ===
                                    "SimpleCollectModuleSettings" ||
                                    comment?.collectModule?.type ===
                                      "SimpleCollectModule") &&
                                    !comment?.collectModule?.amount &&
                                    !comment?.collectModule
                                      ?.optionalCollectLimit &&
                                    !comment?.collectModule
                                      ?.optionalEndTimestamp)
                                ? () => collectComment(comment?.id)
                                : () =>
                                    dispatch(
                                      setPurchase({
                                        actionOpen: true,
                                        actionId: comment?.id,
                                        actionIndex: index,
                                      })
                                    )
                            }
                          >
                            {collectCommentLoading[index] ? (
                              <AiOutlineLoading
                                size={9}
                                color="white"
                                className={`${
                                  collectCommentLoading?.[index] &&
                                  "animate-spin"
                                }
                                `}
                              />
                            ) : comment?.hasCollectedByMe ? (
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
                            <div className="relative w-fit h-fit font-arcade text-xs text-white">
                              {comment?.stats?.totalAmountOfCollects}
                            </div>
                          </div>
                          <div
                            className={`relative w-full h-full grid grid-flow-col auto-cols-auto items-center justify-end flex-row gap-2 ${
                              lensProfile && authStatus && "cursor-pointer"
                            }`}
                            onClick={() => mirrorComment(comment?.id)}
                          >
                            {mirrorCommentLoading?.[index] ? (
                              <AiOutlineLoading
                                size={9}
                                color="white"
                                className={`${
                                  mirrorCommentLoading?.[index] &&
                                  "animate-spin"
                                }
                                `}
                              />
                            ) : hasMirrored?.[index] ? (
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
                            <div className="relative w-fit h-fit font-arcade text-xs text-white">
                              {comment?.stats?.totalAmountOfMirrors}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </InfiniteScroll>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
