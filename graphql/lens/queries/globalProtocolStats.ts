import { authClient } from "@/lib/lens/client";
import { gql } from "@apollo/client";

const GLOBAL_STATS = `
query GlobalProtocolStats {
    globalProtocolStats(request: null) {
      totalPosts
      totalMirrors
      totalCollects
    }
  }
`;

const VOLUME_STATS = `
query GlobalProtocolStats($request: GlobalProtocolStatsRequest) {
    globalProtocolStats(request: $request) {
      totalProfiles
      totalCollects
    }
  }`;

export const globalProtocolStats = () => {
  return authClient.query({
    query: gql(GLOBAL_STATS),
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });
};

export const volumeStats = (request: any) => {
  return authClient.query({
    query: gql(VOLUME_STATS),
    variables: {
      request,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });
};
