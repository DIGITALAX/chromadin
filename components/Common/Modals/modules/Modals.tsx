import { useDispatch, useSelector } from "react-redux";
import IndexingModal from "./Indexer";
import Collect from "./Collect";
import Purchase from "./Purchase";
import useControls from "../../Video/hooks/useControls";
import { RootState } from "@/redux/store";
import { useAccount } from "wagmi";
import useConnect from "../../SideBar/hooks/useConnect";
import FollowerOnly from "./FollowerOnly";
import useFollowers from "../../Interactions/hooks/useFollowers";
import Claim from "./Claim";
import ImageLarge from "./ImageLarge";
import Error from "./Error";
import Success from "./Success";
import ImageViewerModal from "./ImageViewer";
import Who from "./Who";
import useWho from "../../Wavs/hooks/useWho";
import useReactions from "../../Wavs/hooks/useReactions";
import { useRouter } from "next/router";
import FullScreenVideo from "./FullScreenVideo";
import { useRef } from "react";
import FollowSuper from "./FollowSuper";
import useSuperCreator from "../../Wavs/hooks/useSuperCreator";

const Modals = () => {
  const videoRef = useRef<HTMLDivElement>(null);
  const indexingModal = useSelector(
    (state: RootState) => state.app.indexModalReducer
  );
  const collectModal = useSelector(
    (state: RootState) => state.app.modalReducer
  );
  const purchaseModal = useSelector(
    (state: RootState) => state.app.purchaseReducer
  );
  const successModal = useSelector(
    (state: RootState) => state.app.successReducer
  );
  const mainVideo = useSelector(
    (state: RootState) => state.app.mainVideoReducer
  );
  const videoSync = useSelector(
    (state: RootState) => state.app.videoSyncReducer
  );
  const errorModal = useSelector((state: RootState) => state.app.errorReducer);
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const collectModuleValues = useSelector(
    (state: RootState) => state.app.postCollectReducer
  );
  const followersModal = useSelector(
    (state: RootState) => state.app.followerOnlyReducer
  );
  const claimModal = useSelector(
    (state: RootState) => state.app.noHandleReducer
  );
  const mainImage = useSelector(
    (state: RootState) => state.app.mainNFTReducer.value?.media
  );
  const imageViewer = useSelector(
    (state: RootState) => state.app.imageViewerReducer
  );
  const imageFeedViewer = useSelector(
    (state: RootState) => state.app.imageFeedViewerReducer
  );
  const reaction = useSelector(
    (state: RootState) => state.app.reactionStateReducer
  );
  const rain = useSelector((state: RootState) => state.app.rainReducer.value);
  const dispatchVideos = useSelector(
    (state: RootState) => state.app.channelsReducer.value
  );
  const fullScreenVideo = useSelector(
    (state: RootState) => state.app.fullScreenVideoReducer
  );
  const superFollow = useSelector(
    (state: RootState) => state.app.superFollowReducer
  );
  const quickProfiles = useSelector(
    (state: RootState) => state.app.quickProfilesReducer.value
  );
  const viewer = useSelector((state: RootState) => state.app.viewReducer.value);
  const {
    profile,
    followProfile,
    followLoading,
    approved,
    approveCurrency: approveFollowCurrency,
    unfollowProfile,
  } = useFollowers();
  const {
    collectInfoLoading: controlsCollectInfoLoading,
    approvalLoading,
    collectCommentLoading,
    approveCurrency,
    collectVideo,
    fullVideoRef,
    wrapperRef,
  } = useControls();
  const {
    collectInfoLoading: purchaseInfoLoading,
    approvalLoading: postApprovalLoading,
    collectFeedLoading,
    approveCurrency: postApproveCurrency,
    collectPost,
  } = useReactions();
  const router = useRouter();
  const { address } = useAccount();
  const { handleLensSignIn } = useConnect();
  const dispatch = useDispatch();
  const {
    reacters,
    mirrorers,
    collectors,
    getMorePostCollects,
    getMorePostMirrors,
    getMorePostReactions,
    mirrorInfoLoading,
    reactInfoLoading,
    collectInfoLoading,
    hasMoreReact,
    hasMoreCollect,
    hasMoreMirror,
  } = useWho();
  const { followSuper, superCreatorLoading, canvasRef } = useSuperCreator();
  return (
    <>
      {fullScreenVideo.value && (
        <FullScreenVideo
          dispatch={dispatch}
          mainVideo={mainVideo}
          streamRef={fullVideoRef}
          wrapperRef={wrapperRef}
          videos={dispatchVideos}
          dispatchVideos={dispatchVideos}
          videoSync={videoSync}
          videoRef={videoRef}
          viewer={viewer}
        />
      )}
      {reaction.open && (
        <Who
          accounts={
            reaction.type === "heart"
              ? reacters
              : reaction.type === "mirror"
              ? mirrorers
              : collectors
          }
          fetchMore={
            reaction.type === "heart"
              ? getMorePostReactions
              : reaction.type === "mirror"
              ? getMorePostMirrors
              : getMorePostCollects
          }
          loading={
            reaction.type === "heart"
              ? reactInfoLoading
              : reaction.type === "mirror"
              ? mirrorInfoLoading
              : collectInfoLoading
          }
          dispatch={dispatch}
          hasMore={
            reaction.type === "heart"
              ? hasMoreReact
              : reaction.type === "mirror"
              ? hasMoreMirror
              : hasMoreCollect
          }
          type={
            reaction.type === "heart" ? 0 : reaction.type === "collect" ? 1 : 2
          }
          router={router}
        />
      )}
      {purchaseModal?.open && (
        <Purchase
          collectInfoLoading={
            router.asPath?.includes("#wavs")
              ? purchaseInfoLoading
              : controlsCollectInfoLoading
          }
          approvalLoading={
            router.asPath?.includes("#wavs")
              ? postApprovalLoading
              : approvalLoading
          }
          address={address}
          collectModuleValues={collectModuleValues}
          lensProfile={lensProfile}
          collectComment={
            router.asPath?.includes("#wavs") ? collectPost : collectVideo
          }
          collectLoading={
            router.asPath?.includes("#wavs")
              ? collectFeedLoading[purchaseModal?.index!]
              : collectCommentLoading[purchaseModal?.index!]
          }
          approveCurrency={
            router.asPath?.includes("#wavs")
              ? postApproveCurrency
              : approveCurrency
          }
          handleLensSignIn={handleLensSignIn}
          commentId={purchaseModal?.id}
        />
      )}
      {followersModal?.open && (
        <FollowerOnly
          profile={profile}
          followProfile={followProfile}
          followLoading={followLoading}
          approved={approved}
          approveCurrency={approveFollowCurrency}
          dispatch={dispatch}
          followDetails={followersModal}
          unfollowProfile={unfollowProfile}
        />
      )}
      {collectModal?.open && <Collect message={collectModal?.message} />}
      {superFollow?.open && (
        <FollowSuper
          dispatch={dispatch}
          followSuper={followSuper}
          quickProfiles={quickProfiles}
          router={router}
          rain={rain}
          superCreatorLoading={superCreatorLoading}
          canvasRef={canvasRef}
        />
      )}
      {imageViewer.value && <ImageLarge mainImage={mainImage!} />}
      {errorModal.value && <Error />}
      {successModal.open && (
        <Success dispatch={dispatch} media={successModal.media} />
      )}
      {indexingModal?.value && (
        <IndexingModal message={indexingModal?.message} />
      )}
      {claimModal?.value && <Claim />}
      {imageFeedViewer?.open && (
        <ImageViewerModal
          image={imageFeedViewer.image}
          type={imageFeedViewer.type}
          dispatch={dispatch}
        />
      )}
    </>
  );
};

export default Modals;
