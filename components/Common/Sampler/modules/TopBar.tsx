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
    <div className="relative w-full h-fit mid:h-24 flex flex-col mid:flex-row bg-black/60 rounded-lg px-4 py-1.5 gap-4 mid:gap-0">
      <div className="relative w-full mid:w-fit h-full flex flex-row items-center justify-center mid:justify-start gap-4 preG:flex-nowrap flex-wrap">
        {Array.from([
          ["TOTAL MIRRORS", totalMirrors],
          ["TOTAL COLLECTS", totalCollects],
          ["TOTAL PUBS", totalPosts],
        ]).map((value: any[], index: number) => {
          return (
            <div
              className="relative w-fit mid:w-full h-fit preG:h-full flex items-center justify-center flex-col font-arcade mid:text-left text-center"
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
      <div className="relative w-full mid:w-fit h-full flex flex-row items-center justify-center mid:justify-end gap-4 mid:gap-10 ml-auto preG:flex-nowrap flex-wrap">
        {Array.from([
          ["Δ 24hr Collect Volume", volumeCollectChange],
          ["Δ 24hr Profile Volume", volumeProfileChange],
        ]).map((value: any[], index: number) => {
          return (
            <div
              key={index}
              className="relative mid:w-full h-fit preG:h-full flex flex-col items-center justify-center"
            >
              <div className="relative w-2/3 h-fit flex items-center justify-end text-xxs text-center mid:text-right font-arcade whitespace-nowrap word-break">
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
                      draggable={false}
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
