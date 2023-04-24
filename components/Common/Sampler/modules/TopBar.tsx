import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";

const TopBar: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative w-full h-24 flex flex-row bg-black/60 rounded-lg top-4 px-4 py-1.5">
      <div className="relative w-fit h-full flex flex-row items-center justify-start gap-4">
        {Array.from([
          ["TOTAL MIRRORS", "1000"],
          ["TOTAL COLLECTS", "1000"],
          ["TOTAL POSTS", "1000"],
        ]).map((value: string[], index: number) => {
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
                  {value[1]}
                </div>
                <div className="relative w-full h-fit text-4xl" id="term">
                  {value[1]}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="relative w-fit h-full flex flex-row items-center justify-end gap-10 ml-auto">
        {Array.from([
          ["24hr Collect Volume", "2.35", "1.05 MATIC"],
          ["24hr Collect Price Volume", "3.45", "1.35 MATIC"],
        ]).map((value: string[], index: number) => {
          return (
            <div
              key={index}
              className="relative w-full h-full flex flex-row items-center justify-center"
            >
              <div className="relative w-3 h-4 items-center justify-center flex top-1">
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/QmXfTo7frXU1aBh4ppnXSRk212xCbuBqApYRo78VFy4m13`}
                  layout="fill"
                  className="flex items-center justify-center"
                />
              </div>
              <div className="relative w-full h-full flex flex-col font-arcade items-center justify-center">
                <div className="relative w-2/3 h-fit flex items-center justify-end ml-auto text-xxs text-right">
                  <div className="absolute w-full h-fit -top-1" id="volumeBack">
                    {value[0]}
                  </div>
                  <div className="relative w-full h-fit text-white">
                    {value[0]}
                  </div>
                </div>
                <div className="relative w-fit h-fit flex items-center justify-end ml-auto whitespace-nowrap">
                  <div
                    className="absolute w-full h-fit text-3xl -top-1"
                    id="percentBack"
                  >
                    {value[1]}%
                  </div>
                  <div className="relative w-full h-fit text-white text-3xl">
                    {value[1]}%
                  </div>
                </div>
                <div className="relative w-full h-fit text-white flex justify-end text-xxs items-center">
                  {value[2]}
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
