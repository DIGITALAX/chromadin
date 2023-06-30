import { FunctionComponent } from "react";
import Account from "./Account";
import History from "./History";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Fulfillment from "./Fulfillment";
import useFulfillment from "../hooks/useFulfillment";
import useHistory from "../hooks/useHistory";
import { useRouter } from "next/router";

const Switch: FunctionComponent = (): JSX.Element => {
  const dispatch = useDispatch();
  const router = useRouter();
  const action = useSelector(
    (state: RootState) => state.app.optionsReducer.value
  );
  const profile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const acceptedtokens = useSelector(
    (state: RootState) => state.app.mainNFTReducer.value?.acceptedTokens
  );
  const mainNFT = useSelector(
    (state: RootState) => state.app.mainNFTReducer.value
  );
  const historyReducer = useSelector(
    (state: RootState) => state.app.historyReducer.value
  );
  const collections = useSelector(
    (state: RootState) => state.app.collectionsReducer.value
  );
  const isCreator = useSelector(
    (state: RootState) => state.app.isCreatorReducer.value
  );
  const buyerHistoryReducer = useSelector(
    (state: RootState) => state.app.buyerHistoryReducer.value
  );
  const hasMoreHistory = useSelector(
    (state: RootState) => state.app.hasMoreHistoryReducer.value
  );
  const hasMoreHistorySpecific = useSelector(
    (state: RootState) => state.app.hasMoreBuyerHistoryReducer.value
  );
  const {
    currency,
    setCurrency,
    baseColor,
    setBaseColor,
    selectSize,
    setSelectSize,
    posterSize,
    stickerPack,
    setPosterSize,
    setStickerPack,
    setPosterAmount,
    posterAmount,
    totalAmount,
    approved,
    buyNFT,
    approveSpend,
    purchaseLoading,
  } = useFulfillment();
  const {
    historyLoading,
    historySwitch,
    setHistorySwitch,
    getMoreBuyerHistory,
    getMoreUserHistory,
    moreHistoryLoading,
  } = useHistory();
  switch (action) {
    case "account":
      return <Account profile={profile} isCreator={isCreator} />;

    case "fulfillment":
      return (
        <Fulfillment
          currency={currency}
          setCurrency={setCurrency}
          baseColor={baseColor}
          setBaseColor={setBaseColor}
          selectSize={selectSize}
          setSelectSize={setSelectSize}
          posterSize={posterSize}
          stickerPack={stickerPack}
          setPosterSize={setPosterSize}
          setStickerPack={setStickerPack}
          posterAmount={posterAmount}
          setPosterAmount={setPosterAmount}
          totalAmount={totalAmount}
          acceptedtokens={acceptedtokens!}
          approved={approved}
          mainNFT={mainNFT}
          buyNFT={buyNFT}
          approveSpend={approveSpend}
          purchaseLoading={purchaseLoading}
          collections={collections}
          dispatch={dispatch}
          router={router}
        />
      );

    default:
      return (
        <History
          historyReducer={historyReducer}
          historyLoading={historyLoading}
          buyerHistoryReducer={buyerHistoryReducer}
          historySwitch={historySwitch}
          setHistorySwitch={setHistorySwitch}
          getMoreBuyerHistory={getMoreBuyerHistory}
          getMoreUserHistory={getMoreUserHistory}
          moreHistoryLoading={moreHistoryLoading}
          hasMoreHistory={hasMoreHistory}
          hasMoreHistorySpecific={hasMoreHistorySpecific}
        />
      );
  }
};

export default Switch;
