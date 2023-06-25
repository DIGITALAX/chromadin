import { Publication } from "@/components/Home/types/lens.types";
import { FunctionComponent } from "react";
import { AiFillFastBackward } from "react-icons/ai";
import InfiniteScroll from "react-infinite-scroll-component";
import MakeComment from "./MakeComment";
import FeedPublication from "./FeedPublication";
import { ProfileFeedProps } from "../types/wavs.types";
import Account from "./Account";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { BiHomeHeart } from "react-icons/bi";

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
  profile,
  profileCollections,
  profileType,
  preElement,
  filterDecrypt,
  hasMoreDecryptProfile,
  scrollRefDecryptProfile,
  setScrollPosDecryptProfile,
  decryptFeedProfile,
  decryptProfileAmounts,
  decryptProfileScrollPos,
  fetchMoreProfileDecrypt,
  followerOnlyProfileDecrypt,
  handleImagePaste,
  profileCollectionsLoading,
}): JSX.Element => {
  const history = useSelector(
    (state: RootState) => state.app.historyURLReducer.value
  );
  return (
    <div className="relative w-full h-full flex flex-col items-start justify-start gap-4 max-w-full">
      <div className="relative flex flex-col items-start justify-start gap-3 h-full w-full">
        <div className="sticky z-0 w-full h-fit flex flex-row items-start justify-start mr-0 gap-2">
          <div
            className="relative w-fit h-fit flex items-start cursor-pointer justify-start"
            onClick={() => router.push(router.asPath.split("&profile=")[0])}
          >
            <BiHomeHeart color="white" size={18} />
          </div>
          <div
            className="relative w-fit h-fit flex items-start cursor-pointer justify-start"
            onClick={() => {
              history.includes("#chat") &&
              (history.includes("&profile=") || history.includes("&post="))
                ? router.push("#chat?option=history")
                : router.back();
            }}
          >
            <AiFillFastBackward color="white" size={20} />
          </div>
        </div>
        <Account
          dispatch={dispatch}
          profile={profile}
          profileCollections={profileCollections}
          profileCollectionsLoading={profileCollectionsLoading}
          router={router}
        />
        <InfiniteScroll
          height={"40rem"}
          loader={""}
          hasMore={filterDecrypt ? hasMoreDecryptProfile : hasMoreProfile}
          next={filterDecrypt ? fetchMoreProfileDecrypt : fetchMoreProfile}
          dataLength={
            filterDecrypt ? decryptFeedProfile?.length : profileDispatch?.length
          }
          className={`relative row-start-1 w-full ml-auto h-full max-w-full overflow-y-scroll`}
          style={{ color: "#131313", fontFamily: "Digi Reg" }}
          scrollThreshold={0.9}
          scrollableTarget={"scrollableDiv"}
          ref={filterDecrypt ? scrollRefDecryptProfile : profileRef}
          onScroll={
            filterDecrypt
              ? (e: MouseEvent) => setScrollPosDecryptProfile(e)
              : (e: MouseEvent) => setScrollPos(e)
          }
          initialScrollY={
            feedType === ""
              ? decryptProfileAmounts
                ? decryptProfileScrollPos
                : scrollPos
              : 0
          }
        >
          <div className="w-full h-full relative flex flex-col gap-4 pb-3">
            {(filterDecrypt ? decryptFeedProfile : profileDispatch)?.map(
              (publication: Publication, index: number) => {
                return (
                  <div
                    className="relative w-full h-fit gap-2 flex flex-col"
                    key={index}
                  >
                    <FeedPublication
                      dispatch={dispatch}
                      publication={publication}
                      hasMirrored={
                        filterDecrypt
                          ? decryptProfileAmounts.hasMirrored[index]
                          : profileAmounts.hasMirrored[index]
                      }
                      hasReacted={
                        filterDecrypt
                          ? decryptProfileAmounts.hasLiked[index]
                          : profileAmounts.hasLiked?.[index]
                      }
                      hasCollected={
                        filterDecrypt
                          ? decryptProfileAmounts.hasCollected[index]
                          : profileAmounts.hasCollected[index]
                      }
                      followerOnly={
                        filterDecrypt
                          ? followerOnlyProfileDecrypt[index]
                          : followerOnly[index]
                      }
                      collectPost={collectPost}
                      mirrorPost={mirrorPost}
                      reactPost={reactPost}
                      address={address}
                      index={index}
                      mirrorLoading={
                        filterDecrypt
                          ? mirrorLoading[index]
                          : mirrorLoading[index]
                      }
                      reactLoading={
                        filterDecrypt
                          ? reactLoading[index]
                          : reactLoading[index]
                      }
                      collectLoading={
                        filterDecrypt
                          ? collectLoading[index]
                          : collectLoading[index]
                      }
                      reactAmount={
                        filterDecrypt
                          ? decryptProfileAmounts.like[index]
                          : profileAmounts.like[index]
                      }
                      mirrorAmount={
                        filterDecrypt
                          ? decryptProfileAmounts.mirror[index]
                          : profileAmounts.mirror[index]
                      }
                      collectAmount={
                        filterDecrypt
                          ? decryptProfileAmounts.collect[index]
                          : profileAmounts.collect[index]
                      }
                      commentAmount={
                        filterDecrypt
                          ? decryptProfileAmounts.comment[index]
                          : profileAmounts.comment[index]
                      }
                      openComment={commentOpen}
                      feedType={feedType}
                      router={router}
                      setCollectLoader={setCollectProfileLoading}
                      setMirrorLoader={setMirrorProfileLoading}
                      setReactLoader={setReactProfileLoading}
                      profileType={profileType}
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
                        preElement={preElement}
                        handleImagePaste={handleImagePaste}
                      />
                    )}
                  </div>
                );
              }
            )}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default ProfileFeed;
