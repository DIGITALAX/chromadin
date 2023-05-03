import { FunctionComponent } from "react";
import { ProfileProps } from "../types/sidebar.types";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import Image from "next/image";
import { useRouter } from "next/router";

const Profile: FunctionComponent<ProfileProps> = ({ profile }): JSX.Element => {
  const picture = createProfilePicture(profile);
  const router = useRouter();
  return (
    <div
      className="relative w-full sm:w-40 lg:w-full h-12 font-geom text-white border-white border rounded-tl-lg rounded-br-lg flex flex-row px-2 cursor-pointer bg-lensLight/70 gap-4 items-center justify-center"
      onClick={() => {
        if (
          router.asPath.includes("stream") ||
          router.asPath.includes("sampler")
        ) {
          !router.asPath.includes("?search=")
            ? router.push("#collect?option=account")
            : router.push(
                "#collect?option=account" +
                  `?search=${router.asPath.split("?search=")[1]}`
              );
        }
      }}
    >
      <div className="relative w-6 h-6 rounded-full" id="crt">
        {picture !== "" && (
          <Image
            src={picture}
            fill
            alt="pfp"
            className="rounded-full flex"
            draggable={false}
          />
        )}
      </div>
      <div className="relative w-fit h-fit text-sm sm:text-xs lg:text-sm font-geom text-pesa">
        @{profile?.handle?.split(".lens")[0] || ""}
      </div>
    </div>
  );
};

export default Profile;
