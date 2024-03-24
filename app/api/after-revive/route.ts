import { FrameRequest, getFrameMessage } from "@coinbase/onchainkit";
import { NextRequest, NextResponse } from "next/server";
import { encodeFunctionData, parseGwei } from "viem";
import { stageAbi } from "../../lib/checkPlayerStatus";
import { base } from "viem/chains";
import { FRAME_ID, FROUGE_STAGE_ADDRESS } from "../../config";

import { allowedOrigin } from "../../lib/origin";
import { FrameTransactionResponse } from "@coinbase/onchainkit/frame";
import { validButton } from "@/app/lib/buttonUtil";
import { FrameActionPayload, PinataFDK } from "pinata-fdk";

async function getResponse(req: NextRequest): Promise<NextResponse | Response> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, {
    neynarApiKey: process.env.NEYNAR_API_KEY,
  });
  const fdk = new PinataFDK({
    pinata_jwt: `${process.env.PINATA_JWT}`,
    pinata_gateway: `${process.env.PINATA_GATEWAY}`,
  });
  console.log("tring to revive", message);
  if (isValid && allowedOrigin(message) && validButton(message)) {
    await fdk.sendAnalytics(FRAME_ID, body as FrameActionPayload, "ReviveUser");
    const txData: FrameTransactionResponse = {
      chainId: `eip155:${base.id}`,
      method: "eth_sendTransaction",
      params: {
        abi: [],
        data: encodeFunctionData({
          abi: stageAbi,
          functionName: "reviveUser",
          args: [message.interactor.fid],
        }),
        to: FROUGE_STAGE_ADDRESS,
        value: parseGwei("10000").toString(), // 0.00001 ETH
      },
    };
    return NextResponse.json(txData);
  }

  return new NextResponse("Message not valid", { status: 500 });
}

// TODO

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
