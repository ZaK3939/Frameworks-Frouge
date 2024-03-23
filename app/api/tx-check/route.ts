import { FrameRequest, getFrameMessage } from "@coinbase/onchainkit";
import { NextRequest, NextResponse } from "next/server";
import { allowedOrigin } from "../../lib/origin";
import { getFrameHtml } from "../../lib/getFrameHtml";
import { getPlayerStageStatus } from "@/app/lib/checkPlayerStatus";
import { FrameActionPayload, PinataFDK } from "pinata-fdk";
import { FRAME_ID } from "@/app/config";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, {
    neynarApiKey: process.env.NEYNAR_API_KEY,
  });
  const fdk = new PinataFDK({
    pinata_jwt: `${process.env.PINATA_JWT}`,
    pinata_gateway: `${process.env.PINATA_GATEWAY}`,
  });
  console.log("Transaction ID", body?.untrustedData?.transactionId);
  if (isValid && allowedOrigin(message)) {
    // TODO: Check the status of the transaction
    // https://viem.sh/docs/actions/public/getTransactionReceipt#gettransactionreceipt
    const fid = message.interactor.fid;
    const playerStageStatus = await getPlayerStageStatus(fid);
    const hp = Number(playerStageStatus.hp);
    const floor = Number(playerStageStatus.floor);
    console.log("playerStageStatus", playerStageStatus);
    if (hp <= 0) {
      console.log("player is DEAD");
      await fdk.sendAnalytics(
        FRAME_ID,
        body as FrameActionPayload,
        `gameover-${floor}`,
      );
      return new NextResponse(
        getFrameHtml({
          buttons: [
            {
              action: "tx",
              label: "Player Revive",
              target: `${process.env.NEXT_PUBLIC_URL}/api/aftertx`,
              postUrl: `${process.env.NEXT_PUBLIC_URL}/api/tx-check`,
            },
            {
              label: `Tx: ${body?.untrustedData?.transactionId || "--"}`,
              action: "link",
              target: `https://basescan.org/tx/${body?.untrustedData?.transactionId}`,
            },
          ],
          image: `${process.env.NEXT_PUBLIC_URL}/background-images/02_lose.png`,
        }),
      );
    } else {
      await fdk.sendAnalytics(
        FRAME_ID,
        body as FrameActionPayload,
        floor.toString(),
      );
      return new NextResponse(
        getFrameHtml({
          buttons: [
            {
              label: `Go Next Floor`,
            },
            {
              label: `Tx: ${body?.untrustedData?.transactionId || "--"}`,
              action: "link",
              target: `https://basescan.org/tx/${body?.untrustedData?.transactionId}`,
            },
          ],
          post_url: `${process.env.NEXT_PUBLIC_URL}/api/action`,
          image: `${process.env.NEXT_PUBLIC_URL}/api/images/que`,
        }),
      );
    }
  } else return new NextResponse("Unauthorized", { status: 401 });
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
