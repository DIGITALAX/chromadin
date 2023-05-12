import useCollectOptions from "@/components/Common/NFT/hooks/useCollectOptions";
import useImageUpload from "@/components/Common/NFT/hooks/useImageUpload";
import useConnect from "@/components/Common/SideBar/hooks/useConnect";
import useAllPosts from "@/components/Common/Wavs/hooks/useAllPosts";
import useComment from "@/components/Common/Wavs/hooks/useComment";
import useIndividual from "@/components/Common/Wavs/hooks/useIndividual";
import useReactions from "@/components/Common/Wavs/hooks/useReactions";
import AllPosts from "@/components/Common/Wavs/modules/AllPosts";
import { RootState } from "@/redux/store";
import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";

const Wavs: FunctionComponent = (): JSX.Element => {
  const dispatch = useDispatch();
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
  const authStatus = useSelector(
    (state: RootState) => state.app.authStatusReducer.value
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
  const commentors = useSelector(
    (state: RootState) => state.app.commentReducer.value
  );
  
  const { handleLensSignIn, handleConnect } = useConnect();
  const { followerOnly, postsLoading, hasMore, fetchMore } = useAllPosts();

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
  console.log({commentors})
  return (
    <div className="relative w-full h-full mid:h-[50.2rem] xl:h-[47.8rem] gap-3 flex items-start justify-center pt-10 overflow-y-scroll">
      <AllPosts
        feedType={feedType}
        dispatch={dispatch}
        feedDispatch={feedDispatch}
        postsLoading={postsLoading}
        followerOnly={followerOnly}
        hasMore={hasMore}
        fetchMore={fetchMore}
        address={address!}
        collectPost={collectPost}
        reactPost={reactPost}
        mirrorPost={mirrorPost}
        reactLoading={reactFeedLoading}
        collectLoading={collectFeedLoading}
        mirrorLoading={mirrorFeedLoading}
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
        authStatus={authStatus}
        profileId={profileId}
        videoLoading={videoLoading}
        uploadImages={uploadImage}
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
      />
    </div>
  );
};

export default Wavs;
