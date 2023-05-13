import { authClient } from "@/lib/lens/client";
import { ApolloQueryResult, gql } from "@apollo/client";

const PROFILE = `
query Profiles($request: ProfileQueryRequest!) {
    profiles(request: $request) {
      items {
        id
        picture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
          __typename
        }
        handle
      }
    }
  }
`;

const getProfiles = async (request: any): Promise<ApolloQueryResult<any>> => {
  return authClient.query({
    query: gql(PROFILE),
    variables: {
      request,
    },
    fetchPolicy: "no-cache",
  });
};

export default getProfiles;
