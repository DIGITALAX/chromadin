import { QuickProfilesInterface } from "@/components/Common/Wavs/types/wavs.types";
import { Collection, Drop } from "@/components/Home/types/home.types";
import { Profile } from "@/components/Home/types/lens.types";
import { Url } from "next/dist/shared/lib/router/router";
import { FormEvent } from "react";

export type InDropProps = {
  autoCollection: Collection | undefined;
  otherCollectionsDrop: Collection[];
  push: (
    url: Url,
    as?: Url | undefined,
    options?: any | undefined
  ) => Promise<boolean>;
  autoProfile: Profile | undefined;
};

export type BarProps = {
  push: (
    url: Url,
    as?: Url | undefined,
    options?: any | undefined
  ) => Promise<boolean>;
  handleConnect: () => void;
  handleLensSignIn: () => Promise<void>;
  connected: boolean;
  authStatus: boolean;
  profile: Profile | undefined;
  handleSearch: (e: FormEvent<Element>) => Promise<void>;
  searchOpen: boolean;
  searchResults: (Collection | Drop | QuickProfilesInterface)[];
  handleSearchChoose: (
    chosen: QuickProfilesInterface | Drop | Collection
  ) => Promise<void>;
  isLargeScreen: boolean;
};
