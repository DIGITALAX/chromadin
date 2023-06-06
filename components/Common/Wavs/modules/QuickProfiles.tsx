import { FunctionComponent } from "react";
import {
  QuickProfilesInterface,
  QuickProfilesProps,
} from "../types/wavs.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";

const QuickProfiles: FunctionComponent<QuickProfilesProps> = ({
  quickProfiles,
  router,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col items-start justify-start gap-4">
      <div className="relative flex flex-col items-start justify-start gap-3 h-full w-full">
        <div
          className="relative flex flex-row gap-2"
          style={{ overflowX: "auto" }}
        >
          {quickProfiles?.map(
            (profile: QuickProfilesInterface, index: number) => {

              return (
                <div
                  key={index}
                  className="relative rounded-full hover:opacity-70 cursor-pointer active:scale-95 h-10 w-10"
                  id="crt"
                  onClick={() =>
                    router.push(
                      router.asPath.includes("?option=")
                        ? router.asPath +
                            `&profile=${profile?.handle?.split(".lens")[0]}`
                        : router.asPath.includes("&search=")
                        ? router.asPath.split("&search=")[0] +
                          `?option=history&search=${
                            router.asPath.split("&search=")[1]
                          }` +
                          `&profile=${profile?.handle?.split(".lens")[0]}`
                        : router.asPath +
                          `?option=history&profile=${
                            profile?.handle?.split(".lens")[0]
                          }`
                    )
                  }
                >
                  {profile?.image && (
                    <Image
                      layout="fill"
                      className="rounded-full w-full h-full"
                      objectFit="cover"
                      objectPosition={"center"}
                      src={
                        profile?.image?.includes(
                          "https://lens.infura-ipfs.io/ipfs/"
                        ) ||
                        profile?.image?.includes("imagekit") ||
                        profile?.image?.includes("nftstorage")
                          ? profile?.image
                          : `${INFURA_GATEWAY}/ipfs/${
                              profile?.image?.includes("ipfs://")
                                ? profile?.image?.split("ipfs://")[1]
                                : profile?.image
                            }`
                      }
                    />
                  )}
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickProfiles;
