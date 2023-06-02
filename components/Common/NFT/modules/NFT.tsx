import { FunctionComponent } from "react";
import UserComment from "./UserComment";
import MainDrop from "./MainDrop";
import { NFTProps } from "../types/nft.types";
import Description from "./Description";
import useConnect from "../../SideBar/hooks/useConnect";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import useComment from "../hooks/useComment";
import useImageUpload from "../hooks/useImageUpload";
import useCollectOptions from "../hooks/useCollectOptions";
import useDrop from "@/components/Home/hooks/useDrop";

const NFT: FunctionComponent<NFTProps> = ({ mainNFT, viewer }): JSX.Element => {
  const { handleConnect, handleLensSignIn } = useConnect();
  const { collectionsLoading } = useDrop();
  const {
    commentVideo,
    commentDescription,
    commentLoading,
    handleCommentDescription,
    textElement,
    caretCoord,
    mentionProfiles,
    profilesOpen,
    handleMentionClick,
    handleGif,
    handleGifSubmit,
    handleSetGif,
    results,
    setGifOpen,
    gifOpen,
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
    imageLoading,
    uploadImage,
    uploadVideo,
    handleRemoveImage,
    mappedFeaturedFiles,
    setImageLoading,
  } = useImageUpload();
  const authStatus = useSelector(
    (state: RootState) => state.app.authStatusReducer.value
  );
  const commentId = useSelector(
    (state: RootState) => state.app.secondaryCommentReducer.value
  );
  const canComment = useSelector(
    (state: RootState) => state.app.canCommentReducer.value
  );
  const profileId = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const collectOpen = useSelector(
    (state: RootState) => state.app.collectOpenReducer.value
  );
  const postImagesDispatched = useSelector(
    (state: RootState) => state.app.postImageReducer.value
  );
  const dispatch = useDispatch();
  return (
    <div className="relative w-full h-full sm:h-80 xl:h-72 flex flex-col sm:flex-row">
      <MainDrop
        mainNFT={mainNFT}
        collectionsLoading={collectionsLoading}
        dispatch={dispatch}
      />
      {viewer !== "collect" ? (
        <UserComment
          authStatus={authStatus}
          profileId={profileId}
          commentVideo={commentVideo}
          handleLensSignIn={handleLensSignIn}
          handleConnect={handleConnect}
          commentDescription={commentDescription}
          commentLoading={commentLoading}
          handleCommentDescription={handleCommentDescription}
          textElement={textElement}
          caretCoord={caretCoord}
          mentionProfiles={mentionProfiles}
          profilesOpen={profilesOpen}
          handleMentionClick={handleMentionClick}
          videoLoading={videoLoading}
          imageLoading={imageLoading}
          uploadImage={uploadImage}
          uploadVideo={uploadVideo}
          handleRemoveImage={handleRemoveImage}
          postImagesDispatched={postImagesDispatched}
          mappedFeaturedFiles={mappedFeaturedFiles}
          handleGifSubmit={handleGifSubmit}
          handleGif={handleGif}
          results={results}
          handleSetGif={handleSetGif}
          setGifOpen={setGifOpen}
          gifOpen={gifOpen}
          collectOpen={collectOpen}
          collectNotif={collectNotif}
          referral={referral}
          setCollectible={setCollectible}
          collectibleDropDown={collectibleDropDown}
          setCollectibleDropDown={setCollectibleDropDown}
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
          setTimeLimitDropDown={setTimeLimitDropDown}
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
          dispatch={dispatch}
          handleKeyDownDelete={handleKeyDownDelete}
          commentId={commentId}
          canComment={canComment}
          preElement={preElement}
          handleImagePaste={handleImagePaste}
          setImageLoading={setImageLoading}
        />
      ) : (
        <Description
          mainNFT={mainNFT}
          collectionsLoading={collectionsLoading}
        />
      )}
    </div>
  );
};

export default NFT;
