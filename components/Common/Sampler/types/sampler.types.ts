export type TopBarProps = {
  totalCollects: number;
  totalMirrors: number;
  totalPosts: number;
  volumeCollectChange: number;
  volumeProfileChange: number;
};

export type PiesProps = {
  topAccountsFollowed: {
    handle: string;
    percentage: string;
  }[];
};
