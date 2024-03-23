import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";
import { Card } from "../../../components/Card";
import { CARD_DIMENSIONS } from "../../../config";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const gold = searchParams.get("gold") ?? "";
  return new ImageResponse(
    <Card message={`Mint Success: Your score ${gold}`} />,
    CARD_DIMENSIONS,
  );
}
