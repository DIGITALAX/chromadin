import useAutoCollection from "@/components/Autograph/Collection/hooks/useAutoCollection";
import usePurchase from "@/components/Autograph/Collection/hooks/usePurchase";
import Bar from "@/components/Autograph/Common/modules/Bar";
import InDrop from "@/components/Autograph/Collection/modules/InDrop";
import Purchase from "@/components/Common/Interactions/modules/Purchase";
import RouterChange from "@/components/Common/Loading/RouterChange";
import useConnect from "@/components/Common/SideBar/hooks/useConnect";
import useViewer from "@/components/Home/hooks/useViewer";
import { INFURA_GATEWAY } from "@/lib/constants";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import { setImageViewer } from "@/redux/reducers/imageViewerSlice";
import { RootState } from "@/redux/store";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/legacy/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";

const Collection: NextPage = (): JSX.Element => {
  const allDrops = useSelector(
    (state: RootState) => state.app.dropsReducer.value
  );
  const autoDispatch = useSelector(
    (state: RootState) => state.app.autoCollectionReducer
  );
  const imageLoading = useSelector(
    (state: RootState) => state.app.imageLoadingReducer.value
  );
  const profileId = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const profile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const authStatus = useSelector(
    (state: RootState) => state.app.authStatusReducer.value
  );
  const {
    collectionLoading,
    getCollection,
    otherCollectionsDrop,
    handleShareCollection,
  } = useAutoCollection();
  const {
    purchaseLoading,
    buyNFT,
    totalAmount,
    approved,
    approveSpend,
    currency,
    setCurrency,
  } = usePurchase();
  const { address } = useAccount();
  const { handleSearch, searchOpen, searchResults, handleSearchChoose } =
    useViewer();
  const { handleConnect, handleLensSignIn, connected } = useConnect();
  const {
    query: { autograph, collection },
    push,
  } = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!collectionLoading && autograph && collection && allDrops.length > 0) {
      getCollection(autograph as string, collection as string);
    }
  }, [autograph, collection, allDrops]);

  if (collectionLoading) {
    return <RouterChange />;
  }

  return (
    <div
      className="relative w-full flex flex-col bg-black items-center justify-start h-full gap-6 z-0"
      id="calc"
    >
      <Head>
        <title>
          Chromadin | {autoDispatch.collection?.name?.toUpperCase()}
        </title>
        <meta
          name="og:url"
          content={`https://chromadin.xyz/autograph/${
            autoDispatch.profile?.handle?.split(".lens")[0]
          }/collection/${autoDispatch.collection?.name
            ?.replaceAll(" ", "-")
            ?.toLowerCase()}`}
        />
        <meta
          name="og:title"
          content={autoDispatch.collection?.name?.toUpperCase()}
        />
        <meta
          name="og:description"
          content={autoDispatch.collection?.uri?.description}
        />
        <meta
          name="og:image"
          content={
            !autoDispatch.collection?.uri?.image
              ? "https://chromadin.xyz/card.png/"
              : `https://chromadin.infura-ipfs.io/ipfs/${autoDispatch.collection?.uri?.image?.split(
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
          }/collection/${autoDispatch.collection?.name
            ?.replaceAll(" ", "-")
            ?.toLowerCase()}`}
        />
        <meta
          name="twitter:url"
          content={`https://chromadin.xyz/autograph/${
            autoDispatch.profile?.handle?.split(".lens")[0]
          }/collection/${autoDispatch.collection?.name
            ?.replaceAll(" ", "-")
            ?.toLowerCase()}`}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="canonical"
          href={
            !autoDispatch.collection?.uri?.image
              ? "https://chromadin.xyz/card.png/"
              : `https://chromadin.infura-ipfs.io/ipfs/${autoDispatch.collection?.uri?.image?.split(
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
        <link
          rel="preload"
          href="https://chromadin.xyz/fonts/Manaspc.ttf"
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
      {autoDispatch.collection && autoDispatch.profile && (
        <div className="relative w-full h-full flex flex-col lg:flex-row bg-black items-center justify-center gap-12 lg:gap-8 lg:pl-20 pt-10">
          <div className="relative w-5/6 h-128 flex flex-col items-center justify-center gap-3">
            <div className="relative flex flex-col w-full h-full bg-offBlack/50 p-2">
              <div className="relative w-full h-full flex">
                {autoDispatch.collection?.uri?.image && (
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/${
                      autoDispatch.collection?.uri?.image?.split("ipfs://")[1]
                    }`}
                    layout="fill"
                    objectFit="contain"
                    className="flex flex-col w-full h-full"
                    draggable={false}
                  />
                )}
              </div>
            </div>
            <div className="relative w-full h-fit flex flex-row gap-3 justify-end items-end">
              <div
                className="relative w-5 h-5 cursor-pointer justify-end items-end flex ml-auto"
                onClick={() =>
                  dispatch(
                    setImageViewer({
                      actionValue: true,
                      actionImage:
                        autoDispatch.collection?.uri?.image?.split(
                          "ipfs://"
                        )[1],
                    })
                  )
                }
              >
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/QmVpncAteeF7voaGu1ZV5qP63UpZW2xmiCWVftL1QnL5ja`}
                  alt="expand"
                  layout="fill"
                  className="flex items-center"
                  draggable={false}
                />
              </div>
              <div
                className={`relative text-ama items-center flex cursor-pointer justify-center top-1 rounded-l-md p-1 hover:opacity-70 active:scale-95 flex-row gap-1`}
                onClick={
                  !address && !profileId
                    ? () => handleConnect()
                    : address && !profileId
                    ? () => handleLensSignIn()
                    : imageLoading
                    ? () => {}
                    : () => handleShareCollection()
                }
              >
                <div className="relative w-6 h-4 flex items-center justify-center">
                  <Image
                    layout="fill"
                    alt="post to lens"
                    src={`${INFURA_GATEWAY}/ipfs/QmTosnBk8UmFjJQJrTtZwfDHTegNyDmToPSg7N2ewGmg3Z`}
                    draggable={false}
                  />
                </div>
                <div className="relative w-4 h-4 flex items-center justify-center">
                  <Image
                    layout="fill"
                    alt="post to lens"
                    src={`${INFURA_GATEWAY}/ipfs/QmRr4axapEyQwjoGofb3BUwUT2yN115rnr2HYLLq2Awz2P`}
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="relative w-full h-full flex flex-col items-center justify-center px-6 sm:px-10 pb-8">
            <div className="relative flex flex-col gap-3 text-center lg:text-right items-center lg:items-end lg:justify-end w-full h-fit">
              <div className="relative flex flex-col gap-0.5 items-center lg:items-end w-fit h-fit text-center lg:text-right">
                <div className="relative w-fit h-fit text-white font-earl text-4xl">
                  {autoDispatch.collection?.name}
                </div>
                <div className="relative w-fit h-fit font-digi text-lg text-verde">
                  {autoDispatch.collection?.drop?.name}
                </div>
              </div>
              {autoDispatch.collection && (
                <div className="relative w-fit h-fit text-white font-earl text-2xl">
                  {Number(autoDispatch.collection?.tokenIds?.length) -
                    (autoDispatch.collection?.soldTokens?.length
                      ? autoDispatch.collection?.soldTokens?.length
                      : 0) ===
                  0
                    ? "SOLD OUT"
                    : `${
                        Number(autoDispatch.collection?.tokenIds?.length) -
                        (autoDispatch.collection?.soldTokens?.length
                          ? autoDispatch.collection?.soldTokens?.length
                          : 0)
                      } /
                  ${Number(autoDispatch.collection?.tokenIds?.length)}`}
                </div>
              )}
              {autoDispatch.profile && autoDispatch.collection && (
                <Link
                  className="relative flex flex-row w-fit h-fit gap-3 items-center pt-3 cursor-pointer"
                  href={`/autograph/${
                    autoDispatch.profile?.handle?.split(".lens")[0]
                  }`}
                >
                  <div
                    className="relative w-6 h-6 cursor-pointer border border-ama rounded-full"
                    id="crt"
                  >
                    {createProfilePicture(autoDispatch.profile) !== "" && (
                      <Image
                        src={createProfilePicture(autoDispatch.profile)}
                        layout="fill"
                        alt="pfp"
                        className="rounded-full w-full h-full flex"
                        draggable={false}
                      />
                    )}
                  </div>
                  <div className="relative w-fit h-fit cursor-pointer text-ama font-arcade text-sm">
                    @{autoDispatch.profile?.handle?.split(".lens")[0]}
                  </div>
                </Link>
              )}
              <div className="relative w-5/6 break-words h-fit max-h-80 text-white font-earl text-base overflow-y-scroll">
                {autoDispatch.collection?.uri?.description}
              </div>
            </div>
            {autoDispatch.collection && (
              <div className="relative w-full h-fit py-10 flex justify-center items-center lg:justify-end lg:items-end">
                <Purchase
                  acceptedtokens={autoDispatch.collection?.acceptedTokens}
                  approved={approved}
                  currency={currency}
                  setCurrency={setCurrency}
                  totalAmount={totalAmount}
                  mainNFT={autoDispatch.collection}
                  approveSpend={approveSpend}
                  buyNFT={buyNFT}
                  purchaseLoading={purchaseLoading}
                />
              </div>
            )}
            <InDrop
              autoCollection={autoDispatch.collection}
              otherCollectionsDrop={otherCollectionsDrop}
              push={push}
              autoProfile={autoDispatch.profile}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Collection;
