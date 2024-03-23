import { FrameRequest, getFrameMessage } from "@coinbase/onchainkit";
import { NextRequest, NextResponse } from "next/server";
import { encodeFunctionData, parseGwei } from "viem";
import { stageAbi } from "../../lib/checkPlayerStatus";
import { base } from "viem/chains";
import { FROUGE_STAGE_ADDRESS } from "../../config";

import { allowedOrigin } from "../../lib/origin";
import { FrameTransactionResponse } from "@coinbase/onchainkit/frame";
import { validButton } from "@/app/lib/buttonUtil";

async function getResponse(req: NextRequest): Promise<NextResponse | Response> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, {
    neynarApiKey: process.env.NEYNAR_API_KEY,
  });

  if (isValid && allowedOrigin(message) && validButton(message)) {
    const txData: FrameTransactionResponse = {
      chainId: `eip155:${base.id}`,
      method: "eth_sendTransaction",
      params: {
        abi: [],
        data: encodeFunctionData({
          abi: stageAbi,
          functionName: "gameAction",
          args: [message.interactor.fid, message.button - 1],
        }),
        to: FROUGE_STAGE_ADDRESS,
        value: parseGwei("10000").toString(), // 0.00001 ETH
      },
    };
    return NextResponse.json(txData);
  }

  return new NextResponse("Message not valid", { status: 500 });
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
