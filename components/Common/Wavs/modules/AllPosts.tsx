import { Publication } from "@/components/Home/types/lens.types";
import { FunctionComponent } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import MakeComment from "./MakeComment";
import FeedPublication from "./FeedPublication";
import { AllPostsProps } from "../types/wavs.types";
import QuickProfiles from "./QuickProfiles";
import Search from "./Search";
import SuperCreator from "./SuperCreator";

const AllPosts: FunctionComponent<AllPostsProps> = ({
  hasMore,
  fetchMore,
  feedDispatch,
  setScrollPos,
  scrollRef,
  feedType,
  scrollPos,
  dispatch,
  reactionAmounts,
  reactPost,
  collectPost,
  mirrorPost,
  commentPost,
  followerOnly,
  address,
  router,
  mirrorLoading,
  reactLoading,
  collectLoading,
  commentOpen,
  commentDescription,
  textElement,
  profileId,
  caretCoord,
  handleCommentDescription,
  handleConnect,
  handleRemoveImage,
  commentLoading,
  mentionProfiles,
  profilesOpen,
  gifOpen,
  handleGifSubmit,
  handleSetGif,
  handleMentionClick,
  results,
  handleGif,
  value,
  uploadImages,
  uploadVideo,
  setGifOpen,
  handleKeyDownDelete,
  videoLoading,
  handleLensSignIn,
  referral,
  canComment,
  setLimit,
  imageLoading,
  mappedFeaturedFiles,
  collectOpen,
  enabledCurrencies,
  audienceDropDown,
  audienceType,
  setAudienceDropDown,
  limitedDropDown,
  limit,
  postImagesDispatched,
  setTimeLimit,
  setReferral,
  setAudienceType,
  setCollectible,
  setLimitedEdition,
  setLimitedDropDown,
  setCollectibleDropDown,
  setCurrencyDropDown,
  setEnabledCurrency,
  timeLimit,
  setTimeLimitDropDown,
  timeLimitDropDown,
  audienceTypes,
  limitedEdition,
  setValue,
  chargeCollect,
  enabledCurrency,
  chargeCollectDropDown,
  setChargeCollect,
  setChargeCollectDropDown,
  collectNotif,
  collectible,
  currencyDropDown,
  collectibleDropDown,
  quickProfiles,
  searchProfiles,
  profilesFound,
  profilesOpenSearch,
  fetchMoreSearch,
  hasMoreSearch,
  setProfilesFound,
  setProfilesOpenSearch,
  profileType,
  preElement,
  allCollections,
  filterDecrypt,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col items-start justify-start gap-4">
      <div className="relative flex flex-col items-start justify-start gap-3 h-full w-full">
        <div className="relative w-full h-fit flex flex-col sm:flex-row gap-3 sm:gap-10">
          <div className="max-w-full overflow-x-scroll">
            <QuickProfiles router={router} quickProfiles={quickProfiles} />
          </div>
          <div className="relative flex flex-col sm:flex-row lg:flex-col stuck1:flex-row gap-5 sm:gap-1 lg:gap-3 stuck1:gap-1 w-full flex-shrink-0 sm:w-auto h-fit ml-auto sm:pt-0 pt-3">
            <SuperCreator
              dispatch={dispatch}
              handleConnect={handleConnect}
              address={address}
              profileId={profileId}
            />
            <Search
              searchProfiles={searchProfiles}
              profilesFound={profilesFound}
              profilesOpenSearch={profilesOpenSearch}
              router={router}
              fetchMoreSearch={fetchMoreSearch}
              hasMoreSearch={hasMoreSearch}
              setProfilesOpenSearch={setProfilesOpenSearch}
              setProfilesFound={setProfilesFound}
            />
          </div>
        </div>
        <InfiniteScroll
          height={"40rem"}
          loader={""}
          hasMore={hasMore}
          next={fetchMore}
          dataLength={
            filterDecrypt
              ? feedDispatch.filter((pub: any) => {
                  if (pub.decrypt || pub.gated) return pub;
                }).length
              : feedDispatch?.length
          }
          className={`relative row-start-1 w-full ml-auto h-full max-w-full overflow-y-scroll`}
          style={{ color: "#131313", fontFamily: "Digi Reg" }}
          scrollThreshold={0.9}
          scrollableTarget={"scrollableDiv"}
          ref={scrollRef}
          onScroll={(e: MouseEvent) => setScrollPos(e)}
          initialScrollY={feedType === "" ? scrollPos : 0}
        >
          <div className="w-full h-full relative flex flex-col gap-4 pb-3">
            {(filterDecrypt
              ? feedDispatch
                  .map((pub: any, index: number) => ({
                    ...pub,
                    originalIndex: index,
                  }))
                  .filter((pub: any) => pub.decrypt || pub.gated)
                  .map((publication: Publication) => ({
                    ...publication,
                    filterIndex: (publication as any).originalIndex,
                  }))
              : feedDispatch
            )?.map((publication: Publication, index: number) => {
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
                        ? reactionAmounts.hasMirrored[
                            (publication as any)?.filterIndex
                          ]
                        : reactionAmounts.hasMirrored[index]
                    }
                    hasReacted={
                      filterDecrypt
                        ? reactionAmounts.hasLiked[
                            (publication as any)?.filterIndex
                          ]
                        : reactionAmounts.hasLiked?.[index]
                    }
                    hasCollected={
                      filterDecrypt
                        ? reactionAmounts.hasCollected[
                            (publication as any)?.filterIndex
                          ]
                        : reactionAmounts.hasCollected[index]
                    }
                    followerOnly={
                      filterDecrypt
                        ? followerOnly[(publication as any)?.filterIndex]
                        : followerOnly[index]
                    }
                    collectPost={collectPost}
                    mirrorPost={mirrorPost}
                    reactPost={reactPost}
                    address={address}
                    index={index}
                    mirrorLoading={
                      filterDecrypt
                        ? mirrorLoading[(publication as any)?.filterIndex]
                        : mirrorLoading[index]
                    }
                    reactLoading={
                      filterDecrypt
                        ? reactLoading[(publication as any)?.filterIndex]
                        : reactLoading[index]
                    }
                    collectLoading={
                      filterDecrypt
                        ? collectLoading[(publication as any)?.filterIndex]
                        : collectLoading[index]
                    }
                    reactAmount={
                      filterDecrypt
                        ? reactionAmounts.like[
                            (publication as any)?.filterIndex
                          ]
                        : reactionAmounts.like[index]
                    }
                    mirrorAmount={
                      filterDecrypt
                        ? reactionAmounts.mirror[
                            (publication as any)?.filterIndex
                          ]
                        : reactionAmounts.mirror[index]
                    }
                    collectAmount={
                      filterDecrypt
                        ? reactionAmounts.collect[
                            (publication as any)?.filterIndex
                          ]
                        : reactionAmounts.collect[index]
                    }
                    commentAmount={
                      filterDecrypt
                        ? reactionAmounts.comment[
                            (publication as any)?.filterIndex
                          ]
                        : reactionAmounts.comment[index]
                    }
                    openComment={commentOpen}
                    feedType={feedType}
                    router={router}
                    profileType={profileType}
                    allCollections={allCollections}
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

export default AllPosts;
