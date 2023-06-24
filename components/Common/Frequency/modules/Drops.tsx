import { FunctionComponent } from "react";
import { DropsProps } from "../types/collections.types";
import { setMainNFT } from "@/redux/reducers/mainNFTSlice";
import { Collection } from "@/components/Home/types/home.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import createProfilePicture from "@/lib/helpers/createProfilePicture";

const Drops: FunctionComponent<DropsProps> = ({
  collections,
  dispatch,
  collectionsLoading,
  router,
  moreCollectionsLoading,
}): JSX.Element => {
  return (
    <div className="relative w-[80%] h-full p-4 flex flex-row gap-4">
      {collectionsLoading || moreCollectionsLoading
        ? Array.from({ length: 7 }).map((_: any, index: number) => {
            return (
              <div
                className="relative w-60 h-40 flex flex-col items-center shrink-0 cursor-pointer"
                key={index}
              >
                <div
                  className="relative w-full h-full border-white border"
                  id="staticLoad"
                ></div>
                <div className="relative w-full h-fit flex flex-row items-center gap-2">
                  <div className="rounded-full bg-verde h-2 w-2"></div>
                  <div className="relative w-fit h-fit font-geom text-xs text-verde whitespace-nowrap">
                    TboPcMv^&fN
                  </div>
                  <div className="relative w-fit h-fit font-geom text-xs text-white whitespace-nowrap">
                    {" "}
                    — H!lPn&bQ@f
                  </div>
                </div>
              </div>
            );
          })
        : collections?.map((collection: Collection, index: number) => {
            const profileImage = createProfilePicture(
              collection?.profile,
              false
            );
            return (
              <div
                className="relative w-60 h-40 flex flex-col items-center shrink-0 cursor-pointer"
                key={index}
                onClick={() => {
                  dispatch(
                    setMainNFT({
                      name: collection?.name,
                      media: collection?.uri?.image?.split("ipfs://")[1],
                      description: collection?.uri?.description,
                      type: collection?.uri?.type,
                      drop: collection?.drop,
                      creator: {
                        media: profileImage,
                        name: collection?.profile?.handle,
                      },
                      price: collection?.basePrices,
                      acceptedTokens: collection?.acceptedTokens,
                      amount: collection?.amount,
                      tokenIds: collection?.tokenIds,
                      tokensSold: collection?.soldTokens,
                    })
                  );
                  if (
                    router.asPath.includes("#sampler") ||
                    router.asPath.includes("#chat")
                  ) {
                    if (router.asPath.includes("&post=")) {
                      router.push(
                        router.asPath.split(
                          router.asPath.includes("#chat") ? "#chat" : "#sampler"
                        )[0] +
                          "#collect?option=fulfillment" +
                          "&post=" +
                          router.asPath.split("&post=")[1]
                      );
                    } else if (router.asPath.includes("&profile=")) {
                      router.push(
                        router.asPath.split(
                          router.asPath.includes("#chat") ? "#chat" : "#sampler"
                        )[0] +
                          "#collect?option=fulfillment" +
                          "&profile=" +
                          router.asPath.split("&profile=")[1]
                      );
                    } else {
                      router.push(
                        router.asPath.split(
                          router.asPath.includes("#chat") ? "#chat" : "#sampler"
                        )[0] + "#collect?option=fulfillment"
                      );
                    }
                  } else {
                    if (router.asPath.includes("#")) {
                      if (router.asPath.includes("&profile=")) {
                        router.asPath.includes("?option=")
                          ? router.push(
                              router.asPath.split("?option=")[0] +
                                "?option=fulfillment" +
                                "&profile=" +
                                router.asPath.split("&profile=")[1]
                            )
                          : router.push(
                              "?option=fulfillment" +
                                "&profile=" +
                                router.asPath.split("&profile=")[1]
                            );
                      } else if (router.asPath.includes("&post=")) {
                        router.asPath.includes("?option=")
                          ? router.push(
                              router.asPath.split("?option=")[0] +
                                "?option=fulfillment" +
                                router.asPath
                                  .split("?option=fulfillment")[1]
                                  .split("&post=")[0] +
                                "&post=" +
                                router.asPath.split("&post=")[1]
                            )
                          : router.push(
                              "?option=fulfillment" +
                                router.asPath
                                  .split("?option=fulfillment")[1]
                                  .split("&post=")[0] +
                                "&post=" +
                                router.asPath.split("&post=")[1]
                            );
                      } else {
                        router.asPath.includes("?option=")
                          ? router.push(
                              router.asPath.split("?option=")[0] +
                                "?option=fulfillment" +
                                router.asPath.split("?option=fulfillment")[1]
                            )
                          : router.push("?option=fulfillment");
                      }
                    } else {
                      router.push("#stream?option=fulfillment");
                    }
                  }
                }}
              >
                <div
                  className="relative w-full h-full border-white border"
                  id="staticLoad"
                >
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/${
                      collection.uri.image.split("ipfs://")[1]
                    }`}
                    layout="fill"
                    objectFit="cover"
                    objectPosition="top"
                    className="w-full h-full"
                    draggable={false}
                  />
                </div>
                <div className="relative w-full h-fit flex flex-row items-center gap-2">
                  <div className="rounded-full bg-verde h-2 w-2"></div>
                  <div className="relative w-fit h-fit font-geom text-xs text-verde whitespace-nowrap">
                    {collection?.drop?.name?.length > 15
                      ? collection?.drop?.name.slice(0, 15) + "..."
                      : collection?.drop?.name}
                  </div>
                  <div className="relative w-fit h-fit font-geom text-xs text-white whitespace-nowrap">
                    {" "}
                    —{" "}
                    {collection?.name?.length > 7
                      ? collection?.name.slice(0, 7) + "..."
                      : collection?.name}
                  </div>
                </div>
              </div>
            );
          })}
    </div>
  );
};

export default Drops;
