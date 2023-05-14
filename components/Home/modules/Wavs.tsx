import useCollectOptions from "@/components/Common/NFT/hooks/useCollectOptions";
import useImageUpload from "@/components/Common/NFT/hooks/useImageUpload";
import useConnect from "@/components/Common/SideBar/hooks/useConnect";
import useAllPosts from "@/components/Common/Wavs/hooks/useAllPosts";
import useComment from "@/components/Common/Wavs/hooks/useComment";
import useIndividual from "@/components/Common/Wavs/hooks/useIndividual";
import useProfileFeed from "@/components/Common/Wavs/hooks/useProfileFeed";
import useReactions from "@/components/Common/Wavs/hooks/useReactions";
import useSearch from "@/components/Common/Wavs/hooks/useSearch";
import Feed from "@/components/Common/Wavs/modules/Feed";
import { RootState } from "@/redux/store";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";

const Wavs: FunctionComponent = (): JSX.Element => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { address } = useAccount();

  const feedDispatch = useSelector(
    (state: RootState) => state.app.feedReducer.value
  );
  const reactionAmounts = useSelector(
    (state: RootState) => state.app.reactionFeedCountReducer
  );
  const feedType = useSelector((state: RootState) => state.app.feedTypeReducer);
  const commentAmounts = useSelector(
    (state: RootState) => state.app.commentFeedCountReducer
  );
  const commentOpen = useSelector(
    (state: RootState) => state.app.openCommentReducer.value
  );
  const canComment = useSelector(
    (state: RootState) => state.app.canCommentReducer.value
  );
  const collectOpen = useSelector(
    (state: RootState) => state.app.collectOpenReducer.value
  );
  const profileId = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const postImagesDispatched = useSelector(
    (state: RootState) => state.app.postImageReducer.value
  );
  const profile = useSelector(
    (state: RootState) => state.app.profileReducer.profile
  );
  const commentors = useSelector(
    (state: RootState) => state.app.commentReducer.value
  );
  const scrollPos = useSelector(
    (state: RootState) => state.app.scrollPosReducer.value
  );
  const profileScroll = useSelector(
    (state: RootState) => state.app.profileScrollPosReducer.value
  );
  const profileCollections = useSelector(
    (state: RootState) => state.app.collectionsReducer.value
  );
  const individualAmounts = useSelector(
    (state: RootState) => state.app.individualFeedCountReducer
  );
  const profileAmounts = useSelector(
    (state: RootState) => state.app.profileFeedCountReducer
  );
  const profileDispatch = useSelector(
    (state: RootState) => state.app.profileFeedReducer.value
  );
  const quickProfiles = useSelector(
    (state: RootState) => state.app.quickProfilesReducer.value
  );
  const profileType = useSelector(
    (state: RootState) => state.app.profileReducer.profile?.id
  );

  const { handleLensSignIn, handleConnect } = useConnect();
  const {
    followerOnly,
    postsLoading,
    hasMore,
    fetchMore,
    scrollRef,
    setScrollPos,
  } = useAllPosts();

  const {
    reactPost,
    collectPost,
    mirrorPost,
    reactFeedLoading,
    mirrorFeedLoading,
    collectFeedLoading,
  } = useReactions();

  const {
    getMorePostComments,
    hasMoreComments,
    commentsLoading,
    mainPostLoading,
    followerOnly: followerOnlyMain,
    mainPost,
    followerOnlyComments,
    reactCommentLoading,
    mirrorCommentLoading,
    collectCommentLoading,
    setMirrorCommentLoading,
    setCollectCommentLoading,
    setReactCommentLoading,
    setCollectPostLoading,
    setMirrorPostLoading,
    setReactPostLoading,
    collectPostLoading,
    reactPostLoading,
    mirrorPostLoading,
  } = useIndividual();

  const {
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
  } = useComment();

  const {
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
  } = useCollectOptions();
  const {
    videoLoading,
    imageLoading,
    uploadImage,
    uploadVideo,
    handleRemoveImage,
    mappedFeaturedFiles,
  } = useImageUpload();

  const {
    hasMoreProfile,
    fetchMoreProfile,
    profileRef,
    followerOnlyProfile,
    setCollectProfileLoading,
    setMirrorProfileLoading,
    profileLoading,
    mirrorProfileLoading,
    collectProfileLoading,
    reactProfileLoading,
    setReactProfileLoading,
    setProfileScroll,
  } = useProfileFeed();

  const {
    searchProfiles,
    profilesFound,
    profilesOpenSearch,
    fetchMoreSearch,
    hasMoreSearch,
    setProfilesOpenSearch,
    setProfilesFound,
  } = useSearch();

  return (
    <div className="relative w-full h-full mid:h-[50.2rem] xl:h-[47.8rem] gap-3 flex items-start justify-center pt-10 overflow-y-scroll">
      <Feed
        dispatch={dispatch}
        followerOnly={followerOnly}
        feedDispatch={feedDispatch}
        postsLoading={postsLoading}
        hasMore={hasMore}
        fetchMore={fetchMore}
        address={address}
        collectPost={collectPost}
        mirrorPost={mirrorPost}
        reactPost={reactPost}
        mirrorLoading={mirrorFeedLoading}
        collectLoading={collectFeedLoading}
        reactLoading={reactFeedLoading}
        reactionAmounts={reactionAmounts}
        mainPost={mainPost!}
        followerOnlyMain={followerOnlyMain}
        mainPostLoading={mainPostLoading}
        hasMoreComments={hasMoreComments}
        getMorePostComments={getMorePostComments}
        commentors={commentors}
        commentsLoading={commentsLoading}
        reactCommentLoading={reactCommentLoading}
        mirrorCommentLoading={mirrorCommentLoading}
        collectCommentLoading={collectCommentLoading}
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
        uploadImages={uploadImage}
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
        individualAmounts={individualAmounts}
        router={router}
        setCollectibleDropDown={setCollectibleDropDown}
        profile={profile}
        setTimeLimitDropDown={setTimeLimitDropDown}
        profileRef={profileRef}
        hasMoreProfile={hasMoreProfile}
        profileAmounts={profileAmounts}
        profileDispatch={profileDispatch}
        fetchMoreProfile={fetchMoreProfile}
        followerOnlyProfile={followerOnlyProfile}
        setCollectProfileLoading={setCollectProfileLoading}
        setMirrorProfileLoading={setMirrorProfileLoading}
        setReactProfileLoading={setReactProfileLoading}
        profileLoading={profileLoading}
        mirrorProfileLoading={mirrorProfileLoading}
        collectProfileLoading={collectProfileLoading}
        reactProfileLoading={reactProfileLoading}
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
    </div>
  );
};

export default Wavs;
