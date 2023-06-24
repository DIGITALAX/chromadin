import { setOptions } from "@/redux/reducers/optionsSlice";
import { setView } from "@/redux/reducers/viewSlice";
import { RootState } from "@/redux/store";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Collection, Drop } from "../types/home.types";
import { getCollectionsSearch } from "@/graphql/subgraph/queries/getAllCollections";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";
import { QuickProfilesInterface } from "@/components/Common/Wavs/types/wavs.types";
import getDefaultProfile from "@/graphql/lens/queries/getDefaultProfile";
import { Profile } from "../types/lens.types";
import { setAutographRedux } from "@/redux/reducers/autographSlice";

const useViewer = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const viewer = useSelector((state: RootState) => state.app.viewReducer.value);
  const dropsDispatched = useSelector(
    (state: RootState) => state.app.dropsReducer.value
  );
  const quickProfiles = useSelector(
    (state: RootState) => state.app.quickProfilesReducer.value
  );
  const [dropDownPriceSort, setDropDownPriceSort] = useState<boolean>(false);
  const [dropDownDateSort, setDropDownDateSort] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<
    (Collection | QuickProfilesInterface | Drop)[]
  >([]);

  const handleSearch = async (e: FormEvent) => {
    if (
      (e.target as HTMLFormElement).value.trim() === "" ||
      !(e.target as HTMLFormElement).value
    ) {
      setSearchOpen(false);
      return;
    }
    setSearchOpen(true);

    try {
      const data = await getCollectionsSearch(
        (e.target as HTMLFormElement).value
      );
      const collectionsMatched = await Promise.all(
        data?.data?.collectionMinteds.map(async (collection: any) => {
          const json = await fetchIPFSJSON(
            (collection as any)?.uri
              ?.split("ipfs://")[1]
              ?.replace(/"/g, "")
              ?.trim()
          );
          return {
            ...collection,
            uri: json,
          };
        })
      );

      const dropsMatch = dropsDispatched.filter((drop: Drop) => {
        if (
          drop.uri.name
            ?.toLowerCase()
            ?.includes((e.target as HTMLFormElement).value.toLowerCase())
        ) {
          return drop;
        }
      });
      const profilesMatch = quickProfiles.filter(
        (profile: QuickProfilesInterface) => {
          if (
            profile?.handle
              ?.toLowerCase()
              .includes((e.target as HTMLFormElement).value.toLowerCase()) ||
            profile?.name
              ?.toLowerCase()
              .includes((e.target as HTMLFormElement).value.toLowerCase())
          ) {
            return profile;
          }
        }
      );

      setSearchResults([
        ...collectionsMatched,
        ...dropsMatch,
        ...profilesMatch,
      ]);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (router.asPath.includes("#")) {
      if (router.asPath.includes("&profile=")) {
        dispatch(setView(router.asPath.split("#")[1].split("?option=")[0]));
        dispatch(setOptions(router.asPath.split("#")[1].split("?option=")[1]));
      } else if (router.asPath.includes("&post=")) {
        dispatch(setView(router.asPath.split("#")[1].split("?option=")[0]));
        dispatch(setOptions(router.asPath.split("#")[1].split("?option=")[1]));
      } else {
        dispatch(setView(router.asPath.split("#")[1].split("?option=")[0]));
        dispatch(setOptions(router.asPath.split("#")[1].split("?option=")[1]));
      }
    }
  }, [router.asPath]);

  const handleSearchChoose = async (
    chosen: QuickProfilesInterface | Drop | Collection
  ): Promise<void> => {
    setSearchOpen(false);
    let autograph: Profile;
    if ((chosen as Collection)?.acceptedTokens.length > 0) {
      const defaultProfile = await getDefaultProfile(
        (chosen as Collection).owner
      );
      autograph = defaultProfile?.data?.defaultProfile;
      router.push(`/autograph/collection/${(chosen as Collection)?.uri?.name}`);
    } else if ((chosen as QuickProfilesInterface)?.handle) {
      const defaultProfile = await getDefaultProfile(
        (chosen as QuickProfilesInterface).ownedBy
      );
      autograph = defaultProfile?.data?.defaultProfile;
      router.push(`/autograph/${autograph}`);
    } else {
      const defaultProfile = await getDefaultProfile((chosen as Drop).creator);
      autograph = defaultProfile?.data?.defaultProfile;
      router.push(`/autograph/drop/${(chosen as Drop).uri.name}`);
    }

    dispatch(setAutographRedux(autograph));
  };

  return {
    viewer,
    dropDownPriceSort,
    setDropDownPriceSort,
    dropDownDateSort,
    setDropDownDateSort,
    handleSearch,
    searchOpen,
    searchResults,
    handleSearchChoose,
  };
};

export default useViewer;
