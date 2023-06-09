import { FunctionComponent } from "react";
import {
  BsSuitHeartFill,
  BsSuitHeart,
  BsCollection,
  BsFillCollectionFill,
} from "react-icons/bs";
import { FaRegCommentDots } from "react-icons/fa";
import {
  AiOutlineLoading,
  AiOutlineMinusCircle,
  AiOutlineRetweet,
} from "react-icons/ai";
import { ReactionProps } from "../types/wavs.types";
import { setFollowerOnly } from "@/redux/reducers/followerOnlySlice";
import { setPurchase } from "@/redux/reducers/purchaseSlice";
import handleHidePost from "@/lib/helpers/handleHidePost";
import { setReactionState } from "@/redux/reducers/reactionStateSlice";
import { setOpenComment } from "@/redux/reducers/openCommentSlice";

const Reactions: FunctionComponent<ReactionProps> = ({
  textColor,
  commentColor,
  mirrorColor,
  heartColor,
  collectColor,
  dispatch,
  publication,
  hasMirrored,
  hasReacted,
  followerOnly,
  address,
  collectPost,
  mirrorPost,
  reactPost,
  index,
  mirrorLoading,
  reactLoading,
  collectLoading,
  hasCollected,
  reactAmount,
  collectAmount,
  mirrorAmount,
  commentAmount,
  setCollectLoader,
  setReactLoader,
  setMirrorLoader,
  openComment,
  feedType,
  profileType,
  router,
}): JSX.Element => {
  return (
    <div
      className={`relative w-fit h-fit col-start-1 justify-self-center grid grid-flow-col auto-cols-auto gap-4`}
    >
      <div className="relative w-fit h-fit col-start-1 row-start-1 grid grid-flow-col auto-cols-auto gap-2 place-self-center">
        <div
          className={`relative w-fit h-fit col-start-1 place-self-center cursor-pointer hover:opacity-70 active:scale-95 ${
            reactLoading && "animate-spin"
          }`}
          onClick={() =>
            !reactLoading &&
            reactPost(
              publication?.__typename !== "Mirror"
                ? publication?.id
                : publication?.mirrorOf.id,
              setReactLoader,
              feedType !== "" ||
                (profileType !== "" && profileType !== undefined)
                ? index
                : undefined,
              publication?.__typename === "Mirror" ? publication?.id : undefined
            )
          }
        >
          {reactLoading ? (
            <AiOutlineLoading size={15} color={heartColor} />
          ) : reactAmount > 0 && hasReacted ? (
            <BsSuitHeartFill size={15} color={heartColor} />
          ) : (
            <BsSuitHeart color={heartColor} size={15} />
          )}
        </div>
        <div
          className={`relative w-fit h-fit col-start-2 text-${textColor} font-dosis text-xs place-self-center ${
            reactAmount > 0 && "cursor-pointer"
          }`}
          onClick={() =>
            reactAmount > 0 &&
            dispatch(
              setReactionState({
                actionOpen: true,
                actionType: "heart",
                actionValue:
                  publication?.__typename === "Mirror"
                    ? publication?.mirrorOf?.id
                    : publication?.id,
                actionResponseReact: hasReacted,
              })
            )
          }
        >
          {reactAmount}
        </div>
      </div>
      <div
        className={`relative w-fit h-fit row-start-1 col-start-2 grid grid-flow-col auto-cols-auto gap-2 place-self-center`}
      >
        <div
          className={`relative w-fit h-fit col-start-1 place-self-center cursor-pointer hover:opacity-70 active:scale-95 ${
            followerOnly && "opacity-50"
          }`}
          onClick={() =>
            dispatch(
              setOpenComment(
                openComment !==
                  (publication?.__typename !== "Mirror"
                    ? publication?.id
                    : publication?.mirrorOf.id)
                  ? publication?.__typename !== "Mirror"
                    ? publication?.id
                    : publication?.mirrorOf.id
                  : ""
              )
            )
          }
        >
          <FaRegCommentDots color={commentColor} size={15} />
        </div>
        <div
          className={`relative w-fit h-fit col-start-2 text-${textColor} font-dosis text-xs place-self-center ${
            commentAmount > 0 && "cursor-pointer"
          }`}
          onClick={() =>
            commentAmount > 0 &&
            router.push(
              router.asPath.includes("&post=")
                ? router.asPath.includes("?option=")
                  ? router.asPath.split("&post=")[0] +
                    `&post=${
                      publication?.__typename !== "Mirror"
                        ? publication?.id
                        : publication?.mirrorOf.id
                    }`
                  : router.asPath.split("&post=")[0] +
                    `?option=history&post=${
                      publication?.__typename !== "Mirror"
                        ? publication?.id
                        : publication?.mirrorOf.id
                    }`
                : router.asPath.includes("&profile=")
                ? router.asPath.includes("?option=")
                  ? router.asPath.split("&profile=")[0] +
                    `&post=${
                      publication?.__typename !== "Mirror"
                        ? publication?.id
                        : publication?.mirrorOf.id
                    }`
                  : router.asPath.split("&profile=")[0] +
                    `?option=history&post=${
                      publication?.__typename !== "Mirror"
                        ? publication?.id
                        : publication?.mirrorOf.id
                    }`
                : router.asPath.includes("?option=")
                ? router.asPath +
                  `&post=${
                    publication?.__typename !== "Mirror"
                      ? publication?.id
                      : publication?.mirrorOf.id
                  }`
                : router.asPath +
                  `?option=history&post=${
                    publication?.__typename !== "Mirror"
                      ? publication?.id
                      : publication?.mirrorOf.id
                  }`
            )
          }
        >
          {commentAmount}
        </div>
      </div>
      <div
        className={`relative w-fit h-fit row-start-2 col-start-1 grid grid-flow-col auto-cols-auto gap-2 place-self-center`}
      >
        <div
          className={`relative w-fit h-fit col-start-1 place-self-center cursor-pointer hover:opacity-70 active:scale-95 ${
            followerOnly && "opacity-50"
          } ${mirrorLoading && "animate-spin"}`}
          onClick={() =>
            !mirrorLoading &&
            mirrorPost(
              publication?.__typename !== "Mirror"
                ? publication?.id
                : publication?.mirrorOf.id,
              setMirrorLoader,
              feedType !== "" ||
                (profileType !== "" && profileType !== undefined)
                ? index
                : undefined,
              publication?.__typename === "Mirror" ? publication?.id : undefined
            )
          }
        >
          {mirrorLoading ? (
            <AiOutlineLoading size={15} color={mirrorColor} />
          ) : (
            <AiOutlineRetweet
              color={mirrorAmount > 0 && hasMirrored ? "red" : mirrorColor}
              size={15}
            />
          )}
        </div>
        <div
          className={`relative w-fit h-fit col-start-2 text-${textColor} font-dosis text-xs place-self-center  ${
            mirrorAmount && "cursor-pointer"
          }`}
          onClick={() =>
            mirrorAmount > 0 &&
            dispatch(
              setReactionState({
                actionOpen: true,
                actionType: "mirror",
                actionValue:
                  publication?.__typename === "Mirror"
                    ? publication?.mirrorOf?.id
                    : publication?.id,
                actionResponseMirror: hasMirrored,
                actionFollower: followerOnly,
              })
            )
          }
        >
          {mirrorAmount}
        </div>
      </div>
      {(publication?.collectModule?.__typename !== "RevertCollectModuleSettings"
        ? true
        : false) && (
        <div
          className={`relative w-fit h-fit row-start-2 col-start-2 grid grid-flow-col auto-cols-auto gap-2 place-self-center`}
        >
          <div
            className={`relative w-fit h-fit col-start-1 place-self-center cursor-pointer hover:opacity-70 active:scale-95 ${
              collectLoading && "animate-spin"
            }`}
            onClick={
              publication?.collectModule?.type === "RevertCollectModule" ||
              collectLoading
                ? () => {}
                : (publication?.collectModule as any)?.followerOnly &&
                  !publication?.profile?.isFollowedByMe
                ? () =>
                    dispatch(
                      setFollowerOnly({
                        actionOpen: true,
                        actionFollowerId: publication?.profile?.id,
                        actionId: publication?.id,
                        actionIndex: index,
                      })
                    )
                : publication?.collectModule?.type === "FreeCollectModule" ||
                  publication?.collectModule?.__typename ===
                    "FreeCollectModuleSettings" ||
                  (((publication?.collectModule as any)?.__typename ===
                    "SimpleCollectModuleSettings" ||
                    publication?.collectModule?.type ===
                      "SimpleCollectModule") &&
                    !(publication?.collectModule as any)?.amount &&
                    !(publication?.collectModule as any)
                      ?.optionalCollectLimit &&
                    !(publication?.collectModule as any)?.optionalEndTimestamp)
                ? () =>
                    collectPost(
                      publication?.__typename !== "Mirror"
                        ? publication?.id
                        : publication?.mirrorOf.id,
                      setCollectLoader,
                      feedType !== "" ||
                        (profileType !== "" && profileType !== undefined)
                        ? index
                        : undefined,
                      publication?.__typename === "Mirror"
                        ? publication?.id
                        : undefined
                    )
                : () =>
                    dispatch(
                      setPurchase({
                        actionOpen: true,
                        actionId: publication?.id,
                        actionIndex: index,
                      })
                    )
            }
          >
            {collectLoading ? (
              <AiOutlineLoading size={15} color={collectColor} />
            ) : hasCollected ? (
              <BsFillCollectionFill size={15} color={collectColor} />
            ) : (
              <BsCollection size={15} color={collectColor} />
            )}
          </div>
          <div
            onClick={() =>
              collectAmount > 0 &&
              dispatch(
                setReactionState({
                  actionOpen: true,
                  actionType: "collect",
                  actionValue:
                    publication?.__typename === "Mirror"
                      ? publication?.mirrorOf?.id
                      : publication?.id,
                })
              )
            }
            className={`relative w-fit h-fit col-start-2 text-${textColor} font-dosis text-xs place-self-center ${
              collectAmount > 0 && "cursor-pointer"
            }`}
          >
            {collectAmount}
          </div>
        </div>
      )}
      {(publication?.profile?.ownedBy === address ? true : false) && (
        <div
          className={`relative w-fit h-fit row-start-3 col-start-1 col-span-2 grid grid-flow-col auto-cols-auto gap-2 place-self-center cursor-pointer active:scale-95`}
          onClick={() => handleHidePost(publication.id as string, dispatch)}
        >
          <AiOutlineMinusCircle color={textColor} size={15} />
        </div>
      )}
    </div>
  );
};

export default Reactions;
