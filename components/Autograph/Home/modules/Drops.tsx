import { Drop } from "@/components/Home/types/home.types";
import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { DropsProps } from "../types/autograph.types";

const Drops: FunctionComponent<DropsProps> = ({
  allDrops,
  autoProfile,
  router,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col items-start justify-start gap-2">
      <div className="relative w-fit h-fit items-start justify-start font-earl text-white break-words whitespace-nowrap text-2xl">
        {`All Drops by ${autoProfile?.name?.toLowerCase()}`}
      </div>
      <div className="relative w-2/3 h-fit overflow-x-scroll flex items-start justify-start">
        <div className="flex flex-row gap-2 w-fit h-fit">
          {allDrops?.map((drop: Drop, index: number) => {
            return (
              <div
                key={index}
                className="relative w-fit h-fit flex flex-col gap-1.5 cursor-pointer hover:opacity-70"
                onClick={() =>
                  router.push(
                    `/autograph/${
                      autoProfile?.handle?.split(".lens")[0]
                    }/drop/${drop?.uri?.name
                      ?.replaceAll(" ", "-")
                      ?.toLowerCase()}`
                  )
                }
              >
                <div className="w-52 h-52 relative flex rounded-md">
                  {drop?.uri?.image && (
                    <Image
                      draggable={false}
                      src={`${INFURA_GATEWAY}/ipfs/${
                        drop?.uri?.image?.split("ipfs://")[1]
                      }`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  )}
                </div>
                <div className="relative w-fit h-fit justify-start items-start text-ama font-earl text-sm">
                  {drop?.uri?.name?.length > 20
                    ? drop?.uri?.name?.slice(0, 17) + "..."
                    : drop?.uri?.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Drops;
