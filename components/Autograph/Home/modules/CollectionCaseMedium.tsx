import { INFURA_GATEWAY } from "@/lib/constants";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { CollectionCaseProps } from "../types/autograph.types";

const CollectionCaseMedium: FunctionComponent<CollectionCaseProps> = ({
  router,
  collection,
  autoProfile,
  handleShareCollection,
  imageLoading,
  address,
  profileId,
  handleConnect,
  handleLensSignIn
}): JSX.Element => {
  return (
    <div className={`relative flex rounded-md w-72 h-80`} id="staticLoad">
      {collection?.uri?.image && (
        <div className="relative w-full h-full rounded-md">
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
        </div>
      )}
      <div className="absolute w-full h-fit flex flex-col gap-2 justify-end ml-auto items-end right-0 top-4">
        <div
          className={`relative flex w-fit p-1 rounded-l-md h-fit text-ama font-mana items-end justify-end whitespace-nowrap text-xs bg-black right-0 border border-ama`}
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
        <div
          className={`relative text-ama items-center flex cursor-pointer bg-black border border-ama rounded-l-md p-1 hover:opacity-70 active:scale-95 flex-row gap-1`}
          onClick={!address && !profileId
            ? () => handleConnect()
            : address && !profileId
            ? () => handleLensSignIn()
            : imageLoading
            ? () => {}
            : () => handleShareCollection(collection!)}
        >
          <div className="relative w-6 h-4 flex items-center justify-center">
            <Image
              layout="fill"
              alt="post to lens"
              src={`${INFURA_GATEWAY}/ipfs/QmTosnBk8UmFjJQJrTtZwfDHTegNyDmToPSg7N2ewGmg3Z`}
              draggable={false}
            />
          </div>
          <div className="relative w-4 h-4 flex items-center justify-center">
            <Image
              layout="fill"
              alt="post to lens"
              src={`${INFURA_GATEWAY}/ipfs/QmRr4axapEyQwjoGofb3BUwUT2yN115rnr2HYLLq2Awz2P`}
              draggable={false}
            />
          </div>
        </div>
      </div>
      <div
        className={`absolute bottom-0 flex flex-col w-full h-fit text-center items-center justify-center`}
      >
        <div
          className="relative w-8 h-8 border border-ama rounded-full flex items-start right-24 z-1 top-3 justify-start"
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
        <div
          className={`relative w-48 justify-center items-center text-center h-fit text-white font-mana words-break flex text-base pb-1 pt-2 bg-black rounded-t-md `}
        >
          {collection?.uri?.name?.length! > 12
            ? collection?.uri?.name?.slice(0, 12) + "..."
            : collection?.uri?.name}
        </div>
      </div>
    </div>
  );
};

export default CollectionCaseMedium;
