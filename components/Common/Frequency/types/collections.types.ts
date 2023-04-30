import { Collection } from "@/components/Home/types/home.types";
import { NextRouter } from "next/router";
import { Ref } from "react";
import { AnyAction, Dispatch } from "redux";

export type DropsProps = {
  collections: Collection[];
  dispatch: Dispatch<AnyAction>;
  dispatchCollections: Collection[];
  collectionsLoading: boolean;
  router: NextRouter
};

export type DropsResults = {
  moveBackward: () => void;
  moveForward: () => void;
  currentIndex: number;
  moshArray: string[];
  moshVideoRef: Ref<HTMLVideoElement>;
  currentVideoIndex: number;
};
