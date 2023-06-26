import { FunctionComponent } from "react";
import { CollectionsProps } from "../types/autograph.types";
import { Collection } from "@/components/Home/types/home.types";
import CollectionCaseLarge from "./CollectionCaseLarge";
import CollectionCaseMedium from "./CollectionCaseMedium";
import CollectionCaseSmall from "./CollectionCaseSmall";

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
          <CollectionCaseLarge
            router={router}
            collection={autoCollections?.[0]}
            autoProfile={autoProfile}
            handleShareCollection={handleShareCollection}
          />
        </div>
        <div className="relative w-full h-fit overflow-x-scroll flex items-start">
        <div className="flex flex-row gap-2 w-fit h-fit ml-auto">
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
                  <CollectionCaseSmall
                    router={router}
                    key={index}
                    collection={collection}
                    autoProfile={autoProfile}
                    handleShareCollection={handleShareCollection}
                  />
                );
              })}
          </div>
        </div>
      </div>
      <div className="relative w-full h-[50rem] overflow-y-scroll justify-end items-start flex">
        <div className="relative w-fit h-fit gap-6 stuck1:gap-12 flex inline-flex flex-wrap overflow-y-scroll justify-end">
          {autoCollections
            ?.filter((collection) => {
              if (collection?.drop?.name !== autoCollections[0]?.drop?.name) {
                return true;
              }
            })
            ?.map((collection: Collection, index: number) => {
              return (
                <CollectionCaseMedium
                  router={router}
                  key={index}
                  collection={collection}
                  autoProfile={autoProfile}
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
