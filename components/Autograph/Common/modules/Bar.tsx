import { FunctionComponent } from "react";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import { BarProps } from "../../Collection/types/collection.types";
import Auth from "@/components/Common/SideBar/modules/Auth";
import SearchVending from "@/components/Common/Buttons/SearchVending";
import Video from "@/components/Common/Video/modules/Video";

const Bar: FunctionComponent<BarProps> = ({
  push,
  handleConnect,
  connected,
  handleLensSignIn,
  authStatus,
  profile,
  handleSearch,
  searchOpen,
  searchResults,
  handleSearchChoose,
}): JSX.Element => {
  return (
    <div className="relative w-full h-24 flex flex-row justify-start items-center bg-offBlack p-3 gap-6">
      <div className="relative flex flex-row w-fit h-fit justify-center items-end gap-3">
        <div
          className="relative w-fit h-fit font-arcade word-break uppercase text-sm lg:text-xl flex justify-center grid grid-flow-row auto-rows-auto cursor-pointer"
          onClick={() => push("/#stream?option=history")}
        >
          <span className="rainbow">CHR</span>
          <span className="rainbow">OMA</span>
          <span className="static">DIN</span>
        </div>
      </div>
      <div className="relative w-full">
        <Video viewer={"autograph"} />
      </div>
      <div className="relative w-full h-full flex justify-end items-center flex-row ml-auto">
        <SearchVending
          handleSearch={handleSearch}
          searchOpen={searchOpen}
          searchResults={searchResults}
          handleSearchChoose={handleSearchChoose}
          mainPage={true}
        />
        <Auth
          connected={connected}
          handleConnect={handleConnect}
          handleLensSignIn={handleLensSignIn}
          authStatus={authStatus}
          profile={profile}
          mainPage={true}
        />
      </div>
      <div className="relative w-fit h-full flex flex-col items-end justify-center gap-2 ml-auto">
        <div className="relative w-4 h-4">
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmTXyxVtGPSSyjjLzTfNdLANmc6Wiq8EToEGYefthNsXjw`}
            layout="fill"
            alt="player"
            draggable={false}
          />
        </div>
        <div className="relative w-full h-fit font-geom flex text-white flex flex-col">
          <div className="relative w-full h-fit flex justify-end text-xxs text-right">
            LIVE TRANSMISSION
          </div>
          <div className="relative w-full h-fit flex justify-end text-xxs ">
            24 - 7 - 365
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bar;
