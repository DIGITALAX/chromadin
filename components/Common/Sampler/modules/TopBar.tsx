import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { TopBarProps } from "../types/sampler.types";
import numeral from "numeral";
import FetchMoreLoading from "../../Loading/FetchMoreLoading";

const TopBar: FunctionComponent<TopBarProps> = ({
  totalCollects,
  totalMirrors,
  totalPosts,
  volumeCollectChange,
  volumeProfileChange,
  topBarLoading,
}): JSX.Element => {
  return (
    <div className="relative w-full h-24 flex flex-row bg-black/60 rounded-lg px-4 py-1.5">
      <div className="relative w-fit h-full flex flex-row items-center justify-start gap-4">
        {Array.from([
          ["TOTAL MIRRORS", totalMirrors],
          ["TOTAL COLLECTS", totalCollects],
          ["TOTAL POSTS", totalPosts],
        ]).map((value: any[], index: number) => {
          return (
            <div
              className="relative w-full h-full flex items-center justify-center flex-col font-arcade"
              key={index}
            >
              <div className="relative w-full h-fit flex items-center justify-center whitespace-nowrap">
                <div className="absolute w-full h-fit -top-1" id="amountBack">
                  {value[0]}
                </div>
                <div className="relative w-full h-fit text-white">
                  {value[0]}
                </div>
              </div>
              <div className="relative w-full h-fit flex items-center justify-center whitespace-nowrap">
                <div
                  className="absolute w-full h-fit text-4xl -top-1"
                  id="termBack"
                >
                  {numeral(value[1]).format("0.000a")}
                </div>
                <div className="relative w-full h-fit text-4xl" id="term">
                  {numeral(value[1]).format("0.000a")}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="relative w-fit h-full flex flex-row items-center justify-end gap-10 ml-auto">
        {Array.from([
          ["24hr Collect Volume Change", volumeCollectChange],
          ["24hr Profile Volume Change", volumeProfileChange],
        ]).map((value: any[], index: number) => {
          return (
            <div
              key={index}
              className="relative w-full h-full flex flex-col items-center justify-center"
            >
              <div className="relative w-2/3 h-fit flex items-center justify-end ml-auto text-xxs text-right font-arcade">
                <div className="absolute w-full h-fit -top-px" id="volumeBack">
                  {value[0]}
                </div>
                <div className="relative w-full h-fit text-white">
                  {value[0]}
                </div>
              </div>
              <div className="relative w-full h-full flex flex-row font-arcade items-center justify-center gap-2">
                {!topBarLoading && (
                  <div className="relative w-3 h-3 items-center justify-center flex">
                    <Image
                      src={`${INFURA_GATEWAY}/ipfs/${
                        value[1] < 1
                          ? "QmXfTo7frXU1aBh4ppnXSRk212xCbuBqApYRo78VFy4m13"
                          : "QmU3865HsaPwgUzvkFNrqy9iP91yWxm3XaA9y6hmRsXkfA"
                      }`}
                      layout="fill"
                      className="flex items-center justify-center"
                    />
                  </div>
                )}
                <div className="relative w-fit h-fit flex items-center justify-end ml-auto whitespace-nowrap">
                  <div
                    className="absolute w-full h-fit text-3xl -top-1"
                    id="percentBack"
                  >
                    {!topBarLoading && `${value[1]?.toFixed(2)}%`}
                  </div>
                  <div className="relative w-full h-fit text-white text-3xl">
                    {!topBarLoading ? (
                      `${value[1]?.toFixed(2)}%`
                    ) : (
                      <FetchMoreLoading size="4" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopBar;
