import { FrameRequest, getFrameMessage } from "@coinbase/onchainkit";
import { NextRequest, NextResponse } from "next/server";
import { allowedOrigin } from "../../lib/origin";
import { getFrameHtml } from "../../lib/getFrameHtml";
import { getPlayerStageStatus } from "@/app/lib/checkPlayerStatus";
import { FrameActionPayload, PinataFDK } from "pinata-fdk";
import { FRAME_ID } from "@/app/config";
import { enemies, equipments, getCategoryMapping, items } from "@/app/data";
import { airdropToPrivy } from "@/app/lib/createPrivyNFYAirdrop";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const searchParams = req.nextUrl.searchParams;
  const gold = searchParams.get("gold") ?? "";
  const next = searchParams.get("next") ?? "";
  const revive = searchParams.get("revive") ?? "";
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
    let resultText = "";
    let data;
    let tokenId;
    try {
      if (message.button == 1) {
        data = enemies[Number(next)];
        resultText = `You defeat ${data.name} 🐸`;
      } else if (message.button == 2) {
        data = equipments[Number(next)];
        if (Number(gold) < Number(data.gold)) {
          resultText = `Not enough Gold 😢`;
        } else {
          resultText = `Purchased ${data.name} 🗡️`;
        }
      } else if (message.button == 3) {
        data = items[Number(next)];
        if (Number(gold) < Number(data.gold)) {
          resultText = `Not enough Gold 😢`;
        } else {
          resultText = `Healed ${data.recovery} ❤️`;
        }
      }
      tokenId = getCategoryMapping(message.button, Number(next));
    } catch {
      resultText = `Invalid something 😢`;
    }

    const fid = message.interactor.fid;
    const playerStageStatus = await getPlayerStageStatus(fid);
    const floor = Number(playerStageStatus.floor);
    if (!revive) {
      await fdk.sendAnalytics(FRAME_ID, body as FrameActionPayload, "Action");
      await fdk.sendAnalytics(
        FRAME_ID,
        body as FrameActionPayload,
        `Action-${floor.toString()}`,
      );

      if (tokenId) {
        const tx = await airdropToPrivy(fid, tokenId);
        if (tx) {
          console.log("drop NFT tx", tx);
        }
      }
    }
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
        post_url: `${process.env.NEXT_PUBLIC_URL}/api/action?transactionId=${body?.untrustedData?.transactionId}&resultText=${resultText}`,
        image: `${process.env.NEXT_PUBLIC_URL}/gif/que.gif`,
      }),
    );
  } else return new NextResponse("Unauthorized", { status: 401 });
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
