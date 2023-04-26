import { INFURA_GATEWAY } from "@/lib/constants";
import { setMainNFT } from "@/redux/reducers/mainNFTSlice";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { Collection, VendingProps } from "../types/home.types";
import useDrop from "../hooks/useDrop";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setOptions } from "@/redux/reducers/optionsSlice";

const Vending: FunctionComponent<VendingProps> = ({
  dispatch,
}): JSX.Element => {
  const { collections, collectionsLoading, error } = useDrop();
  const dispatchCollections = useSelector(
    (state: RootState) => state.app.collectionsReducer.value
  );
  return (
    <div
      className={`relative w-full h-[28.6rem] gap-3 p-4 overflow-y-scroll ${
        !error
          ? "grid grid-cols-1 preG:grid-cols-2 sm:grid-cols-3 wrap:grid-cols-4"
          : "flex flex-col"
      }`}
    >
      {error ? (
        <div className="relative w-full h-full flex flex-col items-center justify-center font-earl text-moda text-center">
          Unfortunately the subgraph isn&apos;t responding right now :/, tune in
          again soon to browse collections
        </div>
      ) : collectionsLoading ? (
        <>
          {Array.from({ length: 8 }).map((_: any, index: number) => {
            return (
              <div
                className="relative w-full h-72 flex flex-col items-center justify-center opacity-30 animate-pulse p-2 gap-2"
                key={index}
              >
                <div
                  className="rounded-tr-2xl w-full h-full"
                  id="staticLoad"
                ></div>
                <div className="relative flex flex-row w-fit h-fit gap-3 items-center pt-3">
                  <div
                    className="relative w-6 h-6 cursor-pointer border border-ama rounded-full"
                    id="vending"
                  ></div>
                  <div className="relative w-fit h-fit cursor-pointer text-ama font-arcade text-sm">
                    @!245%rXmes
                  </div>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        (collections?.length > 0 || dispatchCollections?.length > 0) &&
        (collections?.length > 0 ? collections : dispatchCollections)?.map(
          (collection: Collection, index: number) => {
            const profilePicture = createProfilePicture(
              collection?.profile,
              false
            );
            return (
              <div
                className="relative h-72 w-full flex flex-col p-2 gap-2"
                key={index}
              >
                <div
                  className="relative w-full h-full cursor-pointer rounded-tr-2xl"
                  id="staticLoad"
                  onClick={() => {
                    dispatch(
                      setMainNFT({
                        name: collection?.name,
                        media: collection?.uri?.image
                          .split("ipfs://")[1]
                          .replace(/"/g, "")
                          .trim(),
                        description: collection?.uri?.description,
                        type: collection?.uri?.type,
                        drop: collection?.drop,
                        creator: {
                          media: createProfilePicture(
                            collection.profile,
                            false
                          ),
                          name: collection?.profile?.handle,
                        },
                        price: collection?.prices,
                        acceptedTokens: collection?.acceptedTokens,
                        tokenIds: collection?.tokenIds,
                        tokensSold: collection?.soldTokens,
                      })
                    );
                    dispatch(setOptions("fulfillment"));
                  }}
                >
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/${collection?.uri?.image
                      .split("ipfs://")[1]
                      .replace(/"/g, "")
                      .trim()}`}
                    alt="vending"
                    layout="fill"
                    className="rounded-tr-2xl"
                    objectFit="cover"
                    draggable={false}
                  />
                </div>
                <div className="relative flex flex-row w-full h-fit gap-2  text-sm font-arcade">
                  <div className="relative uppercase text-white w-fit h-fit cursor-pointer whitespace-nowrap">
                    {collection?.name}
                  </div>
                  <div className="relative w-full h-fit text-ama justify-end flex">
                    {collection?.amount}
                  </div>
                </div>
                <div className="relative flex flex-row w-fit h-fit gap-3 items-center pt-3">
                  <div
                    className="relative w-6 h-6 cursor-pointer border border-ama rounded-full"
                    id="crt"
                  >
                    {profilePicture && profilePicture !== "" && (
                      <Image
                        src={profilePicture}
                        layout="fill"
                        alt="pfp"
                        className="rounded-full w-full h-full flex"
                        draggable={false}
                      />
                    )}
                  </div>
                  <div className="relative w-fit h-fit cursor-pointer text-ama font-arcade text-sm">
                    @{collection?.profile?.handle?.split(".lens")[0]}
                  </div>
                </div>
              </div>
            );
          }
        )
      )}
    </div>
  );
};

export default Vending;
