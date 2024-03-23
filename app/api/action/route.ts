import { FrameRequest, getFrameMessage } from "@coinbase/onchainkit";
import { NextRequest, NextResponse } from "next/server";
import { FRAME_ID } from "../../config";
import { allowedOrigin } from "../../lib/origin";
import { getFrameHtml } from "../../lib/getFrameHtml";
import { errorResponse } from "../../lib/responses";

import {
  getAllNextAction,
  getPlayerStageStatus,
} from "../../lib/checkPlayerStatus";
import { FrameActionPayload, PinataFDK } from "pinata-fdk";
import { validButton } from "@/app/lib/buttonUtil";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const searchParams = req.nextUrl.searchParams;
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
    const floor = Number(playerStageStatus.floor);
    const active = playerStageStatus.active;
    const gold = Number(playerStageStatus.gold);
    const weapon = Number(playerStageStatus.weapon);
    const shield = Number(playerStageStatus.shield);
    const hp = Number(playerStageStatus.hp);
    console.log("playerStageStatus", playerStageStatus);
    if (hp <= 0) {
      console.log("player is DEAD");
      return new NextResponse(
        getFrameHtml({
          buttons: [
            {
              action: "tx",
              label: "Player Revive",
              target: `${process.env.NEXT_PUBLIC_URL}/api/aftertx`,
              postUrl: `${process.env.NEXT_PUBLIC_URL}/api/first-action`,
            },
          ],
          image: `${process.env.NEXT_PUBLIC_URL}/background-images/02_lose.png`,
        }),
      );
    }

    // This random value for debugging purpose
    if (hp == 0 && floor != 0 && active == false) {
      console.log("player is DEAD");
      return new NextResponse(
        getFrameHtml({
          buttons: [
            {
              action: "tx",
              label: "Player Revive",
              target: `${process.env.NEXT_PUBLIC_URL}/api/after-revive`,
              postUrl: `${process.env.NEXT_PUBLIC_URL}/api/action`,
            },
          ],
          image: `${process.env.NEXT_PUBLIC_URL}/background-images/02_lose.png`,
        }),
      );
    }
    console.log(
      `player hp ${hp} is alive floor ${floor}, decide Action`,
      active,
    );
    if (floor < 9) {
      let nextActions = await getAllNextAction(fid);
      console.log("normal battle", nextActions);
      // Normal Battle
      return new NextResponse(
        getFrameHtml({
          buttons: [
            {
              action: "tx",
              label: `🗡️ Battle`,
              target: `${process.env.NEXT_PUBLIC_URL}/api/after-action`,
              postUrl: `${process.env.NEXT_PUBLIC_URL}/api/action`,
            },
            {
              action: "tx",
              label: "🛡️ Equipment",
              target: `${process.env.NEXT_PUBLIC_URL}/api/after-action`,
              postUrl: `${process.env.NEXT_PUBLIC_URL}/api/action`,
            },
            {
              action: "tx",
              label: "🏠 Rest",
              target: `${process.env.NEXT_PUBLIC_URL}/api/after-action`,
              postUrl: `${process.env.NEXT_PUBLIC_URL}/api/action`,
            },
          ],
          image: `${process.env.NEXT_PUBLIC_URL}/api/images/action-status?nextEnemy=${nextActions.enemyId}&nextEquipment=${nextActions.equipmentId}&nextItem=${nextActions.itemId}&floor=${playerStageStatus.floor}&gold=${gold}&hp=${playerStageStatus.hp}&attack=${playerStageStatus.attack}&defense=${playerStageStatus.defense}&weapon=${weapon}&shield=${shield}&random=${randomValue}`,
        }),
      );
    } else if (floor == 9) {
      let nextActions = await getAllNextAction(fid);
      console.log("boss Actions", nextActions);
      // Boss Battle
      return new NextResponse(
        getFrameHtml({
          buttons: [{ label: "🗡️ Boss Battle" }],
          image: `${process.env.NEXT_PUBLIC_URL}/api/images/action-status?floor=${playerStageStatus.floor}&gold=${gold}&hp=${playerStageStatus.hp}&attack=${playerStageStatus.attack}&defense=${playerStageStatus.defense}&weapon=${weapon}&shield=${shield}&random=${randomValue}`,
          postUrl: `${process.env.NEXT_PUBLIC_URL}/api/action`,
        }),
      );
    } else {
      console.log("Game Clear");
      // Game Clear
      return new NextResponse(
        getFrameHtml({
          buttons: [{ label: "🎉 Game Clear: Lets mint NFT with your Score" }],
          image: `${process.env.NEXT_PUBLIC_URL}/background-images/03_clear.png`,
          post_url: `${process.env.NEXT_PUBLIC_URL}/api/mint-relay?gold=${gold}`,
        }),
      );
    }
  } else return new NextResponse("Unauthorized", { status: 401 });
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
