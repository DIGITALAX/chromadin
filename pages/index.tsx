import SideBar from "@/components/Common/SideBar/modules/SideBar";
import { NextPage } from "next";
import Head from "next/head";
import NFT from "@/components/Common/NFT/modules/NFT";
import View from "@/components/Home/View";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Interactions from "@/components/Common/Interactions/modules/Interactions";
import Switcher from "@/components/Common/SideBar/modules/Switcher";
import Connect from "@/components/Common/SideBar/modules/Connect";
import useConnect from "@/components/Common/SideBar/hooks/useConnect";
import Channels from "@/components/Common/SideBar/modules/Channels";
import useChannels from "@/components/Common/SideBar/hooks/useChannels";
import Tabs from "@/components/Common/SideBar/modules/Tabs";
import { useEffect } from "react";
import { setHistoryURLRedux } from "@/redux/reducers/historyURLSlice";
import { useRouter } from "next/router";

const Home: NextPage = (): JSX.Element => {
  const viewer = useSelector((state: RootState) => state.app.viewReducer.value);
  const mainNFT = useSelector(
    (state: RootState) => state.app.mainNFTReducer.value
  );
  const profile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const authStatus = useSelector(
    (state: RootState) => state.app.authStatusReducer.value
  );
  const dispatchVideos = useSelector(
    (state: RootState) => state.app.channelsReducer.value
  );
  const options = useSelector(
    (state: RootState) => state.app.optionsReducer.value
  );
  const videoSync = useSelector(
    (state: RootState) => state.app.videoSyncReducer
  );
  const hasMore = useSelector(
    (state: RootState) => state.app.hasMoreVideosReducer.value
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const { handleConnect, handleLensSignIn, connected } = useConnect();
  const { tab, setTab, fetchMoreVideos } = useChannels();

  useEffect(() => {
    dispatch(setHistoryURLRedux(router.asPath));
  }, []);
  return (
    <div className="relative w-full h-full flex flex-col overflow-x-hidden selection:bg-ama selection:text-moda">
      <Head>
        <title>Chromadin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="relative w-full h-full flex flex-row xl:flex-nowrap flex-wrap">
        <div className="relative w-full h-fit flex lg:hidden">
          <Switcher options={options} dispatch={dispatch} />
        </div>
        <div className="relative w-full h-full flex flex-row items-center">
          <div className="relative w-fit h-full hidden lg:flex">
            <SideBar
              handleConnect={handleConnect}
              connected={connected}
              handleLensSignIn={handleLensSignIn}
              authStatus={authStatus}
              profile={profile}
              tab={tab}
              setTab={setTab}
              viewer={viewer}
              dispatch={dispatch}
              dispatchVideos={dispatchVideos}
              options={options}
              videoSync={videoSync}
              hasMore={hasMore}
              fetchMoreVideos={fetchMoreVideos}
            />
          </div>
          <div className="relative w-full h-full flex flex-col gap-5 items-center justify-center">
            <View viewer={viewer} />
            {viewer !== "sampler" && viewer !== "chat" && (
              <NFT mainNFT={mainNFT} viewer={viewer} />
            )}
          </div>
        </div>
        <div className="w-full h-fit flex flex-col lg:hidden">
          <Connect
            handleConnect={handleConnect}
            connected={connected}
            handleLensSignIn={handleLensSignIn}
            authStatus={authStatus}
            profile={profile}
          />
          <Tabs tab={tab} setTab={setTab} viewer={viewer} />
          {tab === 0 ? (
            <Channels
              dispatch={dispatch}
              dispatchVideos={dispatchVideos}
              videoSync={videoSync}
              hasMore={hasMore}
              fetchMoreVideos={fetchMoreVideos}
            />
          ) : (
            <Interactions viewer={viewer} />
          )}
        </div>
        {viewer !== "sampler" && viewer !== "chat" && (
          <div className="w-fit h-full hidden xl:flex">
            <Interactions viewer={viewer} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
