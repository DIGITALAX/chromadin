import { gql } from "@apollo/client";
import { graphClient } from "@/lib/subgraph/client";

const COLLECTIONS = `
  query {
    collectionMinteds {
      basePrices
      uri
      collectionId
      amount
      acceptedTokens
      name
      owner
      blockTimestamp
      tokenIds
      soldTokens
    }
  }
`;

const COLLECTIONS_PAGINATION = `
query($first: Int, $skip: Int) {
  collectionMinteds(first: $first, skip: $skip, orderDirection: desc, orderBy: blockTimestamp) {
    basePrices
    uri
    collectionId
    amount
    acceptedTokens
    name
    owner
    blockTimestamp
    tokenIds
    soldTokens
  }
}`;

const COLLECTIONS_OWNER = `
query($owner: String) {
  collectionMinteds(where: {owner: $owner}, orderDirection: desc, orderBy: blockTimestamp) {
    basePrices
    uri
    collectionId
    amount
    acceptedTokens
    name
    owner
    blockTimestamp
    tokenIds
    soldTokens
  }
}`;

const COLLECTIONS_SEARCH = `
query($name: String) {
  collectionMinteds(where: {name_contains_nocase: $name}, orderDirection: desc, orderBy: blockTimestamp) {
    basePrices
    uri
    collectionId
    amount
    acceptedTokens
    name
    owner
    blockTimestamp
    tokenIds
    soldTokens
  }
}`;

const COLLECTIONS_DECRYPT = `
query($name: String, $owner: String) {
  collectionMinteds(where: {name_contains_nocase: $name, owner: $owner}, orderDirection: desc, orderBy: blockTimestamp) {
    basePrices
    uri
    collectionId
    amount
    acceptedTokens
    name
    owner
    blockTimestamp
    tokenIds
    soldTokens
  }
}`;

const COLLECTIONS_DROP = `
query($collectionId: String) {
  collectionMinteds(where: {collectionId: $collectionId}, orderDirection: desc, orderBy: blockTimestamp) {
    basePrices
    uri
    collectionId
    amount
    acceptedTokens
    name
    owner
    blockTimestamp
    tokenIds
    soldTokens
  }
}`;

export const getAllCollections = async (): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(COLLECTIONS),
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000); // 1 minute timeout
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};

export const getAllCollectionsPaginated = async (
  first: number,
  skip: number
): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(COLLECTIONS_PAGINATION),
    variables: {
      first,
      skip,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000); // 1 minute timeout
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};

export const getCollectionsProfile = async (owner: string): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(COLLECTIONS_OWNER),
    variables: {
      owner,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000); // 1 minute timeout
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};

export const getCollectionsSearch = async (name: string): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(COLLECTIONS_SEARCH),
    variables: {
      name,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000); // 1 minute timeout
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};

export const getCollectionsDecrypt = async (
  name: string,
  owner: string
): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(COLLECTIONS_DECRYPT),
    variables: {
      name,
      owner,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000); // 1 minute timeout
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};

export const getCollectionsDrop = async (
  collectionId: string
): Promise<any> => {
  const queryPromise = graphClient.query({
    query: gql(COLLECTIONS_DROP),
    variables: {
      collectionId,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000); // 1 minute timeout
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};
