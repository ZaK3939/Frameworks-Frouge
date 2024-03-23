import { Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { CHAIN_ID, FROUGE_NFT_ADDRESS } from "../config";

const SIGNER_PRIVATE_KEY = (process.env.SIGNER_PRIVATE_KEY ?? "0x00") as Hex;

const account = privateKeyToAccount(SIGNER_PRIVATE_KEY);

// const chainId = base.id;

const domain = {
  name: "FROUGE NFT MINT",
  version: "1",
  chainId: CHAIN_ID,
  verifyingContract: FROUGE_NFT_ADDRESS,
} as const;

export const types = {
  Mint: [
    { name: "to", type: "address" },
    { name: "tokenId", type: "uint256" },
    { name: "fid", type: "uint256" },
    { name: "score", type: "uint256" },
  ],
} as const;

interface MintData {
  to: Hex;
  tokenId: number;
  fid: number;
  score: number;
}

export async function signMintData(mintData: MintData): Promise<Hex> {
  return account.signTypedData({
    domain,
    types,
    primaryType: "Mint",
    message: {
      to: mintData.to,
      tokenId: BigInt(mintData.tokenId),
      fid: BigInt(mintData.fid),
      score: BigInt(mintData.score),
    },
  });
}

export default signMintData;
