import { FunctionComponent } from "react";
import { FeedProps } from "../types/wavs.types";
import Individual from "./Individual";
import Switch from "./Switch";
import MakePost from "./MakePost";

const Feed: FunctionComponent<FeedProps> = ({
  dispatch,
  followerOnly,
  feedDispatch,
  postsLoading,
  hasMore,
  fetchMore,
  address,
  collectPost,
  mirrorPost,
  reactPost,
  mirrorLoading,
  collectLoading,
  reactLoading,
  reactionAmounts,
  mainPost,
  followerOnlyMain,
  mainPostLoading,
  hasMoreComments,
  getMorePostComments,
  commentors,
  commentsLoading,
  reactCommentLoading,
  mirrorCommentLoading,
  collectCommentLoading,
  followerOnlyComments,
  commentAmounts,
  collectPostLoading,
  mirrorPostLoading,
  reactPostLoading,
  setMirrorCommentLoading,
  setCollectCommentLoading,
  setReactCommentLoading,
  setCollectPostLoading,
  setMirrorPostLoading,
  setReactPostLoading,
  commentOpen,
  commentPost,
  commentDescription,
  textElement,
  handleCommentDescription,
  commentLoading,
  caretCoord,
  mentionProfiles,
  profilesOpen,
  handleMentionClick,
  handleGifSubmit,
  handleGif,
  results,
  handleSetGif,
  gifOpen,
  setGifOpen,
  handleKeyDownDelete,
  collectNotif,
  referral,
  setCollectible,
  collectibleDropDown,
  setCollectibleDropDown,
  collectible,
  setAudienceDropDown,
  audienceType,
  audienceTypes,
  chargeCollect,
  limit,
  limitedEdition,
  audienceDropDown,
  setAudienceType,
  setTimeLimit,
  timeLimit,
  timeLimitDropDown,
  setTimeLimitDropDown,
  setLimitedEdition,
  limitedDropDown,
  setLimitedDropDown,
  setReferral,
  setLimit,
  setChargeCollect,
  setCurrencyDropDown,
  chargeCollectDropDown,
  setChargeCollectDropDown,
  enabledCurrencies,
  enabledCurrency,
  currencyDropDown,
  setEnabledCurrency,
  value,
  setValue,
  handleLensSignIn,
  handleConnect,
  handleRemoveImage,
  videoLoading,
  profileId,
  uploadImages,
  uploadVideo,
  imageLoading,
  collectOpen,
  mappedFeaturedFiles,
  canComment,
  postImagesDispatched,
  feedType,
  scrollRef,
  setScrollPos,
  scrollPos,
  individualAmounts,
  router,
  profile,
  fetchMoreProfile,
  followerOnlyProfile,
  hasMoreProfile,
  profileAmounts,
  profileDispatch,
  profileRef,
  setCollectProfileLoading,
  setMirrorProfileLoading,
  setReactProfileLoading,
  mirrorProfileLoading,
  collectProfileLoading,
  reactProfileLoading,
  profileLoading,
  setProfileScroll,
  profileScroll,
  quickProfiles,
  profileCollections,
  searchProfiles,
  profilesFound,
  profilesOpenSearch,
  fetchMoreSearch,
  hasMoreSearch,
  setProfilesFound,
  setProfilesOpenSearch,
  profileType,
}): JSX.Element => {
  return (
    <div className="relative w-3/4 h-fit flex flex-col items-start justify-start gap-4">
      <div className="relative w-full h-full flex flex-col items-start justify-center gap-3">
        <MakePost
          dispatch={dispatch}
          profileId={profileId}
          address={address}
        />
        {feedType !== "" ? (
          <Individual
            dispatch={dispatch}
            commentors={commentors}
            fetchMoreComments={getMorePostComments}
            commentsLoading={commentsLoading}
            mainPost={mainPost!}
            hasMoreComments={hasMoreComments}
            mirrorPost={mirrorPost}
            collectPost={collectPost}
            reactPost={reactPost}
            followerOnlyMain={followerOnlyMain}
            reactCommentLoading={reactCommentLoading}
            mirrorCommentLoading={mirrorCommentLoading}
            collectCommentLoading={collectCommentLoading}
            mainPostLoading={mainPostLoading}
            address={address}
            followerOnlyComments={followerOnlyComments}
            commentAmounts={commentAmounts}
            collectPostLoading={collectPostLoading}
            mirrorPostLoading={mirrorPostLoading}
            reactPostLoading={reactPostLoading}
            setMirrorCommentLoading={setMirrorCommentLoading}
            setCollectCommentLoading={setCollectCommentLoading}
            setReactCommentLoading={setReactCommentLoading}
            setCollectPostLoading={setCollectPostLoading}
            setMirrorPostLoading={setMirrorPostLoading}
            setReactPostLoading={setReactPostLoading}
            postAmounts={reactionAmounts}
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
            commentOpen={commentOpen}
            handleLensSignIn={handleLensSignIn}
            handleConnect={handleConnect}
            handleRemoveImage={handleRemoveImage}
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
            currencyDropDown={currencyDropDown}
            postImagesDispatched={postImagesDispatched}
            feedType={feedType}
            individualAmounts={individualAmounts}
            router={router}
            profileType={profileType}
          />
        ) : postsLoading || profileLoading ? (
          <div className="relative w-full h-full flex flex-col gap-4 overflow-y-scroll">
            {Array.from({ length: 3 }).map((_, index: number) => {
              return (
                <div
                  key={index}
                  className="relative w-full h-48 rounded-md animate-pulse border border-white min-w-full opacity-70"
                  id="staticLoad"
                ></div>
              );
            })}
          </div>
        ) : (
          <Switch
            dispatch={dispatch}
            followerOnly={followerOnly}
            feedDispatch={feedDispatch}
            hasMore={hasMore}
            fetchMore={fetchMore}
            address={address}
            collectPost={collectPost}
            mirrorPost={mirrorPost}
            reactPost={reactPost}
            mirrorLoading={mirrorLoading}
            collectLoading={collectLoading}
            reactLoading={reactLoading}
            reactionAmounts={reactionAmounts}
            commentOpen={commentOpen}
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
            collectNotif={collectNotif}
            referral={referral}
            setCollectible={setCollectible}
            collectibleDropDown={collectibleDropDown}
            collectible={collectible}
            setAudienceDropDown={setAudienceDropDown}
            audienceType={audienceType}
            audienceTypes={audienceTypes}
            chargeCollect={chargeCollect}
            limit={limit}
            limitedEdition={limitedEdition}
            audienceDropDown={audienceDropDown}
            setAudienceType={setAudienceType}
            setTimeLimit={setTimeLimit}
            timeLimit={timeLimit}
            timeLimitDropDown={timeLimitDropDown}
            setLimitedEdition={setLimitedEdition}
            limitedDropDown={limitedDropDown}
            setLimitedDropDown={setLimitedDropDown}
            setReferral={setReferral}
            setLimit={setLimit}
            setChargeCollect={setChargeCollect}
            setCurrencyDropDown={setCurrencyDropDown}
            chargeCollectDropDown={chargeCollectDropDown}
            setChargeCollectDropDown={setChargeCollectDropDown}
            enabledCurrencies={enabledCurrencies}
            enabledCurrency={enabledCurrency}
            currencyDropDown={currencyDropDown}
            setEnabledCurrency={setEnabledCurrency}
            value={value}
            setValue={setValue}
            handleLensSignIn={handleLensSignIn}
            handleConnect={handleConnect}
            handleRemoveImage={handleRemoveImage}
            videoLoading={videoLoading}
            profileId={profileId}
            uploadImages={uploadImages}
            uploadVideo={uploadVideo}
            imageLoading={imageLoading}
            collectOpen={collectOpen}
            mappedFeaturedFiles={mappedFeaturedFiles}
            canComment={canComment}
            postImagesDispatched={postImagesDispatched}
            feedType={feedType}
            scrollRef={scrollRef}
            setScrollPos={setScrollPos}
            scrollPos={scrollPos}
            router={router}
            profile={profile}
            setTimeLimitDropDown={setTimeLimitDropDown}
            setCollectibleDropDown={setCollectibleDropDown}
            fetchMoreProfile={fetchMoreProfile}
            hasMoreProfile={hasMoreProfile}
            followerOnlyProfile={followerOnlyProfile}
            profileRef={profileRef}
            profileDispatch={profileDispatch}
            profileAmounts={profileAmounts}
            setReactProfileLoading={setReactProfileLoading}
            setCollectProfileLoading={setCollectProfileLoading}
            setMirrorProfileLoading={setMirrorProfileLoading}
            mirrorProfileLoading={mirrorProfileLoading}
            reactProfileLoading={reactProfileLoading}
            collectProfileLoading={collectProfileLoading}
            setProfileScroll={setProfileScroll}
            profileScroll={profileScroll}
            quickProfiles={quickProfiles}
            profileCollections={profileCollections}
            searchProfiles={searchProfiles}
            profilesFound={profilesFound}
            profilesOpenSearch={profilesOpenSearch}
            fetchMoreSearch={fetchMoreSearch}
            hasMoreSearch={hasMoreSearch}
            setProfilesOpenSearch={setProfilesOpenSearch}
            setProfilesFound={setProfilesFound}
            profileType={profileType}
          />
        )}
      </div>
    </div>
  );
};

export default Feed;
