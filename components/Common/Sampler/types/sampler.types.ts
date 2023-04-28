export type TopBarProps = {
  totalCollects: number;
  totalMirrors: number;
  totalPosts: number;
  volumeCollectChange: number;
  volumeProfileChange: number;
  topBarLoading: boolean;
};

export type PiesProps = {
  topAccountsFollowed: {
    handle: string;
    percentage: string;
  }[];
  piesRedux: {
    handle: string;
    percentage: string;
  }[];
  piesLoading: boolean;
};

export type UsePiesResults = {
  topAccountsFollowed: {
    handle: string;
    percentage: string;
  }[];
  piesLoading: boolean;
};

export type RatesProps = {
  totalChanges: number[];
  ratesRedux: number[];
  ratesLoading: boolean;
};

export type StatsProps = {
  statTitles: any[][];
  statsRedux: any[][];
  statsLoading: boolean;
};

export type UseRatesResults = {
  ratesLoading: boolean;
  totalChanges: number[];
};

export type UseStatsResults = {
  statTitles: any[][];
  statsLoading: boolean;
  totalChanges: number[];
  topAccountsFollowed: {
    handle: string;
    percentage: string;
  }[];
};

export type UseBarResults = {
  totalCollects: number;
  totalMirrors: number;
  totalPosts: number;
  volumeCollectChange: number;
  volumeProfileChange: number;
  topBarLoading: boolean;
};
