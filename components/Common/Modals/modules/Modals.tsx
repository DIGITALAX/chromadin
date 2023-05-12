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

const Modals = () => {
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
  const {
    profile,
    followProfile,
    followLoading,
    approved,
    approveCurrency: approveFollowCurrency,
  } = useFollowers();
  const {
    collectInfoLoading: controlsCollectInfoLoading,
    approvalLoading,
    collectCommentLoading,
    approveCurrency,
    collectVideo,
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
  return (
    <>
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
        />
      )}
      {collectModal?.open && <Collect message={collectModal?.message} />}
      {imageViewer.value && <ImageLarge mainImage={mainImage!} />}
      {errorModal.value && <Error />}
      {successModal.open && <Success media={successModal.media} />}
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
