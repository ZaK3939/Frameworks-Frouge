import { FrameRequest, getFrameMessage } from "@coinbase/onchainkit";
import { NextRequest, NextResponse } from "next/server";
import signMintData from "../../lib/signMint";
import { allowedOrigin } from "../../lib/origin";
import { errorResponse, verifiedAccounts } from "../../lib/responses";
import { Hex, encodeFunctionData, parseEther } from "viem";
import { FrameTransactionResponse } from "@coinbase/onchainkit/frame";
import { base } from "viem/chains";
import { FROUGE_NFT_ADDRESS } from "@/app/config";

export const nftAbi = [
  {
    type: "function",
    name: "mint",
    inputs: [
      { name: "to", type: "address", internalType: "address" },
      { name: "tokenId", type: "uint256", internalType: "uint256" },
      { name: "fid", type: "uint256", internalType: "uint256" },
      { name: "score", type: "uint256", internalType: "uint256" },
      { name: "sig", type: "bytes", internalType: "bytes" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
];

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, {
    neynarApiKey: process.env.NEYNAR_API_KEY,
  });
  const searchParams = req.nextUrl.searchParams;
  const gold = searchParams.get("gold") ?? "";
  if (isValid && allowedOrigin(message)) {
    const fid = message.interactor.fid;
    const address = message.interactor.verified_accounts[0].toLowerCase();
    if (address) {
      try {
        const sig = await signMintData({
          to: address as Hex,
          tokenId: 1,
          fid,
          score: Number(gold),
        });
        const txData: FrameTransactionResponse = {
          chainId: `eip155:${base.id}`,
          method: "eth_sendTransaction",
          params: {
            abi: [],
            data: encodeFunctionData({
              abi: nftAbi,
              functionName: "mint",
              args: [address, 1, fid, Number(gold), sig],
            }),
            to: FROUGE_NFT_ADDRESS,
            value: parseEther("0.000001").toString(), // 0.000001 ETH
          },
        };
        console.log("txData", txData);
        return NextResponse.json(txData);
      } catch (e) {
        console.error(e);
        return errorResponse();
      }
      console.log("go to errorResponse:mint");
      return errorResponse();
    } else {
      return verifiedAccounts(fid);
    }
  } else return new NextResponse("Unauthorized", { status: 401 });
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
