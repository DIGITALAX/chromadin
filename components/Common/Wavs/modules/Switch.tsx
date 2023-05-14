import { FunctionComponent } from "react";
import AllPosts from "./AllPosts";
import ProfileFeed from "./ProfileFeed";
import { SwitchProps } from "../types/wavs.types";

const Switch: FunctionComponent<SwitchProps> = ({
  profile,
  profileRef,
  dispatch,
  hasMoreProfile,
  fetchMoreProfile,
  profileDispatch,
  setScrollPos,
  scrollPos,
  profileAmounts,
  collectPost,
  mirrorPost,
  reactPost,
  commentPost,
  commentOpen,
  router,
  address,
  followerOnlyProfile,
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
  setCollectible,
  setCollectibleDropDown,
  uploadVideo,
  imageLoading,
  setLimit,
  mappedFeaturedFiles,
  setChargeCollectDropDown,
  value,
  collectOpen,
  setValue,
  limit,
  collectibleDropDown,
  enabledCurrencies,
  audienceDropDown,
  audienceType,
  setAudienceDropDown,
  setAudienceType,
  setChargeCollect,
  referral,
  canComment,
  setLimitedDropDown,
  setLimitedEdition,
  enabledCurrency,
  chargeCollect,
  chargeCollectDropDown,
  collectible,
  limitedDropDown,
  limitedEdition,
  timeLimit,
  timeLimitDropDown,
  setTimeLimit,
  setTimeLimitDropDown,
  setReferral,
  collectNotif,
  audienceTypes,
  scrollRef,
  feedType,
  feedDispatch,
  followerOnly,
  hasMore,
  fetchMore,
  reactionAmounts,
  setCollectProfileLoading,
  setMirrorProfileLoading,
  setReactProfileLoading,
  collectProfileLoading,
  mirrorProfileLoading,
  reactProfileLoading,
  profileScroll,
  setProfileScroll,
  quickProfiles,
  profileCollections,
}): JSX.Element => {
  let action: string;

  const decideStringAction = () => {
    if (profile) {
      action = "profile";
    }
    return action;
  };

  switch (decideStringAction()) {
    case "profile":
      return (
        <ProfileFeed
          feedType={feedType}
          hasMoreProfile={hasMoreProfile}
          fetchMoreProfile={fetchMoreProfile}
          profileDispatch={profileDispatch}
          setScrollPos={setProfileScroll}
          scrollPos={profileScroll}
          profileAmounts={profileAmounts}
          collectPost={collectPost}
          mirrorPost={mirrorPost}
          reactPost={reactPost}
          commentPost={commentPost}
          commentOpen={commentOpen}
          router={router}
          address={address}
          followerOnly={followerOnlyProfile}
          mirrorLoading={mirrorProfileLoading}
          reactLoading={reactProfileLoading}
          collectLoading={collectProfileLoading}
          dispatch={dispatch}
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
          profileRef={profileRef}
          profileCollections={profileCollections}
          setCollectProfileLoading={setCollectProfileLoading}
          setMirrorProfileLoading={setMirrorProfileLoading}
          setReactProfileLoading={setReactProfileLoading}
          profile={profile}
        />
      );

    default:
      return (
        <AllPosts
          router={router}
          feedType={feedType}
          dispatch={dispatch}
          feedDispatch={feedDispatch}
          followerOnly={followerOnly}
          hasMore={hasMore}
          fetchMore={fetchMore}
          address={address!}
          collectPost={collectPost}
          reactPost={reactPost}
          mirrorPost={mirrorPost}
          reactLoading={reactLoading}
          collectLoading={collectLoading}
          mirrorLoading={mirrorLoading}
          reactionAmounts={reactionAmounts}
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
          scrollRef={scrollRef}
          setScrollPos={setScrollPos}
          scrollPos={scrollPos}
          quickProfiles={quickProfiles}
        />
      );
  }
};

export default Switch;
