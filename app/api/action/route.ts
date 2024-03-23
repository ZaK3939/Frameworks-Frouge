import { FrameRequest, getFrameMessage } from "@coinbase/onchainkit";
import { NextRequest, NextResponse } from "next/server";
import { FRAME_ID } from "../../config";
import { allowedOrigin } from "../../lib/origin";
import { getFrameHtml } from "../../lib/getFrameHtml";

import {
  getAllNextAction,
  getPlayerStageStatus,
  viemClientForBase,
} from "../../lib/checkPlayerStatus";
import { FrameActionPayload, PinataFDK } from "pinata-fdk";
import { validButton } from "@/app/lib/buttonUtil";
import { error } from "console";
import { errorResponse } from "@/app/lib/responses";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const searchParams = req.nextUrl.searchParams;
  const transactionId = searchParams.get("transactionId") ?? "";
  const gameStartAgain = searchParams.get("gameStartAgain") ?? "";
  const randomValue = Math.floor(Math.random() * 10000);
  const { isValid, message } = await getFrameMessage(body, {
    neynarApiKey: process.env.NEYNAR_API_KEY,
  });
  const fdk = new PinataFDK({
    pinata_jwt: `${process.env.PINATA_JWT}`,
    pinata_gateway: `${process.env.PINATA_GATEWAY}`,
  });

  if (isValid && allowedOrigin(message) && validButton(message)) {
    await fdk.sendAnalytics(FRAME_ID, body as FrameActionPayload, "action");
    const fid = message.interactor.fid;
    const playerStageStatus = await getPlayerStageStatus(fid);
    let floor = Number(playerStageStatus.floor);
    let gold = Number(playerStageStatus.gold);
    const active = playerStageStatus.active;
    const weapon = Number(playerStageStatus.weapon);
    const shield = Number(playerStageStatus.shield);
    const hp = Number(playerStageStatus.hp);
    console.log("playerStageStatus", playerStageStatus);

    // check lasttime transaction status
    if (transactionId) {
      const transaction = await viemClientForBase.getTransactionReceipt({
        hash: `${transactionId}` as `0x${string}`,
      });
      console.log("transaction", transaction);
      // Revive Player except gameClaer
      console.log("player revive", active, floor);
      if (active == false && floor != 10) {
        await fdk.sendAnalytics(
          FRAME_ID,
          body as FrameActionPayload,
          `gameOver-${floor.toString()}`,
        );
        return new NextResponse(
          getFrameHtml({
            buttons: [
              {
                label: "Game Start Again",
              },
              {
                action: "tx",
                label: "Player Revive",
                target: `${process.env.NEXT_PUBLIC_URL}/api/after-revive`,
                postUrl: `${process.env.NEXT_PUBLIC_URL}/api/tx-check`,
              },
            ],
            post_url: `${process.env.NEXT_PUBLIC_URL}/api/action?gameStartAgain=true`,
            image: `${process.env.NEXT_PUBLIC_URL}/background-images/02_lose.png`,
          }),
        );
      }
      if (active == false && floor == 10) {
        console.log("Game Clear");
        await fdk.sendAnalytics(
          FRAME_ID,
          body as FrameActionPayload,
          "gameClear",
        );
        // Game Clear
        return new NextResponse(
          getFrameHtml({
            buttons: [
              {
                action: "tx",
                label: "🎉 Game Clear: Lets mint NFT with your Score",
                target: `${process.env.NEXT_PUBLIC_URL}/api/after-mint?gold=${gold}`,
              },
            ],
            image: `${process.env.NEXT_PUBLIC_URL}/background-images/03_clear.png`,
          }),
        );
      }
    }
    // handling player gameover/gameclear lasttime Play
    if (gameStartAgain != "true" && floor != 0 && active == false) {
      console.log("player is DEAD");
      return new NextResponse(
        getFrameHtml({
          buttons: [
            {
              label: "Game Start Again",
            },
            {
              action: "tx",
              label: "Player Revive",
              target: `${process.env.NEXT_PUBLIC_URL}/api/after-revive`,
              postUrl: `${process.env.NEXT_PUBLIC_URL}/api/tx-check`,
            },
          ],
          post_url: `${process.env.NEXT_PUBLIC_URL}/api/action?gameStartAgain=true`,
          image: `${process.env.NEXT_PUBLIC_URL}/background-images/02_lose.png`,
        }),
      );
    }

    // start game
    console.log(
      `player hp ${hp} is alive floor ${floor}, decide Action`,
      active,
    );
    // Boss Battle
    if (floor == 9) {
      let nextActions = await getAllNextAction(fid);
      await fdk.sendAnalytics(FRAME_ID, body as FrameActionPayload, "boss");
      console.log("boss Actions", nextActions);
      // Boss Battle
      return new NextResponse(
        getFrameHtml({
          buttons: [
            {
              action: "tx",
              label: "🗡️ Boss Battle",
              target: `${process.env.NEXT_PUBLIC_URL}/api/after-action`,
              postUrl: `${process.env.NEXT_PUBLIC_URL}/api/tx-check`,
            },
          ],
          image: `${process.env.NEXT_PUBLIC_URL}/api/images/action-status?floor=${playerStageStatus.floor}&gold=${gold}&hp=${playerStageStatus.hp}&attack=${playerStageStatus.attack}&defense=${playerStageStatus.defense}&weapon=${weapon}&shield=${shield}&random=${randomValue}`,
        }),
      );
    } else {
      // Normal Battle
      if (gameStartAgain == "true") {
        floor = 0;
        gold = 0;
      }
      let nextActions = await getAllNextAction(fid);
      console.log("normal battle", nextActions);
      return new NextResponse(
        getFrameHtml({
          buttons: [
            {
              action: "tx",
              label: `🗡️ Battle`,
              target: `${process.env.NEXT_PUBLIC_URL}/api/after-action`,
              postUrl: `${process.env.NEXT_PUBLIC_URL}/api/tx-check`,
            },
            {
              action: "tx",
              label: "🛡️ Equipment",
              target: `${process.env.NEXT_PUBLIC_URL}/api/after-action`,
              postUrl: `${process.env.NEXT_PUBLIC_URL}/api/tx-check`,
            },
            {
              action: "tx",
              label: "🏠 Rest",
              target: `${process.env.NEXT_PUBLIC_URL}/api/after-action`,
              postUrl: `${process.env.NEXT_PUBLIC_URL}/api/tx-check`,
            },
          ],
          image: `${process.env.NEXT_PUBLIC_URL}/api/images/action-status?nextEnemy=${nextActions.enemyId}&nextEquipment=${nextActions.equipmentId}&nextItem=${nextActions.itemId}&floor=${playerStageStatus.floor}&gold=${gold}&hp=${playerStageStatus.hp}&attack=${playerStageStatus.attack}&defense=${playerStageStatus.defense}&weapon=${weapon}&shield=${shield}&random=${randomValue}`,
        }),
      );
    }
  } else return new NextResponse("Unauthorized", { status: 401 });
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
