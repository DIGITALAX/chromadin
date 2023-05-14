import { apolloClient } from "@/lib/lens/client";
import { gql } from "@apollo/client";

const UNFOLLOW_DATA = `mutation CreateUnfollowTypedData($request: UnfollowRequest!) {
    createUnfollowTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          BurnWithSig {
            name
            type
          }
        }
        domain {
          version
          chainId
          name
          verifyingContract
        }
        value {
          nonce
          deadline
          tokenId
        }
      }
    }
  }`;

const createUnfollowTypedData = (CreateUnfollowRequest: any) => {
  return apolloClient.mutate({
    mutation: gql(UNFOLLOW_DATA),
    variables: {
      request: CreateUnfollowRequest,
    },
    fetchPolicy: "no-cache",
  });
};

export default createUnfollowTypedData;
