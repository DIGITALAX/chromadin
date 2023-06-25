import { FunctionComponent } from "react";
import { CollectionsProps } from "../types/autograph.types";
import { Collection } from "@/components/Home/types/home.types";
import CollectionCase from "./CollectionCase";

const Collections: FunctionComponent<CollectionsProps> = ({
  autoCollections,
  router,
  autoProfile,
  handleShareCollection,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col gap-14">
      <div className="relative flex flex-col w-full h-fit gap-3">
        <div className="relative w-full h-full flex flex-col">
          <CollectionCase
            router={router}
            collection={autoCollections?.[0]}
            autoProfile={autoProfile}
            width={0}
            handleShareCollection={handleShareCollection}
          />
        </div>
        <div className="relative w-full h-fit overflow-x-scroll flex justify-end">
          <div className="relative w-fit h-fit gap-2 flex flex-row overflow-x-scroll">
            {autoCollections
              ?.filter((collection, index) => {
                if (
                  collection?.drop?.name === autoCollections[0]?.drop?.name &&
                  index !== 0
                ) {
                  return true;
                }
              })
              ?.map((collection: Collection, index: number) => {
                return (
                  <CollectionCase
                    router={router}
                    key={index}
                    collection={collection}
                    autoProfile={autoProfile}
                    width={1}
                    handleShareCollection={handleShareCollection}
                  />
                );
              })}
          </div>
        </div>
      </div>
      <div className="relative w-full h-[50rem] overflow-y-scroll justify-end items-start flex">
        <div className="relative w-fit h-fit gap-12 flex inline-flex flex-wrap overflow-y-scroll justify-end">
          {autoCollections
            ?.filter((collection) => {
              if (collection?.drop?.name !== autoCollections[0]?.drop?.name) {
                return true;
              }
            })
            ?.map((collection: Collection, index: number) => {
              return (
                <CollectionCase
                  router={router}
                  key={index}
                  collection={collection}
                  autoProfile={autoProfile}
                  width={2}
                  handleShareCollection={handleShareCollection}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Collections;
