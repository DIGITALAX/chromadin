import { Publication } from "@/components/Home/types/lens.types";
import { setProfile } from "@/redux/reducers/profileSlice";
import { FunctionComponent } from "react";
import { AiFillFastBackward } from "react-icons/ai";
import InfiniteScroll from "react-infinite-scroll-component";
import MakeComment from "./MakeComment";
import FeedPublication from "./FeedPublication";
import { ProfileFeedProps } from "../types/wavs.types";

const ProfileFeed: FunctionComponent<ProfileFeedProps> = ({
  dispatch,
  hasMoreProfile,
  fetchMoreProfile,
  profileDispatch,
  setScrollPos,
  profileRef,
  feedType,
  scrollPos,
  profileAmounts,
  collectPost,
  mirrorPost,
  reactPost,
  commentPost,
  commentOpen,
  router,
  address,
  followerOnly,
  mirrorLoading,
  reactLoading,
  collectLoading,
  handleCommentDescription,
  textElement,
  commentDescription,
  profileId,
  videoLoading,
  handleSetGif,
  gifOpen,
  setGifOpen,
  postImagesDispatched,
  currencyDropDown,
  setCurrencyDropDown,
  setEnabledCurrency,
  commentLoading,
  caretCoord,
  mentionProfiles,
  profilesOpen,
  handleMentionClick,
  handleGif,
  handleGifSubmit,
  results,
  handleKeyDownDelete,
  handleLensSignIn,
  handleConnect,
  handleRemoveImage,
  uploadImages,
  setCollectibleDropDown,
  uploadVideo,
  imageLoading,
  mappedFeaturedFiles,
  value,
  collectOpen,
  setValue,
  limit,
  setLimit,
  collectibleDropDown,
  setCollectible,
  enabledCurrencies,
  audienceDropDown,
  audienceType,
  setAudienceDropDown,
  setAudienceType,
  setChargeCollect,
  referral,
  canComment,
  enabledCurrency,
  chargeCollect,
  chargeCollectDropDown,
  setChargeCollectDropDown,
  collectible,
  limitedDropDown,
  limitedEdition,
  setLimitedDropDown,
  setLimitedEdition,
  timeLimit,
  timeLimitDropDown,
  setTimeLimit,
  setTimeLimitDropDown,
  setReferral,
  collectNotif,
  audienceTypes,
  setCollectProfileLoading,
  setMirrorProfileLoading,
  setReactProfileLoading,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col items-start justify-start gap-4">
      <div className="relative flex flex-col items-start justify-start gap-3 h-full w-full">
        <div className="sticky z-0 w-full h-fit flex flex-col items-start justify-start mr-0">
          <div
            className="relative w-fit h-fit flex items-start cursor-pointer justify-start"
            onClick={() => router.push(router.asPath.split("?profile=")[0])}
          >
            <AiFillFastBackward color="white" size={20} />
          </div>
        </div>
        <InfiniteScroll
          height={"40rem"}
          loader={""}
          hasMore={hasMoreProfile}
          next={fetchMoreProfile}
          dataLength={profileDispatch?.length}
          className={`relative row-start-1 w-full ml-auto h-full max-w-full overflow-y-scroll`}
          style={{ color: "#131313", fontFamily: "Digi Reg" }}
          scrollThreshold={0.9}
          scrollableTarget={"scrollableDiv"}
          ref={profileRef}
          onScroll={(e: MouseEvent) => setScrollPos(e)}
          initialScrollY={feedType.value === "" ? scrollPos : 0}
        >
          <div className="w-full h-full relative flex flex-col gap-4 pb-3">
            {profileDispatch?.map((publication: Publication, index: number) => {
              return (
                <div
                  className="relative w-full h-fit gap-2 flex flex-col"
                  key={index}
                >
                  <FeedPublication
                    dispatch={dispatch}
                    publication={publication}
                    hasMirrored={profileAmounts.hasMirrored[index]}
                    hasReacted={profileAmounts.hasLiked?.[index]}
                    hasCollected={profileAmounts.hasCollected[index]}
                    followerOnly={followerOnly[index]}
                    collectPost={collectPost}
                    mirrorPost={mirrorPost}
                    reactPost={reactPost}
                    address={address}
                    index={index}
                    mirrorLoading={mirrorLoading[index]}
                    reactLoading={reactLoading[index]}
                    collectLoading={collectLoading[index]}
                    reactAmount={profileAmounts.like[index]}
                    mirrorAmount={profileAmounts.mirror[index]}
                    collectAmount={profileAmounts.collect[index]}
                    commentAmount={profileAmounts.comment[index]}
                    openComment={commentOpen}
                    feedType={feedType.value}
                    router={router}
                    setCollectLoader={setCollectProfileLoading}
                    setMirrorLoader={setMirrorProfileLoading}
                    setReactLoader={setReactProfileLoading}
                  />
                  {(publication?.__typename === "Mirror"
                    ? publication?.mirrorOf?.id
                    : publication?.id) === commentOpen && (
                    <MakeComment
                      commentPost={commentPost}
                      commentDescription={commentDescription}
                      textElement={textElement}
                      handleCommentDescription={handleCommentDescription}
                      commentLoading={commentLoading}
                      caretCoord={caretCoord}
                      mentionProfiles={mentionProfiles}
                      profilesOpen={profilesOpen}
                      handleMentionClick={handleMentionClick}
                      handleGifSubmit={handleGifSubmit}
                      handleGif={handleGif}
                      results={results}
                      handleSetGif={handleSetGif}
                      gifOpen={gifOpen}
                      setGifOpen={setGifOpen}
                      handleKeyDownDelete={handleKeyDownDelete}
                      handleLensSignIn={handleLensSignIn}
                      handleConnect={handleConnect}
                      handleRemoveImage={handleRemoveImage}
                      address={address}
                      profileId={profileId}
                      videoLoading={videoLoading}
                      uploadImages={uploadImages}
                      uploadVideo={uploadVideo}
                      imageLoading={imageLoading}
                      mappedFeaturedFiles={mappedFeaturedFiles}
                      collectOpen={collectOpen}
                      enabledCurrencies={enabledCurrencies}
                      audienceDropDown={audienceDropDown}
                      audienceType={audienceType}
                      setAudienceDropDown={setAudienceDropDown}
                      setAudienceType={setAudienceType}
                      value={value}
                      setChargeCollect={setChargeCollect}
                      setChargeCollectDropDown={setChargeCollectDropDown}
                      setCollectible={setCollectible}
                      setCollectibleDropDown={setCollectibleDropDown}
                      setCurrencyDropDown={setCurrencyDropDown}
                      setEnabledCurrency={setEnabledCurrency}
                      setLimit={setLimit}
                      setLimitedDropDown={setLimitedDropDown}
                      setLimitedEdition={setLimitedEdition}
                      setReferral={setReferral}
                      setTimeLimit={setTimeLimit}
                      setTimeLimitDropDown={setTimeLimitDropDown}
                      setValue={setValue}
                      enabledCurrency={enabledCurrency}
                      chargeCollect={chargeCollect}
                      chargeCollectDropDown={chargeCollectDropDown}
                      limit={limit}
                      limitedDropDown={limitedDropDown}
                      limitedEdition={limitedEdition}
                      timeLimit={timeLimit}
                      timeLimitDropDown={timeLimitDropDown}
                      audienceTypes={audienceTypes}
                      referral={referral}
                      canComment={canComment}
                      collectNotif={collectNotif}
                      collectible={collectible}
                      collectibleDropDown={collectibleDropDown}
                      commentId={commentOpen}
                      currencyDropDown={currencyDropDown}
                      dispatch={dispatch}
                      postImagesDispatched={postImagesDispatched}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default ProfileFeed;
