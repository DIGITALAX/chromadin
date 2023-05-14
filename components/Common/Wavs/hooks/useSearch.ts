import { Profile } from "@/components/Home/types/lens.types";
import { searchProfile } from "@/graphql/lens/queries/search";
import { FormEvent, useState } from "react";

const useSearch = () => {
  const [profilesFound, setProfilesFound] = useState<Profile[]>([]);
  const [profilesOpenSearch, setProfilesOpenSearch] = useState<boolean>(false);
  const [searchTarget, setSearchTarget] = useState<string>("");
  const [paginated, setPaginated] = useState<any>();
  const [hasMoreSearch, setHasMoreSearch] = useState<boolean>(true);

  const searchProfiles = async (e: any) => {
    setSearchTarget(
      e.target.value.split(" ")[e.target.value.split(" ")?.length - 1]
    );

    try {
      if (
        e.target.value.split(" ")[e.target.value.split(" ")?.length - 1] !== ""
      ) {
        const allProfiles = await searchProfile({
          query:
            e.target.value.split(" ")[e.target.value.split(" ")?.length - 1],
          type: "PROFILE",
          limit: 10,
        });
        setProfilesOpenSearch(true);
        setProfilesFound(allProfiles?.data?.search?.items);
        setPaginated(allProfiles?.data?.search?.pageInfo);

        if (allProfiles?.data?.search?.items?.length === 10) {
          setHasMoreSearch(true);
        } else {
          setHasMoreSearch(false);
        }
      } else {
        setProfilesOpenSearch(false);
        setProfilesFound([]);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const fetchMoreSearch = async () => {
    if (!hasMoreSearch || searchTarget === "") return;

    try {
      const allProfiles = await searchProfile({
        query: searchTarget.split(" ")[searchTarget.split(" ")?.length - 1],
        type: "PROFILE",
        limit: 10,
        cursor: paginated?.next,
      });
      setProfilesOpenSearch(true);
      setProfilesFound([...profilesFound, ...allProfiles?.data?.search?.items]);
      setPaginated(allProfiles?.data?.search?.pageInfo);

      if (allProfiles?.data?.search?.items?.length === 10) {
        setHasMoreSearch(true);
      } else {
        setHasMoreSearch(false);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return {
    searchProfiles,
    profilesFound,
    profilesOpenSearch,
    hasMoreSearch,
    fetchMoreSearch,
    setProfilesOpenSearch,
    setProfilesFound
  };
};

export default useSearch;
