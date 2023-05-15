import { FunctionComponent } from "react";
import { SearchProps } from "../types/wavs.types";
import { Profile } from "@/components/Home/types/lens.types";
import Image from "next/legacy/image";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import InfiniteScroll from "react-infinite-scroll-component";

const Search: FunctionComponent<SearchProps> = ({
  searchProfiles,
  profilesFound,
  profilesOpenSearch,
  router,
  hasMoreSearch,
  fetchMoreSearch,
  setProfilesOpenSearch,
  setProfilesFound,
}): JSX.Element => {
  return (
    <div className="relative w-full preG:w-44 h-full flex flex-col items-start justify-end ml-auto">
      <input
        className={`relative row-start-1 col-start-1 h-10 bg-black border border-white font-dosis text-white p-2 rounded-md w-full text-sm`}
        placeholder="Explore Profiles"
        onChange={(e) => searchProfiles(e)}
      />
      {profilesOpenSearch && profilesFound.length > 0 && (
        <InfiniteScroll
          hasMore={hasMoreSearch}
          next={fetchMoreSearch}
          height={"10rem"}
          loader={""}
          dataLength={profilesFound?.length}
          className="absolute w-full overflow-y-scroll top-10 rounded-md z-1 flex flex-col"
        >
          {profilesFound?.map((profile: Profile, index: number) => {
            const profileImage: string = createProfilePicture(profile);
            return (
              <div
                key={index}
                className={`relative w-full h-10 px-3 py-2 bg-black flex flex-row border-x rounded-md gap-3 cursor-pointer items-center justify-center hover:bg-offBlack border-b`}
                onClick={() => {
                  router.push(
                    router.asPath +
                      `&profile=${profile.handle.split(".lens")[0]}`
                  );
                  setProfilesOpenSearch(false);
                  setProfilesFound([]);
                }}
              >
                <div className="relative flex flex-row w-full h-full text-white font-dosis lowercase place-self-center gap-2">
                  <div
                    className={`relative rounded-full flex bg-white w-5 h-5 items-center justify-center col-start-1`}
                    id="crt"
                  >
                    {profileImage !== "" && (
                      <Image
                        src={profileImage}
                        objectFit="cover"
                        alt="pfp"
                        layout="fill"
                        className="relative w-fit h-fit rounded-full items-center justify-center flex"
                        draggable={false}
                      />
                    )}
                  </div>
                  <div className="relative col-start-2 items-center justify-center w-fit h-fit text-xs flex">
                    @
                    {profile?.handle?.split(".lens").length > 15
                      ? profile?.handle?.split(".lens")[0]?.slice(0, 14)
                      : profile?.handle?.split(".lens")[0]}
                  </div>
                </div>
              </div>
            );
          })}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default Search;
