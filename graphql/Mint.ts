import { ApolloClient, InMemoryCache, gql } from "@apollo/client/core";

const AIRSTACK_ENDPOINT = "https://api.airstack.xyz/gql";
const AIRSTACK_API_KEY = process.env.AIRSTACK_API_KEY;

const client = new ApolloClient({
  uri: AIRSTACK_ENDPOINT,
  cache: new InMemoryCache(),
  headers: { Authorization: AIRSTACK_API_KEY || "" },
});

export async function AllHolders(): Promise<any> {
  const query = gql`
    query TokenHoldersFrogueNFT {
      Base: TokenBalances(
        input: {
          filter: {
            tokenAddress: { _eq: "0x250ABA37496C5dFb2AE3D75176f98c9cbB0394E3" }
          }
          blockchain: base
          limit: 200
        }
      ) {
        TokenBalance {
          owner {
            identity
          }
          amount
        }
      }
    }
  `;

  const response = await client.query({
    query,
  });
  return response.data;
}

export async function TokenBalance(address: string): Promise<any> {
  const query = gql`
      query FarcasterAccount {
        Base: TokenBalances(
          input: {filter: {owner: {_eq: "${address}"}, tokenAddress: {_eq: "0x250ABA37496C5dFb2AE3D75176f98c9cbB0394E3"}}, blockchain: base, limit: 200}
        ) {
          TokenBalance {
            amount
          }
        }
      }
    `;

  const response = await client.query({
    query,
  });
  return response.data;
}
