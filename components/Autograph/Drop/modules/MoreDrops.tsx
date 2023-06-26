import { FunctionComponent } from "react";
import { MoreDropsProps } from "../type/drop.types";
import { Collection } from "@/components/Home/types/home.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";

const MoreDrops: FunctionComponent<MoreDropsProps> = ({
  otherDrops,
  autoProfile,
  push,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col items-start justify-start">
      <div className="relative w-fit h-fit items-start justify-start font-earl text-white break-words text-lg">
        {`Other Collections by ${autoProfile?.name?.toLowerCase()}`}
      </div>
      <div className="relative w-full sm:w-2/3 h-fit overflow-x-scroll flex items-start justify-start">
        <div className="flex flex-row gap-2 w-fit h-fit">
          {otherDrops?.map((collection: Collection, index: number) => {
            return (
              <div
                key={index}
                className="relative w-fit h-fit flex flex-col gap-1.5 cursor-pointer hover:opacity-70"
                onClick={() =>
                  push(
                    `/autograph/${
                      autoProfile?.handle?.split(".lens")[0]
                    }/collection/${collection.name
                      ?.replaceAll(" ", "-")
                      ?.toLowerCase()}`
                  )
                }
              >
                <div className="w-24 h-24 relative flex rounded-md" id="staticLoad">
                  {collection?.uri?.image && (
                    <Image
                      draggable={false}
                      src={`${INFURA_GATEWAY}/ipfs/${
                        collection?.uri?.image?.split("ipfs://")[1]
                      }`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  )}
                </div>
                <div className="relative w-fit h-fit justify-start items-start text-ama font-earl text-sm">
                  {collection?.name?.length > 13
                    ? collection?.name?.slice(0, 10) + "..."
                    : collection?.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MoreDrops;
