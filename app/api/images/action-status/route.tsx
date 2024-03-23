import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";
import { Card } from "../../../components/Card";
import { CARD_DIMENSIONS } from "../../../config";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const floor = searchParams.get("floor") ?? "";
  const gold = searchParams.get("gold") ?? "";
  const hp = searchParams.get("hp") ?? "";
  const weapon = searchParams.get("weapon") ?? "";
  const shield = searchParams.get("shield") ?? "";

  const enemyId = searchParams.get("nextEnemy") ?? "";
  const equipmentId = searchParams.get("nextEquipment") ?? "";
  const itemId = searchParams.get("nextItem") ?? "";
  console.log(
    "Card",
    floor,
    gold,
    hp,
    weapon,
    shield,
    enemyId,
    equipmentId,
    itemId,
  );

  if (Number(floor) === 0) {
    return new ImageResponse(
      (
        <Card
          message={`Please select your action `}
          floor={Number(floor)}
          gold={Number(gold)}
          hp={Number(hp)}
          weapon={weapon}
          shield={shield}
          enemyId={Number(enemyId)}
          equipmentId={Number(equipmentId)}
          itemId={Number(itemId)}
        />
      ),
      CARD_DIMENSIONS,
    );
  }
  if (Number(floor) === 9) {
    return new ImageResponse(
      (
        <Card
          message={`Boss Battle `}
          floor={Number(floor)}
          gold={Number(gold)}
          hp={Number(hp)}
          weapon={weapon}
          shield={shield}
          enemyId={Number(enemyId)}
          equipmentId={Number(equipmentId)}
          itemId={Number(itemId)}
        />
      ),
      CARD_DIMENSIONS,
    );
  }

  return new ImageResponse(
    (
      <Card
        message={`What is your next action ?`}
        floor={Number(floor)}
        gold={Number(gold)}
        hp={Number(hp)}
        weapon={weapon}
        shield={shield}
        enemyId={Number(enemyId)}
        equipmentId={Number(equipmentId)}
        itemId={Number(itemId)}
      />
    ),
    CARD_DIMENSIONS,
  );
}
