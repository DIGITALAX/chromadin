import { FetchResult, gql } from "@apollo/client";
import { graphClient } from "@/lib/subgraph/client";

const HISTORY = `
  query {
    tokensBoughts(orderBy: blockTimestamp
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

const HISTORY_SPECIFIC = `
  query($buyer: String!) {
    tokensBoughts(where: {buyer: $buyer} orderBy: blockTimestamp
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

const getBuyerHistory = async (): Promise<FetchResult<any>> => {
  return graphClient.query({
    query: gql(HISTORY),
    fetchPolicy: "no-cache",
  });
};

export default getBuyerHistory;

export const getBuyerHistorySpecific = async (
  buyer: string
): Promise<FetchResult<any>> => {
  return graphClient.query({
    query: gql(HISTORY_SPECIFIC),
    variables: {
      buyer: buyer,
    },
    fetchPolicy: "no-cache",
  });
};
