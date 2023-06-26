import Bar from "@/components/Autograph/Common/modules/Bar";
import useAutoDrop from "@/components/Autograph/Drop/hooks/useAutoDrop";
import AllDrops from "@/components/Autograph/Drop/modules/AllDrops";
import MoreDrops from "@/components/Autograph/Drop/modules/MoreDrops";
import RouterChange from "@/components/Common/Loading/RouterChange";
import useConnect from "@/components/Common/SideBar/hooks/useConnect";
import useViewer from "@/components/Home/hooks/useViewer";
import { RootState } from "@/redux/store";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Drop: NextPage = (): JSX.Element => {
  const allDrops = useSelector(
    (state: RootState) => state.app.dropsReducer.value
  );
  const autoDispatch = useSelector(
    (state: RootState) => state.app.autoDropReducer
  );
  const profile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const authStatus = useSelector(
    (state: RootState) => state.app.authStatusReducer.value
  );
  const {
    query: { autograph, drop },
    push,
  } = useRouter();
  const { handleSearch, searchOpen, searchResults, handleSearchChoose } =
    useViewer();
  const { handleConnect, handleLensSignIn, connected } = useConnect();
  const { dropLoading, getDrop, otherDrops } = useAutoDrop();

  useEffect(() => {
    if (!dropLoading && autograph && drop && allDrops.length > 0) {
      getDrop(autograph as string, drop as string);
    }
  }, [autograph, drop, allDrops]);

  if (dropLoading) {
    return <RouterChange />;
  }

  return (
    <div
      className="relative w-full flex flex-col bg-black items-center justify-start h-full gap-6 z-0"
      id="calc"
    >
      <Head>
        <title>Chromadin | {autoDispatch.drop?.uri?.name?.toUpperCase()}</title>
        <meta
          name="og:url"
          content={`https://chromadin.xyz/autograph/${
            autoDispatch.profile?.handle?.split(".lens")[0]
          }/drop/${autoDispatch.drop?.uri?.name
            ?.replaceAll(" ", "-")
            ?.toLowerCase()}`}
        />
        <meta
          name="og:title"
          content={autoDispatch.drop?.uri?.name?.toUpperCase()}
        />
        <meta name="og:description" content={autoDispatch.drop?.uri?.name} />
        <meta
          name="og:image"
          content={
            !autoDispatch.drop?.uri?.image
              ? "https://chromadin.xyz/card.png/"
              : `https://chromadin.infura-ipfs.io/ipfs/${autoDispatch.drop?.uri?.image?.split(
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
          }/drop/${autoDispatch.drop?.uri?.name
            ?.replaceAll(" ", "-")
            ?.toLowerCase()}`}
        />
        <meta
          name="twitter:url"
          content={`https://chromadin.xyz/autograph/${
            autoDispatch.profile?.handle?.split(".lens")[0]
          }/drop/${autoDispatch.drop?.uri?.name
            ?.replaceAll(" ", "-")
            ?.toLowerCase()}`}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="canonical"
          href={
            !autoDispatch.drop?.uri?.image
              ? "https://chromadin.xyz/card.png/"
              : `https://chromadin.infura-ipfs.io/ipfs/${autoDispatch.drop?.uri?.image?.split(
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
      {autoDispatch && (
        <div className="relative flex flex-col w-full h-fit gap-10 px-8 sm:px-20 py-10">
          <AllDrops
            autoDrop={autoDispatch.drop}
            autoCollections={autoDispatch.collection}
            autoProfile={autoDispatch.profile}
            push={push}
          />
          {otherDrops?.length > 0 && (
            <MoreDrops
              otherDrops={otherDrops}
              autoProfile={autoDispatch.profile}
              push={push}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Drop;
