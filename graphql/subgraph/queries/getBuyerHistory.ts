import { FetchResult, gql } from "@apollo/client";
import { graphClient } from "@/lib/subgraph/client";

const HISTORY = `
  query($buyer_contains: String!) {
    tokensBoughts(where: {buyer_contains: $buyer_contains} orderBy: blockTimestamp
      orderDirection: desc) {
        uri
        totalPrice
        tokenIds
        name
        buyer
        creator
        transactionHash
        blockTimestamp
      }
  }
`;

const getBuyerHistory = async (
  buyer_contains: any
): Promise<FetchResult<any>> => {
  return graphClient.query({
    query: gql(HISTORY),
    variables: {
      buyer_contains: buyer_contains,
    },
    fetchPolicy: "no-cache",
  });
};

export default getBuyerHistory;
