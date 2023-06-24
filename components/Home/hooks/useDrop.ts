import { getAllCollectionsPaginated } from "@/graphql/subgraph/queries/getAllCollections";
import getAllDrops from "@/graphql/subgraph/queries/getAllDrops";
import { useEffect, useState } from "react";
import { Collection, Drop } from "../types/home.types";
import getDefaultProfile from "@/graphql/lens/queries/getDefaultProfile";
import { setMainNFT } from "@/redux/reducers/mainNFTSlice";
import { useDispatch, useSelector } from "react-redux";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import { RootState } from "@/redux/store";
import { setCollectionsRedux } from "@/redux/reducers/collectionsSlice";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";
import { setDropsRedux } from "@/redux/reducers/dropsSlice";
import { setHasMoreCollectionsRedux } from "@/redux/reducers/hasMoreCollectionSlice";
import { setCollectionPaginated } from "@/redux/reducers/collectionPaginatedSlice";
import { QuickProfilesInterface } from "@/components/Common/Wavs/types/wavs.types";
import { LENS_CREATORS } from "@/lib/constants";
import getProfiles from "@/graphql/lens/queries/getProfiles";
import { setQuickProfilesRedux } from "@/redux/reducers/quickProfilesSlice";
import { useRouter } from "next/router";
import { Profile } from "../types/lens.types";

const useDrop = () => {
  const [collectionsLoading, setCollectionsLoading] = useState<boolean>(false);
  const [moreCollectionsLoading, setMoreCollectionsLoading] =
    useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const dispatch = useDispatch();
  const collectionsDispatched = useSelector(
    (state: RootState) => state.app.collectionsReducer.value
  );
  const paginated = useSelector(
    (state: RootState) => state.app.collectionPaginatedReducer
  );
  const dropsDispatched = useSelector(
    (state: RootState) => state.app.dropsReducer.value
  );
  const hasMoreCollections = useSelector(
    (state: RootState) => state.app.hasMoreCollectionReducer.value
  );
  const feedDispatch = useSelector(
    (state: RootState) => state.app.feedReducer.value
  );
  const decryptFeed = useSelector(
    (state: RootState) => state.app.decryptFeedReducer.value
  );
  const router = useRouter();

  const handleAllCollections = async (): Promise<void> => {
    setCollectionsLoading(true);
    try {
      const data = await getAllCollectionsPaginated(12, 0);
      if (!data) {
        setError(true);
        setCollectionsLoading(false);
        return;
      }

      if (
        data?.data?.collectionMinteds?.length < 1 ||
        !data?.data?.collectionMinteds
      ) {
        setCollectionsLoading(false);
        return;
      }

      if (data?.data?.collectionMinteds?.length < 12) {
        dispatch(setHasMoreCollectionsRedux(false));
      } else {
        dispatch(setHasMoreCollectionsRedux(true));
      }

      const drops = await handleAllDrops();
      const fullDrops = await Promise.all(
        drops?.data?.dropCreateds?.map(async (drop: Drop) => {
          const dropjson = await fetchIPFSJSON(
            (drop as any)?.dropURI
              ?.split("ipfs://")[1]
              ?.replace(/"/g, "")
              ?.trim()
          );

          return {
            ...drop,
            uri: {
              name: dropjson.name,
              image: dropjson.image,
            },
          };
        })
      );
      dispatch(setDropsRedux(fullDrops));

      const validCollections = [...data?.data?.collectionMinteds].filter(
        (collection: Collection) => {
          const collectionDrops = [...fullDrops]?.filter((drop: any) =>
            drop?.collectionIds?.includes(collection?.collectionId)
          );
          return collectionDrops.length > 0;
        }
      );

      const collections = await validateDrop(validCollections, fullDrops);

      if (!collections) {
        setError(true);
        setCollectionsLoading(false);
        return;
      }

      const collectionDrops = fullDrops
        ?.filter((drop: any) =>
          drop.collectionIds.includes(
            collections![collections!?.length - 1]?.collectionId
          )
        )
        .sort((a: any, b: any) => b.dropId - a.dropId);

      dispatch(
        setMainNFT({
          name: collections![collections!?.length - 1].name,
          media:
            collections![collections!?.length - 1].uri.image.split(
              "ipfs://"
            )[1],
          description: collections![collections!?.length - 1].uri.description,
          type: collections![collections!?.length - 1].uri.type,
          drop: {
            name: collectionDrops[0]?.uri?.name,
            image: collectionDrops[0]?.uri?.image,
          },
          creator: {
            media: createProfilePicture(
              collections![collections!?.length - 1].profile,
              false
            ),
            name: collections![collections!?.length - 1].profile?.handle,
          },
          price: collections![collections!?.length - 1].basePrices,
          acceptedTokens: collections![collections!?.length - 1].acceptedTokens,
          amount: collections![collections!?.length - 1]?.amount,
          tokenIds: collections![collections!?.length - 1].tokenIds,
          tokensSold: collections![collections!?.length - 1].soldTokens,
        })
      );
      dispatch(setCollectionsRedux(collections!));
    } catch (err: any) {
      setError(true);
      console.error(err.message);
    }
    setCollectionsLoading(false);
  };

  const handleGetMoreCollections = async () => {
    if (moreCollectionsLoading || !hasMoreCollections) {
      return;
    }
    setMoreCollectionsLoading(true);
    try {
      const data = await getAllCollectionsPaginated(
        paginated.first,
        paginated.skip
      );
      if (!data) {
        setError(true);
        setMoreCollectionsLoading(false);
        return;
      }

      if (
        data?.data?.collectionMinteds?.length < 1 ||
        !data?.data?.collectionMinteds
      ) {
        setMoreCollectionsLoading(false);
        return;
      }

      if (data?.data?.collectionMinteds?.length < 12) {
        dispatch(setHasMoreCollectionsRedux(false));
      } else {
        dispatch(setHasMoreCollectionsRedux(true));
      }

      const validCollections = [...data?.data?.collectionMinteds].filter(
        (collection: Collection) => {
          const collectionDrops = [...dropsDispatched]?.filter((drop: any) =>
            drop?.collectionIds?.includes(collection.collectionId)
          );
          return collectionDrops.length > 0;
        }
      );

      const collections = await validateDrop(validCollections, dropsDispatched);

      if (!collections) {
        setError(true);
        setMoreCollectionsLoading(false);
        return;
      }

      dispatch(
        setCollectionsRedux([...collectionsDispatched, ...collections!])
      );
      dispatch(
        setCollectionPaginated({
          actionSkip: paginated.skip + 12,
          actionFirst: paginated.first,
        })
      );
    } catch (err: any) {
      setError(true);
      console.error(err.message);
    }
    setMoreCollectionsLoading(false);
  };

  const handleAllDrops = async (): Promise<any> => {
    try {
      const data = await getAllDrops();
      return data;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const validateDrop = async (
    validCollections: Collection[],
    drops: Drop[]
  ): Promise<Collection[] | undefined> => {
    try {
      return await Promise.all(
        validCollections.map(async (collection: Collection) => {
          const json = await fetchIPFSJSON(
            (collection.uri as any)
              ?.split("ipfs://")[1]
              ?.replace(/"/g, "")
              ?.trim()
          );

          let collectionDrops;

          collectionDrops = drops
            ?.filter((drop: any) =>
              drop.collectionIds?.includes(collection.collectionId)
            )
            ?.sort((a: any, b: any) => b.dropId - a.dropId);

          const defaultProfile = await getDefaultProfile(collection.owner);

          return {
            ...collection,
            uri: json,
            profile: defaultProfile?.data?.defaultProfile,
            drop: {
              name: collectionDrops[0]?.uri?.name,
              image: collectionDrops[0]?.uri?.image,
            },
          };
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getQuickProfiles = async () => {
    try {
      const profs = await getProfiles({ profileIds: LENS_CREATORS });
      const quickProfiles: QuickProfilesInterface[] =
        profs?.data?.profiles?.items?.map((prof: Profile) => {
          return {
            id: prof.id,
            handle: prof.handle,
            image: (prof?.picture as any)?.original?.url,
            followModule: prof?.followModule,
            name: prof?.name,
            ownedBy: prof?.ownedBy,
          };
        });
      dispatch(setQuickProfilesRedux(quickProfiles));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  // const handleShuffle = (): void => {
  //   const shuffled = lodash.shuffle(collectionsDispatched);
  //   dispatch(setCollectionsRedux(shuffled));
  // };

  useEffect(() => {
    if (router.asPath.includes("#chat") || router.asPath.includes("#collect")) {
      if (
        (!feedDispatch || feedDispatch.length < 1) &&
        (decryptFeed.length < 1 || !decryptFeed)
      ) {
        getQuickProfiles();
      }
    }
  }, [router.asPath]);

  useEffect(() => {
    if (!collectionsDispatched || collectionsDispatched?.length < 1) {
      handleAllCollections();
    }
  }, []);

  return {
    collectionsLoading,
    error,
    handleGetMoreCollections,
    moreCollectionsLoading,
  };
};

export default useDrop;
