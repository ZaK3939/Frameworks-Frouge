import { FrameRequest, getFrameMessage } from "@coinbase/onchainkit";
import { NextRequest, NextResponse } from "next/server";
import { allowedOrigin } from "../../lib/origin";
import { getFrameHtml } from "../../lib/getFrameHtml";
import { getPlayerStageStatus } from "@/app/lib/checkPlayerStatus";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, {
    neynarApiKey: process.env.NEYNAR_API_KEY,
  });

  console.log("Transaction ID", body?.untrustedData?.transactionId);
  if (isValid && allowedOrigin(message)) {
    // TODO: Check the status of the transaction
    // https://viem.sh/docs/actions/public/getTransactionReceipt#gettransactionreceipt
    const fid = message.interactor.fid;
    const playerStageStatus = await getPlayerStageStatus(fid);
    const gold = Number(playerStageStatus.gold);
    return new NextResponse(
      getFrameHtml({
        buttons: [
          {
            label: `Score:${gold} -> Game Start Again`,
          },
          {
            label: `Tx: ${body?.untrustedData?.transactionId || "--"}`,
            action: "link",
            target: `https://basescan.org/tx/${body?.untrustedData?.transactionId}`,
          },
        ],
        post_url: `${process.env.NEXT_PUBLIC_URL}/api/action?gameStartAgain=true`,
        image: `${process.env.NEXT_PUBLIC_URL}/background-images/07_clear_minted.png`,
      }),
    );
  } else return new NextResponse("Unauthorized", { status: 401 });
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
