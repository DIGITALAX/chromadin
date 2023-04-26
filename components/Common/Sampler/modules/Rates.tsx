import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";

const Rates: FunctionComponent = ({
  totalRev24,
  totalRevChange,
  totalPost24,
  totalPost48,
  totalRev48,
  totalPostChange,
}): JSX.Element => {
  return (
    <div className="relative w-full h-2/3 flex bg-black/60 rounded-lg flex-row gap-3 font-arcade">
      {Array.from([
        [
          totalRev24 / 10 ** 18,
          totalRevChange,
          totalRev48 / 10 ** 18,
          "24 HR POST REVENUE CHANGE",
        ],
        [totalPost24, totalPostChange, totalPost48, "48 HR POST AMOUNT CHANGE"],
      ]).map((value: any[], index: number) => {
        return (
          <div
            className="relative w-full h-full flex flex-col items-center justify-center gap-2"
            key={index}
          >
            <div className="relative w-fit h-fit flex items-center justify-center">
              <div className="absolute w-full h-fit -top-1" id="amountBack">
                {value[3]}
              </div>
              <div className="relative w-full h-fit text-white">{value[3]}</div>
            </div>
            <div className="relative w-4/5 h-fit py-3 px-1 bg-black rounded-xl flex items-center justify-center flex flex-row gap-4">
              <div className="relative w-4 h-1/2 flex items-center justify-center">
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
              <div className="relative w-fit h-fit flex items-center justify-center whitespace-nowrap">
                <div
                  className="absolute w-full h-fit text-3xl -top-1"
                  id="percent2Back"
                >
                  {value[1]?.toFixed(2)}%
                </div>
                <div className="relative w-full h-fit text-white text-3xl">
                  {value[1]?.toFixed(2)}%
                </div>
              </div>
            </div>
            <div className="relative w-fit h-fit flex flex-col items-center justify-center">
              <div className="relative w-fit h-fit flex flex-row items-center justify-center text-xxs gap-2 font-geom">
                <div className="relative w-fit h-fit flex justify-center items-center text-white">
                  {index === 1
                    ? "Value Gated Collects 24hrs"
                    : "Value Gated Amounts 24hrs "}
                </div>
                <div className="relative w-fit h-fit flex justify-center items-center text-moda">
                  {value[0]} {index === 1 ? "POSTS" : "MATIC"}
                </div>
              </div>
              <div className="relative w-fit h-fit flex flex-row items-center justify-center text-xxs gap-2 font-geom">
                <div className="relative w-fit h-fit flex justify-center items-center text-white">
                  {index === 1
                    ? "Value Gated Collects 48hrs "
                    : "Value Gated Amounts 48hrs "}
                </div>
                <div className="relative w-fit h-fit flex justify-center items-center text-moda">
                  {value[2]?.toFixed(1)} {index === 1 ? "POSTS" : "MATIC"}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Rates;
