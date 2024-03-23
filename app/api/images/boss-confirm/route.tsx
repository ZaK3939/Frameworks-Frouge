import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";
import { Card } from "../../../components/Card";
import { CARD_DIMENSIONS } from "../../../config";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const floor = searchParams.get("floor") ?? "";

  const hp = searchParams.get("hp") ?? "";

  return new ImageResponse(
    <Card message={`${floor}F, What is your next action ? your HP is ${hp}`} />,
    CARD_DIMENSIONS,
  );
}
