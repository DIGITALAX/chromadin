import Bar from "@/components/Autograph/Common/modules/Bar";
import useAutoProfile from "@/components/Autograph/Home/hooks/useAutoProfile";
import useAutograph from "@/components/Autograph/Home/hooks/useAutograph";
import AutoProfileFeed from "@/components/Autograph/Home/modules/AutoProfileFeed";
import Collections from "@/components/Autograph/Home/modules/Collections";
import Drops from "@/components/Autograph/Home/modules/Drops";
import Encrypted from "@/components/Autograph/Home/modules/Encrypted";
import NotFound from "@/components/Common/Loading/NotFound";
import RouterChange from "@/components/Common/Loading/RouterChange";
import useCollectOptions from "@/components/Common/NFT/hooks/useCollectOptions";
import useImageUpload from "@/components/Common/NFT/hooks/useImageUpload";
import useConnect from "@/components/Common/SideBar/hooks/useConnect";
import useComment from "@/components/Common/Wavs/hooks/useComment";
import useReactions from "@/components/Common/Wavs/hooks/useReactions";
import Account from "@/components/Common/Wavs/modules/Account";
import MakePost from "@/components/Common/Wavs/modules/MakePost";
import useViewer from "@/components/Home/hooks/useViewer";
import { RootState } from "@/redux/store";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";

const Autograph: NextPage = (): JSX.Element => {
  const autoDispatch = useSelector(
    (state: RootState) => state.app.autographReducer
  );
  const allDrops = useSelector(
    (state: RootState) => state.app.dropsReducer.value
  );
  const profile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const authStatus = useSelector(
    (state: RootState) => state.app.authStatusReducer.value
  );
  const profileType = useSelector(
    (state: RootState) => state.app.profileReducer.profile?.id
  );
  const commentOpen = useSelector(
    (state: RootState) => state.app.openCommentReducer.value
  );
  const quickProfiles = useSelector(
    (state: RootState) => state.app.quickProfilesReducer.value
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
  const imageLoading = useSelector(
    (state: RootState) => state.app.imageLoadingReducer.value
  );

  const router = useRouter();
  const { push } = router;
  const { autograph } = router.query;
  const dispatch = useDispatch();
  const { address } = useAccount();
  const [notFound, setNotFound] = useState<boolean>(false);

  const { handleSearch, searchOpen, searchResults, handleSearchChoose } =
    useViewer();
  const { handleConnect, handleLensSignIn, connected } = useConnect();
  const {
    autographLoading,
    getProfileFeed,
    getAllCollections,
    handleShareCollection,
  } = useAutograph();

  const { reactPost, collectPost, mirrorPost } = useReactions();

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
    preElement,
    handleImagePaste,
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
    uploadVideo,
    handleRemoveImage,
    mappedFeaturedFiles,
    uploadImage,
  } = useImageUpload();

  const {
    hasMoreProfile,
    fetchMoreProfile,
    followerOnlyProfile,
    setCollectProfileLoading,
    setMirrorProfileLoading,
    profileLoading,
    mirrorProfileLoading,
    collectProfileLoading,
    reactProfileLoading,
    setReactProfileLoading,
    hasMoreDecryptProfile,
    followerOnlyProfileDecrypt,
    fetchMoreProfileDecrypt,
    decryptProfileLoading,
    profileFeed,
    decryptProfileFeed,
    profileFeedCount,
    decryptProfileFeedCount,
  } = useAutoProfile();
  useEffect(() => {
    if (
      !autographLoading &&
      autograph &&
      allDrops.length > 0 &&
      !profileLoading &&
      !decryptProfileLoading &&
      quickProfiles?.length > 0
    ) {
      if (
        quickProfiles?.some(
          (prof) =>
            prof.handle?.split(".lens")[0]?.toLowerCase() ===
            (autograph as string).toLowerCase()
        )
      ) {
        getAllCollections(autograph as string);
        getProfileFeed(autograph as string);
      } else {
        setNotFound(true);
      }
    }
  }, [autograph, allDrops, authStatus, quickProfiles]);

  if (autographLoading || profileLoading || decryptProfileLoading) {
    return <RouterChange />;
  }

  return (
    <div
      className="relative w-full flex flex-col bg-black items-center justify-start h-full gap-6"
      id="calc"
    >
      <Head>
        <title>{autoDispatch.profile?.name?.toUpperCase()}</title>
        <meta
          name="og:url"
          content={`https://chromadin.xyz/autograph/${
            autoDispatch.profile?.handle?.split(".lens")[0]
          }/collection/${autoDispatch.profile?.name
            ?.replaceAll(" ", "-")
            ?.toLowerCase()}`}
        />
        <meta
          name="og:title"
          content={autoDispatch.profile?.name?.toUpperCase()}
        />
        <meta
          name="og:description"
          content={autoDispatch.profile?.metadata?.content}
        />
        <meta
          name="og:image"
          content={
            !autoDispatch?.collections?.[0]?.uri?.image
              ? "https://chromadin.xyz/card.png/"
              : `https://chromadin.infura-ipfs.io/ipfs/${autoDispatch?.collections?.[0]?.uri?.image?.split(
                  "ipfs://"
                )}`
          }
        />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@digitalax" />
        <meta name="twitter:creator" content="@digitalax" />
        <meta
          name="twitter:image"
          content={`https://chromadin.xyz/autograph/${
            autoDispatch.profile?.handle?.split(".lens")[0]
          }/collection/${autoDispatch.profile?.name
            ?.replaceAll(" ", "-")
            ?.toLowerCase()}`}
        />
        <meta
          name="twitter:url"
          content={`https://chromadin.xyz/autograph/${
            autoDispatch.profile?.handle?.split(".lens")[0]
          }/collection/${autoDispatch.profile?.name
            ?.replaceAll(" ", "-")
            ?.toLowerCase()}`}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="canonical"
          href={
            !autoDispatch?.collections?.[0]?.uri?.image
              ? "https://chromadin.xyz/card.png/"
              : `https://chromadin.infura-ipfs.io/ipfs/${autoDispatch?.collections?.[0]?.uri?.image?.split(
                  "ipfs://"
                )}`
          }
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://chromadin.xyz/fonts/ArcadeClassic.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
        <link
          rel="preload"
          href="https://chromadin.xyz/fonts/DSDigi.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
        <link
          rel="preload"
          href="https://chromadin.xyz/fonts/EarlsRevenge.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
        <link
          rel="preload"
          href="https://chromadin.xyz/fonts/Geometria.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
        <link
          rel="preload"
          href="https://chromadin.xyz/fonts/ClashDisplay.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
        <link
          rel="preload"
          href="https://chromadin.xyz/fonts/DosisRegular.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
        <link
          rel="preload"
          href="https://chromadin.xyz/fonts/EconomicaBold.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
        <link
          rel="preload"
          href="https://chromadin.xyz/fonts/EconomicaRegular.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
      </Head>
      <Bar
        push={push}
        handleConnect={handleConnect}
        connected={connected}
        handleLensSignIn={handleLensSignIn}
        authStatus={authStatus}
        profile={profile}
        handleSearch={handleSearch}
        searchOpen={searchOpen}
        searchResults={searchResults}
        handleSearchChoose={handleSearchChoose}
      />
      {quickProfiles &&
      allDrops &&
      notFound &&
      !quickProfiles?.some(
        (prof) =>
          prof.handle?.split(".lens")[0]?.toLowerCase() ===
          (autograph as string).toLowerCase()
      ) ? (
        <NotFound router={router} />
      ) : (
        autoDispatch.profile &&
        profileFeed && (
          <div className="relative flex flex-col w-full h-fit gap-3 justify-start px-20 py-10">
            <Account dispatch={dispatch} profile={autoDispatch.profile} />
            <div className="relative flex flex-row gap-3 items-start justify-center w-full h-full">
              <div className="relative w-full h-fit flex flex-col items-start justify-start gap-4">
                <div className="relative w-full h-full flex flex-col items-start justify-center gap-3">
                  {profileLoading || decryptProfileLoading ? (
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
                    <AutoProfileFeed
                      feedType={profile?.id}
                      hasMoreProfile={hasMoreProfile}
                      fetchMoreProfile={fetchMoreProfile}
                      profileFeed={profileFeed}
                      profileAmounts={profileFeedCount}
                      collectPost={collectPost}
                      mirrorPost={mirrorPost}
                      reactPost={reactPost}
                      commentPost={commentPost}
                      commentOpen={commentOpen}
                      address={address}
                      followerOnly={followerOnlyProfileDecrypt}
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
                      setCollectProfileLoading={setCollectProfileLoading}
                      setMirrorProfileLoading={setMirrorProfileLoading}
                      setReactProfileLoading={setReactProfileLoading}
                      profile={autoDispatch.profile}
                      profileType={profileType}
                      preElement={preElement}
                      handleImagePaste={handleImagePaste}
                      router={router}
                    />
                  )}
                </div>
              </div>
              <div className="relative w-full h-fit flex flex-col gap-2 px-4">
                <Collections
                  autoCollections={autoDispatch.collections}
                  router={router}
                  handleShareCollection={handleShareCollection}
                  autoProfile={autoDispatch.profile}
                />
              </div>
            </div>
            <div className="relative w-full h-fit flex flex-col gap-5 pt-10">
              {decryptProfileFeed?.length > 0 && (
                <div className="relative w-full h-fit flex flex-col items-start justify-start gap-2">
                  <div className="relative w-fit h-fit items-start justify-start font-earl text-white break-words whitespace-nowrap text-2xl">
                    Encrypted Posts
                  </div>
                  <Encrypted
                    feedType={profile?.id}
                    hasMoreProfile={hasMoreDecryptProfile}
                    fetchMoreProfile={fetchMoreProfileDecrypt}
                    profileFeed={decryptProfileFeed}
                    profileAmounts={decryptProfileFeedCount}
                    collectPost={collectPost}
                    mirrorPost={mirrorPost}
                    reactPost={reactPost}
                    commentPost={commentPost}
                    commentOpen={commentOpen}
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
                    setCollectProfileLoading={setCollectProfileLoading}
                    setMirrorProfileLoading={setMirrorProfileLoading}
                    setReactProfileLoading={setReactProfileLoading}
                    profile={autoDispatch.profile}
                    profileType={profileType}
                    preElement={preElement}
                    handleImagePaste={handleImagePaste}
                    router={router}
                  />
                </div>
              )}
              <Drops
                allDrops={autoDispatch.drops}
                autoProfile={autoDispatch.profile}
                router={router}
              />
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Autograph;
