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
    <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto overflow-x-scroll">
      <div className="relative w-fit h-full overflow-x-scroll grid grid-flow-col auto-cols-auto gap-2">
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
  );
};

export default QuickProfiles;
