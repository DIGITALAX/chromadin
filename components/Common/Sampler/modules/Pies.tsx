import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/image";
import { FunctionComponent } from "react";
import { PiesProps } from "../types/sampler.types";

const Pies: FunctionComponent<PiesProps> = ({
  topAccountsFollowed,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-row flex-wrap bg-black/60 rounded-lg gap-6 items-center justify-center p-3">
      <div className="relative w-full h-fit flex justify-center items-center font-arcade text-white text-sm">
        Top Followed Accounts 24HRS
      </div>
      {Array.from({ length: 12 }).map((_, index: number) => {
        const percentage = Number(topAccountsFollowed[index]?.percentage || 0);
        const numBars =
          Math.ceil(percentage / 5) > 15 ? 15 : Math.ceil(percentage / 5);
        return (
          <div
            className="relative w-fit h-fit flex flex-col font-earl text-white items-center justify-center"
            key={index}
          >
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmcPJ3gLHsRAdpR4X33PqFLTfjNZ3WxChzuW83txg6KENt`}
              width={80}
              height={80}
              draggable={false}
              alt="pie"
            />
            <div className="absolute bottom-8 w-1/3 flex flex-col items-center justify-end gap-px h-full">
              {Array.from({ length: numBars }, (_, index: number) => (
                <div
                  key={index}
                  className="w-full h-1 rounded-xl bg-gradient-to-r from-b1 to-b2"
                ></div>
              ))}
            </div>
            <div className="relative w-fit h-fit flex items-center justify-center text-center text-xxs font-geom pt-1">
              {topAccountsFollowed[index]?.percentage}%
            </div>
            <div className="relative w-fit h-fit flex items-center justify-center text-center text-xs">
              @
              {topAccountsFollowed[index]?.handle?.length > 13
                ? topAccountsFollowed[index]?.handle.slice(0, 11) + "..."
                : topAccountsFollowed[index]?.handle?.split(".lens")[0]}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Pies;
