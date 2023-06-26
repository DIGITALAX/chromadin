import { FunctionComponent } from "react";
import { AllDropsProps } from "../type/drop.types";
import { Collection } from "@/components/Home/types/home.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import Link from "next/link";
import createProfilePicture from "@/lib/helpers/createProfilePicture";

const AllDrops: FunctionComponent<AllDropsProps> = ({
  autoDrop,
  autoCollections,
  autoProfile,
  push,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col gap-3">
      <div className="relative w-fit h-fit text-white font-earl text-3xl">
        {autoDrop?.uri?.name}
      </div>
      {autoProfile && (
        <Link
          className="relative flex flex-row w-fit h-fit gap-3 items-center pb-3 cursor-pointer"
          href={`/autograph/${autoProfile?.handle?.split(".lens")[0]}`}
        >
          <div
            className="relative w-6 h-6 cursor-pointer border border-ama rounded-full"
            id="crt"
          >
            {createProfilePicture(autoProfile) !== "" && (
              <Image
                src={createProfilePicture(autoProfile)}
                layout="fill"
                alt="pfp"
                className="rounded-full w-full h-full flex"
                draggable={false}
              />
            )}
          </div>
          <div className="relative w-fit h-fit cursor-pointer text-ama font-arcade text-sm">
            @{autoProfile?.handle?.split(".lens")[0]}
          </div>
        </Link>
      )}
      <div className="relative inline-flex flex-wrap gap-5">
        {autoCollections?.map((collection: Collection, index: number) => {
          return (
            <div
              key={index}
              className="flex flex-col relative w-fit h-fit pb-2 cursor-pointer hover:opacity-70"
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
              <div className="relative w-48 h-48 rounded-md" id="staticLoad">
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/${
                    collection?.uri?.image?.split("ipfs://")[1]
                  }`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                  draggable={false}
                />
              </div>
              <div className="flex flex-row relative w-full h-fit gap-1.5 justify-start font-earl">
                <div className="relative w-fit h-fit text-ama items-center justify-start flex cursor-pointer active:scale-95">
                  {collection?.uri?.name?.length > 15
                    ? collection?.uri?.name?.slice(0, 12) + "..."
                    : collection?.uri?.name}
                </div>
                <div className="relative w-fit h-fit text-ama justify-end flex ml-auto">
                  {Number(collection?.tokenIds?.length) -
                    (collection?.soldTokens?.length
                      ? collection?.soldTokens?.length
                      : 0)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllDrops;
