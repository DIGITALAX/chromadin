import { INFURA_GATEWAY } from "@/lib/constants";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { CollectionCaseProps } from "../types/autograph.types";

const CollectionCase: FunctionComponent<CollectionCaseProps> = ({
  router,
  collection,
  autoProfile,
  width,
  handleShareCollection,
}): JSX.Element => {
  return (
    <div
      className={`relative flex rounded-md ${
        width === 1 ? "w-40" : width === 2 ? "w-60 stuck1:w-72" : "w-full"
      } ${width === 1 ? "h-40" : width === 2 ? "h-72 stuck1:h-80" : "h-[40rem]"}`}
      id="staticLoad"
    >
      {collection?.uri?.image && (
        <Image
          src={`${INFURA_GATEWAY}/ipfs/${
            collection?.uri?.image?.split("ipfs://")[1]
          }`}
          layout="fill"
          objectFit="cover"
          className="rounded-md cursor-pointer hover:opacity-80"
          draggable={false}
          onClick={() =>
            router.push(
              `/autograph/${
                autoProfile?.handle?.split(".lens")[0]
              }/collection/${collection?.uri?.name
                ?.replaceAll(" ", "-")
                ?.toLowerCase()}`
            )
          }
        />
      )}
      <div
        className={`absolute right-2 w-5/6 h-fit flex items-end justify-end ml-auto z-1 ${
          width === 1 ? "bottom-1" : "bottom-3"
        }`}
      >
        <div
          className={`relative w-full h-fit flex ml-auto justify-end items-end ${
            width === 0 ? "flex-row" : "flex-col"
          }`}
        >
          <div className="absolute w-full h-full">
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmfDmMCcgcseCFzGam9DbmDk5sQRbt6zrQVhvj4nTeuLGq`}
              layout="fill"
              alt="backdrop"
              priority
              objectFit="cover"
              draggable={false}
              className="rounded-md w-full h-full"
            />
          </div>
          <div className={`relative w-fit h-fit flex items-end p-2 flex-row`}>
            <div className="relative w-fit h-fit flex flex-col gap-3">
              <div
                className={`relative flex w-fit h-fit gap-3 items-center ${
                  width === 1 ? "flex-col" : "flex-row"
                }`}
              >
                <div
                  className="relative w-6 h-6 border border-ama rounded-full"
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
                <div className="relative w-fit h-fit text-ama font-arcade text-sm">
                  @
                  {autoProfile?.handle?.length > 10
                    ? autoProfile?.handle?.split(".lens")[0]?.slice(0, 12) +
                      "..."
                    : autoProfile?.handle?.split(".lens")[0]}
                </div>
              </div>
              <div
                className={`relative text-ama items-center flex cursor-pointer active:scale-95 ${
                  width === 1 ? "w-2 h-2" : "w-4 h-4"
                }`}
                onClick={() => handleShareCollection(collection!)}
              >
                <Image
                  layout="fill"
                  alt="post to lens"
                  src={`${INFURA_GATEWAY}/ipfs/QmRbgQM3Unc2wYYJStNHP4Y2JvVk3HrP5rnrmCNE1u9cWu`}
                  draggable={false}
                />
              </div>
            </div>
          </div>
          <div
            className={`relative flex flex-col w-fit h-fit text-right items-end ml-auto pr-2 pb-2`}
          >
            <div
              className={`relative flex w-fit h-fit text-ama font-earl pb-2 ${
                width === 0 ? "text-xl" : width === 1 ? "text-sm" : "text-base"
              }`}
            >
              {Number(collection?.tokenIds?.length) -
                (collection?.soldTokens?.length
                  ? collection?.soldTokens?.length
                  : 0) ===
              0
                ? "SOLD OUT"
                : `${
                    Number(collection?.tokenIds?.length) -
                    (collection?.soldTokens?.length
                      ? collection?.soldTokens?.length
                      : 0)
                  } /
                  ${Number(collection?.tokenIds?.length)}`}
            </div>
            {width !== 1 && (
              <div
                className={`relative w-fit h-fit text-verde font-earl ${
                  width === 0
                    ? "text-base"
                    : width === 1
                    ? "text-xs"
                    : "text-sm"
                } words-break flex`}
              >
                {collection?.drop?.name?.length! > 15
                  ? collection?.drop?.name?.slice(0, 12) + "..."
                  : collection?.drop?.name}
              </div>
            )}
            <div
              className={`relative w-fit h-fit text-white font-earl words-break flex ${
                width === 0 ? "text-4xl" : width === 1 ? "text-base" : "text-lg"
              }`}
            >
              {collection?.uri?.name?.length! > 15
                ? collection?.uri?.name?.slice(0, 12) + "..."
                : collection?.uri?.name}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCase;
