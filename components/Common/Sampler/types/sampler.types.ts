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

export type RatesProps = {
  totalRev24: number;
  totalRevChange: number;
  totalRev48: number;
  totalPostChange: number;
};

export type StatsProps = {
  statTitles: any[][];
};
