import { FetchResult, gql } from "@apollo/client";
import { graphClient } from "@/lib/subgraph/client";

const HISTORY = `
  query($first: Int, $skip: Int) {
    tokensBoughts(first: $first, skip: $skip, orderDirection: desc, orderBy: blockTimestamp) {
        uri
        totalPrice
        tokenIds
        name
        buyer
        creator
        transactionHash
        blockTimestamp
        chosenAddress
        price
      }
  }
`;

const HISTORY_SPECIFIC = `
  query($buyer: String!, $first: Int, $skip: Int) {
    tokensBoughts(where: {buyer: $buyer} orderBy: blockTimestamp
      orderDirection: desc, first: $first, skip: $skip) {
        uri
        totalPrice
        tokenIds
        name
        buyer
        creator
        transactionHash
        blockTimestamp
        chosenAddress
        price
      }
  }
`;

const getBuyerHistory = async (
  first: number,
  skip: number
): Promise<FetchResult<any>> => {
  return graphClient.query({
    query: gql(HISTORY),
    variables: {
      first,
      skip,
    },
    fetchPolicy: "no-cache",
  });
};

export default getBuyerHistory;

export const getBuyerHistorySpecific = async (
  buyer: string,
  first: number,
  skip: number
): Promise<FetchResult<any>> => {
  return graphClient.query({
    query: gql(HISTORY_SPECIFIC),
    variables: {
      buyer,
      first,
      skip,
    },
    fetchPolicy: "no-cache",
  });
};
