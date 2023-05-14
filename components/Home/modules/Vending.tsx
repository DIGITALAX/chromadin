import { ACCEPTED_TOKENS, INFURA_GATEWAY } from "@/lib/constants";
import { setMainNFT } from "@/redux/reducers/mainNFTSlice";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { Collection, VendingProps } from "../types/home.types";
import useDrop from "../hooks/useDrop";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import SearchVending from "@/components/Common/Buttons/SearchVending";
import FilterVending from "@/components/Common/Buttons/FilterVending";
import useViewer from "../hooks/useViewer";
import { setPriceFilter } from "@/redux/reducers/priceFilterSlice";
import { setDateFilter } from "@/redux/reducers/dateFilterSlice";
import lodash from "lodash";
import { setProfile } from "@/redux/reducers/profileSlice";

const Vending: FunctionComponent<VendingProps> = ({
  dispatch,
  router,
}): JSX.Element => {
  const { collections, collectionsLoading, error } = useDrop();
  const {
    setDropDownPriceSort,
    dropDownPriceSort,
    dropDownDateSort,
    setDropDownDateSort,
    handleSearch,
  } = useViewer();
  const dispatchCollections = useSelector(
    (state: RootState) => state.app.collectionsReducer.value
  );
  const priceFilter = useSelector(
    (state: RootState) => state.app.priceFilterReducer
  );
  const dateFilter = useSelector(
    (state: RootState) => state.app.dateFilterReducer
  );
  const search = useSelector(
    (state: RootState) => state.app.searchReducer.value
  );
  return (
    <div
      className={`relative w-full overflow-y-scroll gap-3 h-[28.6rem] p-4 flex flex-col`}
    >
      {error ? (
        <div className="relative w-full h-full flex flex-col items-center justify-center font-earl text-moda text-center">
          Unfortunately the subgraph isn&apos;t responding right now :/, tune in
          again soon to browse collections
        </div>
      ) : collectionsLoading ? (
        <div className="relative w-full h-full grid grid-cols-1 preG:grid-cols-2 sm:grid-cols-3 wrap:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index: number) => {
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
        </div>
      ) : (
        <div className="relative w-full h-fit flex flex-col items-start justify-center gap-8">
          <div className="relative w-full h-fit flex items-start justify-start flex-row gap-3">
            <FilterVending
              handleOpenDropdown={setDropDownPriceSort}
              openDropdown={dropDownPriceSort}
              values={priceFilter.values}
              setDispatchFilter={setPriceFilter}
              selectorValue={priceFilter.selected}
              dispatch={dispatch}
            />
            <FilterVending
              handleOpenDropdown={setDropDownDateSort}
              openDropdown={dropDownDateSort}
              values={dateFilter.values}
              setDispatchFilter={setDateFilter}
              selectorValue={dateFilter.selected}
              dispatch={dispatch}
            />
            <SearchVending handleSearch={handleSearch} defaultValue={search} />
          </div>
          <div className="relative w-full h-full grid grid-cols-1 preG:grid-cols-2 sm:grid-cols-3 wrap:grid-cols-4">
            {(collections?.length > 0 || dispatchCollections?.length > 0) &&
              lodash(
                collections?.length > 0
                  ? [...collections]
                  : [...dispatchCollections]
              )
                .filter((collection: Collection) => {
                  if (priceFilter.selected === "ALL") {
                    return true;
                  } else {
                    const matchingAddress = lodash
                      .find(
                        ACCEPTED_TOKENS,
                        ([token]) =>
                          token.toLowerCase() ===
                          priceFilter.selected.toLowerCase()
                      )?.[1]
                      ?.toLowerCase();
                    return collection.acceptedTokens.includes(matchingAddress!);
                  }
                })
                .map((collection: any) => {
                  if (priceFilter.selected === "ALL") {
                    return collection;
                  } else {
                    const matchingAddress = lodash
                      .find(
                        ACCEPTED_TOKENS,
                        ([token]) =>
                          token.toLowerCase() ===
                          priceFilter.selected.toLowerCase()
                      )?.[1]
                      ?.toLowerCase();
                    const matchingIndex = collection.acceptedTokens.indexOf(
                      matchingAddress!
                    );
                    const matchingPrice = parseFloat(
                      collection.basePrices[matchingIndex]
                    );
                    return { ...collection, matchingPrice };
                  }
                })
                .filter((collection: any) => {
                  if (priceFilter.selected === "ALL") {
                    return true;
                  } else {
                    return collection.matchingPrice !== undefined;
                  }
                })
                .sortBy((collection: any) => {
                  if (priceFilter.selected === "ALL") {
                    return 0;
                  } else {
                    return -collection.matchingPrice;
                  }
                })
                .sortBy((collection: any) => {
                  if (priceFilter.selected === "ALL") {
                    if (dateFilter.selected === "earliest") {
                      return collection.blockTimestamp;
                    } else if (dateFilter.selected === "latest") {
                      return -collection.blockTimestamp;
                    }
                  }
                })
                .filter((collection: any) => {
                  const searchValue = search?.toLowerCase();
                  const nameMatches = collection.name
                    ?.toLowerCase()
                    ?.includes(searchValue);
                  const dropNameMatches = collection.drop.name
                    ?.toLowerCase()
                    ?.includes(searchValue);
                  const handleMatches = collection.profile.handle
                    ?.toLowerCase()
                    ?.includes(searchValue);
                  return nameMatches || dropNameMatches || handleMatches;
                })
                .value()
                ?.map((collection: Collection, index: number) => {
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
                              price: collection?.basePrices,
                              acceptedTokens: collection?.acceptedTokens,
                              amount: collection?.amount,
                              tokenIds: collection?.tokenIds,
                              tokensSold: collection?.soldTokens,
                            })
                          );
                          !router.asPath.includes("?search=")
                            ? router.asPath.includes("?profile=")
                              ? router.push(
                                  router.asPath.split("?option=")[0] +
                                    "?option=fufillment?profile=" +
                                    router.asPath.split("?profile=")[1]
                                )
                              : router.push(
                                  router.asPath.split("?option=")[0] +
                                    "?option=fulfillment"
                                )
                            : router.asPath.includes("?profile=")
                            ? router.push(
                                router.asPath.split("?option=")[0] +
                                  "?option=fulfillment" +
                                  `?search=${
                                    router.asPath
                                      .split("?search=")[1]
                                      .split("?profile")[0] +
                                    "?profile=" +
                                    router.asPath.split("?profile")[0]
                                  }`
                              )
                            : router.push(
                                router.asPath.split("?option=")[0] +
                                  "?option=fulfillment" +
                                  `?search=${
                                    router.asPath.split("?search=")[1]
                                  }`
                              );
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
                          {Number(collection?.tokenIds?.length) -
                            (collection?.soldTokens?.length
                              ? collection?.soldTokens?.length
                              : 0)}
                        </div>
                      </div>
                      <div
                        className="relative flex flex-row w-fit h-fit gap-3 items-center pt-3 cursor-pointer"
                        onClick={() => {
                          router.push(
                            router.asPath.includes("?search=")
                              ? `https://www.chromadin.xyz/#wavs?option=history` +
                                  router.asPath
                                    .split("?search=")[1]
                                    .split("?profile=")[0] +
                                  "?profile=" +
                                  collection.profile?.handle
                              : `https://www.chromadin.xyz/#wavs?option=history?profile=${collection.profile?.handle}`
                          );
                          dispatch(
                            setProfile({
                              actionHandle: collection?.profile?.handle,
                              actionId: collection?.profile?.id,
                            })
                          );
                        }}
                      >
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
                })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Vending;
