import { FunctionComponent } from "react";
import { AccountProps } from "../types/wavs.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import descriptionRegex from "@/lib/helpers/descriptionRegex";
import { IoGlobeOutline } from "react-icons/io5";
import { MdOutlineShareLocation } from "react-icons/md";
import { Collection } from "@/components/Home/types/home.types";
import { setFollowerOnly } from "@/redux/reducers/followerOnlySlice";

const Account: FunctionComponent<AccountProps> = ({
  profile,
  profileCollections,
  dispatch,
  profileCollectionsLoading,
  router
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col gap-2 items-start justify-center break-words">
      <div
        className="relative w-full h-44 rounded-md items-start flex justify-center"
        id="crt"
      >
        {(profile?.coverPicture as any)?.original?.url && (
          <Image
            src={
              (profile?.coverPicture as any)?.original?.url.includes(
                "https://lens.infura-ipfs.io/ipfs/"
              ) ||
              (profile?.coverPicture as any)?.original?.url.includes(
                "imagekit"
              ) ||
              (profile?.coverPicture as any)?.original?.url.includes(
                "nftstorage"
              )
                ? (profile?.coverPicture as any)?.original?.url
                : `${INFURA_GATEWAY}/ipfs/${
                    (profile?.coverPicture as any)?.original?.url?.includes(
                      "ipfs://"
                    )
                      ? (profile?.coverPicture as any)?.original?.url?.split(
                          "ipfs://"
                        )[1]
                      : (profile?.coverPicture as any)?.original?.url
                  }`
            }
            draggable={false}
            className="rounded-md flex w-full h-full"
            layout="fill"
            objectFit="cover"
            objectPosition={"middle"}
          />
        )}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black to-transparent"></div>
        <div className="absolute top-2 right-2 w-fit h-fit flex flex-row gap-2 items-center justify-end ml-auto text-xs font-dosis text-white">
          <div
            className="relative w-fit h-fit flex bg-black/30 p-1 rounded-md cursor-pointer active:scale-95"
            onClick={() =>
              dispatch(
                setFollowerOnly({
                  actionOpen: true,
                  actionFollowerId: profile?.id,
                  actionId: "",
                  actionIndex: "",
                })
              )
            }
          >
            {profile?.isFollowedByMe ? "Unfollow" : "Follow"}
          </div>
          {profile?.isFollowing && (
            <div className="relative w-fit h-fit flex bg-gray-400/30 p-1 rounded-md">
              Follows You
            </div>
          )}
        </div>
      </div>
      <div className="relative w-full h-fit flex sm:flex-nowrap flex-wrap flex-col items-start justify-center -top-10 px-4 gap-2">
        <div className="relative w-full h-fit flex flex-row items-center justify-start gap-2 sm:flex-nowrap flex-wrap">
          <div
            className="relative w-20 h-20 rounded-full flex items-center justify-center"
            id="crt"
          >
            {(profile?.picture as any)?.original?.url && (
              <Image
                src={
                  (profile?.picture as any)?.original?.url.includes(
                    "https://lens.infura-ipfs.io/ipfs/"
                  ) ||
                  (profile?.picture as any)?.original?.url.includes(
                    "imagekit"
                  ) ||
                  (profile?.picture as any)?.original?.url.includes(
                    "nftstorage"
                  )
                    ? (profile?.picture as any)?.original?.url
                    : `${INFURA_GATEWAY}/ipfs/${
                        (profile?.picture as any)?.original?.url?.includes(
                          "ipfs://"
                        )
                          ? (profile?.picture as any)?.original?.url?.split(
                              "ipfs://"
                            )[1]
                          : (profile?.picture as any)?.original?.url
                      }`
                }
                className="rounded-full flex w-full h-full"
                layout="fill"
                objectFit="cover"
                objectPosition={"middle"}
                draggable={false}
              />
            )}
          </div>
          <div
            className="relative w-fit h-fit items-center justify-center font-dosis flex"
            id="username1"
          >
            @{profile?.handle?.split(".lens")}
          </div>
          <div className="relative justify-start preG:justify-end items-center w-full preG:w-fit h-fit font-dosis text-white flex flex-row gap-3 flex ml-auto text-sm preG:pt-0 pt-5">
            <div className="relative w-fit h-fit flex items-center justify-end flex flex-col">
              <div
                className="relative w-full h-fit items-center justify-end"
                id="username1"
              >
                Followers
              </div>
              <div className="relative w-full h-fit items-center justify-end">
                {profile?.stats?.totalFollowers}
              </div>
            </div>
            <div className="relative w-fit h-fit flex items-center justify-end flex flex-col">
              <div
                className="relative w-full h-fit items-center justify-end"
                id="username1"
              >
                Following
              </div>
              <div className="relative w-full h-fit items-center justify-end">
                {profile?.stats?.totalFollowing}
              </div>
            </div>
          </div>
        </div>
        <div
          className="relative w-full break-words h-fit justify-start items-start text-left flex text-white font-dosis text-xs"
          dangerouslySetInnerHTML={{
            __html: descriptionRegex(
              profile?.bio ? (profile?.bio as string) : ""
            ),
          }}
        ></div>
        <div className="relative w-full h-fit flex flex-row items-start justify-center text-xs font-dosis text-white sm:flex-nowrap flex-wrap sm:gap-0 gap-3">
          <div className="relative w-full h-fit flex flex-row gap-4 justify-start items-center">
            {profile?.attributes?.find(
              (attribute) => attribute.key === "location"
            )?.value && (
              <div className="relative w-fit h-fit flex flex-row justify-center items-center gap-1">
                <div className="relative flex w-fit h-fit justify-center items-center">
                  <MdOutlineShareLocation color="white" size={10} />
                </div>
                <div className="relative flex w-fit h-fit justify-center items-center">
                  {
                    profile?.attributes?.find(
                      (attribute) => attribute.key === "location"
                    )?.value
                  }
                </div>
              </div>
            )}
            {profile?.attributes?.find(
              (attribute) => attribute.key === "website"
            )?.value && (
              <div className="relative w-fit h-fit flex flex-row justify-center items-center gap-1">
                <div className="relative flex w-fit h-fit justify-center items-center">
                  <IoGlobeOutline color="white" size={10} />
                </div>
                <div
                  className="relative flex w-fit h-fit justify-center items-center cursor-pointer text-bird"
                  onClick={() =>
                    window.open(
                      profile?.attributes
                        ?.find((attribute) => attribute.key === "website")
                        ?.value?.includes("https://")
                        ? profile?.attributes?.find(
                            (attribute) => attribute.key === "website"
                          )?.value
                        : `https://${
                            profile?.attributes?.find(
                              (attribute) => attribute.key === "website"
                            )?.value
                          }`
                    )
                  }
                >
                  {
                    profile?.attributes?.find(
                      (attribute) => attribute.key === "website"
                    )?.value
                  }
                </div>
              </div>
            )}
          </div>
          <div className="relative w-full h-fit flex flex-row gap-2 items-start justify-start sm:justify-end text-gray-400">
            <div className="relative w-fit h-fit flex items-center justify-start sm:justify-end flex flex-col">
              <div className="relative w-full h-fit items-center justify-start sm:justify-end">
                Collects
              </div>
              <div className="relative w-full h-fit items-center justify-start sm:justify-end">
                {profile?.stats?.totalCollects}
              </div>
            </div>
            <div className="relative w-fit h-fit flex items-center justify-start sm:justify-end flex flex-col">
              <div className="relative w-full h-fit items-center justify-start sm:justify-end">
                Comments
              </div>
              <div className="relative w-full h-fit items-center justify-start sm:justify-end">
                {profile?.stats?.totalComments}
              </div>
            </div>
            <div className="relative w-fit h-fit flex items-center justify-start sm:justify-end flex flex-col">
              <div className="relative w-full h-fit items-center justify-start sm:justify-end">
                Posts
              </div>
              <div className="relative w-full h-fit items-center justify-start sm:justify-end">
                {profile?.stats?.totalPublications}
              </div>
            </div>
            <div className="relative w-fit h-fit flex items-center justify-start sm:justify-end flex flex-col">
              <div className="relative w-full h-fit items-center justify-start sm:justify-end">
                Mirrors
              </div>
              <div className="relative w-full h-fit items-center justify-start sm:justify-end">
                {profile?.stats?.totalMirrors}
              </div>
            </div>
          </div>
        </div>
      </div>
      {profileCollections?.length > 0 && (
        <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto overflow-x-scroll">
          <div className="relative w-fit h-full overflow-x-scroll grid grid-flow-col auto-cols-auto gap-2">
            {profileCollections?.map((coll: Collection, index: number) => {
              return (
                <div
                  key={index}
                  className="relative rounded-md cursor-pointer active:scale-95 h-28 w-28 flex-shrink-0"
                  id="crt"
                  onClick={() =>
                    router.push(
                      `/autograph/collection/${coll?.name}`
                    )
                  }
                >
                  <Image
                    layout="fill"
                    className="rounded-md w-full h-full flex"
                    objectFit="cover"
                    objectPosition={"center"}
                    src={`${INFURA_GATEWAY}/ipfs/${
                      coll.uri.image?.split("ipfs://")[1]
                    }`}
                  />
                  <div className="relative absolute top-0 left-0 bg-black opacity-60 w-full h-full rounded-md hover:opacity-0"></div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
