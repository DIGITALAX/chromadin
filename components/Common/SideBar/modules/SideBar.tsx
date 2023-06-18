import { FunctionComponent } from "react";
import Switcher from "./Switcher";
import Channels from "./Channels";
import Connect from "./Connect";
import Tabs from "./Tabs";
import Interactions from "../../Interactions/modules/Interactions";
import { SideBarProps } from "../types/sidebar.types";

const SideBar: FunctionComponent<SideBarProps> = ({
  profile,
  handleConnect,
  connected,
  handleLensSignIn,
  authStatus,
  tab,
  setTab,
  dispatch,
  viewer,
  dispatchVideos,
  options,
  videoSync,
  fetchMoreVideos,
  hasMore,
}): JSX.Element => {
  return (
    <div className="relative w-full lg:w-80 h-fit lg:h-full flex flex-col">
      <Switcher options={options} dispatch={dispatch} />
      <Tabs tab={tab} setTab={setTab} viewer={viewer} />
      {tab === 0 ? (
        <Channels
          dispatch={dispatch}
          dispatchVideos={dispatchVideos}
          videoSync={videoSync}
          fetchMoreVideos={fetchMoreVideos}
          hasMore={hasMore}
        />
      ) : (
        <Interactions viewer={viewer} />
      )}
      <Connect
        handleConnect={handleConnect}
        connected={connected}
        handleLensSignIn={handleLensSignIn}
        authStatus={authStatus}
        profile={profile}
      />
    </div>
  );
};

export default SideBar;
