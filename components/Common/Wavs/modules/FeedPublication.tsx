import { MediaSet } from "@/components/Home/types/lens.types";
import Profile from "./Profile";
import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { AiFillEye, AiOutlineRetweet } from "react-icons/ai";
import { FunctionComponent } from "react";
import { FeedPublicationProps } from "../types/wavs.types";
import { setImageFeedViewer } from "@/redux/reducers/imageFeedViewerSlice";
import descriptionRegex from "@/lib/helpers/descriptionRegex";
import { FaRegCommentDots } from "react-icons/fa";

const FeedPublication: FunctionComponent<FeedPublicationProps> = ({
  publication,
  dispatch,
  hasReacted,
  hasMirrored,
  followerOnly,
  height,
  address,
  collectPost,
  reactPost,
  mirrorPost,
  index,
  collectLoading,
  mirrorLoading,
  reactLoading,
  reactAmount,
  mirrorAmount,
  collectAmount,
  commentAmount,
  hasCollected,
  feedType,
  setCollectLoader,
  setReactLoader,
  setMirrorLoader,
  openComment,
  router,
  profileType,
}): JSX.Element => {
  return (
    <div
      className={`relative w-full ${
        height ? "h-full" : "h-fit"
      } flex flex-row flex-wrap sm:flex-nowrap gap-6 rounded-md z-0`}
      data-post-id={publication?.id}
      id={publication?.id}
    >
      <Profile
        publication={publication}
        followerOnly={followerOnly}
        dispatch={dispatch}
        hasMirrored={hasMirrored}
        hasReacted={hasReacted}
        collectPost={collectPost}
        reactPost={reactPost}
        mirrorPost={mirrorPost}
        address={address}
        index={index}
        collectLoading={collectLoading}
        reactLoading={reactLoading}
        mirrorLoading={mirrorLoading}
        reactAmount={reactAmount}
        mirrorAmount={mirrorAmount}
        collectAmount={collectAmount}
        commentAmount={commentAmount}
        hasCollected={hasCollected}
        setCollectLoader={setCollectLoader}
        setReactLoader={setReactLoader}
        setMirrorLoader={setMirrorLoader}
        openComment={openComment}
        feedType={feedType}
        router={router}
        profileType={profileType}
      />
      <div
        className={`relative w-full h-auto grow rounded-md grid grid-flow-row auto-rows-auto p-3 preG:p-6 gap-6 border-2 border-black bg-gradient-to-r from-offBlack via-gray-600 to-black`}
      >
        {(publication?.__typename === "Mirror" ||
          publication?.__typename === "Comment") && (
          <div
            className={`relative w-fit h-fit row-start-1 justify-self-end self-center grid grid-flow-col auto-cols-auto gap-2 ${
              publication?.__typename === "Comment" && "cursor-pointer"
            }`}
            onClick={() =>
              publication?.__typename === "Comment" &&
              router.push(
                router.asPath.includes("&post=")
                  ? router.asPath.split("&post=")[0] +
                      `&post=${publication?.mainPost?.id}`
                  : router.asPath.includes("&profile=")
                  ? router.asPath.split("&profile=")[0] +
                    `&post=${publication?.mainPost?.id}`
                  : router.asPath + `&post=${publication?.mainPost?.id}`
              )
            }
          >
            <div
              className={`relative w-fit h-fit col-start-1 place-self-center text-xs font-dosis text-offWhite`}
            >
              {publication?.__typename === "Mirror"
                ? `Mirrored by @${publication?.profile?.handle}`
                : `Comment of ${
                    (publication as any)?.mainPost?.metadata?.content?.slice(
                      0,
                      10
                    ) + "..."
                  }`}
            </div>
            <div className="relative w-fit h-fit col-start-2 place-self-center">
              {publication?.__typename === "Mirror" ? (
                <AiOutlineRetweet color={"red"} size={15} />
              ) : (
                <FaRegCommentDots color={"red"} size={15} />
              )}
            </div>
          </div>
        )}
        <div
          className={`${
            publication?.__typename === "Mirror" ||
            publication?.__typename === "Comment"
              ? "row-start-2"
              : "row-start-1"
          } relative w-full h-fit text-left font-dosis grid grid-flow-row auto-rows-auto gap-6`}
        >
          <div
            className={`relative w-full h-fit row-start-1 relative h-fit text-white font-dosis self-center justify-self-start break-all preG:break-words`}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: descriptionRegex(
                  publication?.__typename !== "Mirror"
                    ? publication?.metadata?.content
                    : publication?.mirrorOf?.metadata?.content
                ),
              }}
              className="relative place-self-center whitespace-preline break-all preG:break-words"
            ></div>
          </div>
        </div>
        <div
          className={`relative w-fit max-w-full h-fit rounded-lg overflow-x-scroll grid grid-flow-col auto-cols-auto gap-3 z-10 ${
            publication?.__typename === "Mirror" ||
            publication?.__typename === "Comment"
              ? "row-start-3"
              : "row-start-2"
          }`}
        >
          {(publication?.__typename === "Mirror"
            ? publication?.mirrorOf?.metadata?.media
            : publication?.metadata?.media
          )?.map((image: MediaSet | string, index: number) => {
            let formattedImageURL: string;

            if ((image as MediaSet).original.url.includes("ipfs://")) {
              formattedImageURL = `${INFURA_GATEWAY}/ipfs/${
                (image as MediaSet).original.url?.split("ipfs://")[1]
              }`;
            } else {
              formattedImageURL = (image as MediaSet).original.url;
            }

            return (
              <div
                key={index}
                className={`relative w-40 h-40 preG:w-60 preG:h-60 border-2 border-black rounded-lg bg-black grid grid-flow-col auto-cols-auto col-start-${
                  index + 1
                } cursor-pointer hover:opacity-70 active:scale-95`}
                onClick={() =>
                  dispatch(
                    setImageFeedViewer({
                      actionType: (image as MediaSet).original.mimeType,
                      actionOpen: true,
                      actionImage: formattedImageURL,
                    })
                  )
                }
              >
                <div className="relative w-full h-full col-start-1 flex">
                  {(image as MediaSet)?.original?.mimeType !== "video/mp4" ? (
                    <Image
                      src={
                        (image as MediaSet)?.original?.mimeType ===
                          "image/png" ||
                        (image as MediaSet)?.original?.mimeType ===
                          "image/webp" ||
                        (image as MediaSet)?.original?.mimeType ===
                          "image/jpg" ||
                        (image as MediaSet)?.original?.mimeType === "image/jpeg"
                          ? formattedImageURL
                          : (image as MediaSet)?.original?.url
                      }
                      layout="fill"
                      objectFit="cover"
                      objectPosition={"center"}
                      className="rounded-md"
                      draggable={false}
                    />
                  ) : (
                    <video
                      muted
                      controls
                      className="rounded-md absolute w-full h-full object-cover"
                    >
                      <source src={formattedImageURL} type="video/mp4" />
                    </video>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div
          className={`relative w-full h-full ${
            publication?.__typename === "Mirror" ||
            publication?.__typename === "Comment"
              ? "row-start-4"
              : "row-start-3"
          } grid grid-flow-col auto-cols-auto`}
        >
          {feedType !==
            (publication?.__typename !== "Mirror"
              ? publication?.id
              : publication?.mirrorOf.id) && (
            <div
              className={`relative w-fit h-full col-start-1 row-start-1 sm:col-start-2 sm:pt-0 pt-3 justify-self-end self-center grid grid-flow-col auto-cols-auto font-digi gap-1 cursor-pointer hover:opacity-70 active:scale-95 text-white`}
              onClick={() =>
                router.push(
                  router.asPath.includes("&post=")
                    ? router.asPath.split("&post=")[0] +
                        `&post=${
                          publication?.__typename !== "Mirror"
                            ? publication?.id
                            : publication?.mirrorOf.id
                        }`
                    : router.asPath.includes("&profile=")
                    ? router.asPath.split("&profile=")[0] +
                      `&post=${
                        publication?.__typename !== "Mirror"
                          ? publication?.id
                          : publication?.mirrorOf.id
                      }`
                    : router.asPath +
                      `&post=${
                        publication?.__typename !== "Mirror"
                          ? publication?.id
                          : publication?.mirrorOf.id
                      }`
                )
              }
            >
              <div className="relative w-fit h-fit self-end col-start-1 text-sm">
                {publication?.__typename !== "Comment"
                  ? "View Post"
                  : "View Comment"}
              </div>
              <div className="relative w-fit h-fit col-start-2 self-end">
                <AiFillEye color={"white"} size={20} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedPublication;
