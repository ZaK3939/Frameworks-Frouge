import { ApolloClient, InMemoryCache, gql } from "@apollo/client/core"

const AIRSTACK_ENDPOINT = "https://api.airstack.xyz/gql"
const AIRSTACK_API_KEY = process.env.AIRSTACK_API_KEY

const client = new ApolloClient({
    uri: AIRSTACK_ENDPOINT,
    cache: new InMemoryCache(),
    headers: { Authorization: AIRSTACK_API_KEY || "" },
})

export async function AllHolders(): Promise<any> {
  const query = gql`
    query TokenHoldersFrogueNFT {
      Base: TokenBalances(
        input: {filter: {tokenAddress: {_eq: "0x436299b0E33BF08b8914034A2455Fd4aEBC0dd31"}}, blockchain: base, limit: 200}
      ) {
        TokenBalance {
          owner {
            identity
          }
          amount
        }
      }
    }
  `
  
  const response = await client.query({
      query
  })
  return response.data
}


export async function TokenBalance(address: string): Promise<any> {
    const query = gql`
      query FarcasterAccount {
        Base: TokenBalances(
          input: {filter: {owner: {_eq: "${address}"}, tokenAddress: {_eq: "0x436299b0E33BF08b8914034A2455Fd4aEBC0dd31"}}, blockchain: base, limit: 200}
        ) {
          TokenBalance {
            amount
          }
        }
      }
    `
    
    const response = await client.query({
        query
    })
    return response.data
}
