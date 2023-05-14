import { apolloClient, authClient } from "@/lib/lens/client";
import { ApolloQueryResult, gql } from "@apollo/client";

const FOLLOWING = `
query Profile($request: SingleProfileQueryRequest!, $profileId: ProfileId) {
  profile(request: $request) {
    isFollowing(who: $profileId)
  }
}
`;

export const getFollowing = async (
  request: any,
  profileId: any
): Promise<ApolloQueryResult<any>> => {
  return authClient.query({
    query: gql(FOLLOWING),
    variables: {
      request,
      profileId,
    },
    fetchPolicy: "no-cache",
  });
};

export const getFollowingAuth = async (
  request: any,
  profileId: any
): Promise<ApolloQueryResult<any>> => {
  return apolloClient.query({
    query: gql(FOLLOWING),
    variables: {
      request,
      profileId,
    },
    fetchPolicy: "no-cache",
  });
};
