import { FrameRequest, getFrameMessage } from "@coinbase/onchainkit";
import { NextRequest, NextResponse } from "next/server";
import { getFrameHtml } from "../../lib/getFrameHtml";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  return new NextResponse(
    getFrameHtml({
      buttons: [
        {
          label: "Game Start",
        },
        {
          label: "Leaderboard",
        },
      ],
      image: `${process.env.NEXT_PUBLIC_URL}/background-images/01_start.png`, // Only image
      postUrl: `${process.env.NEXT_PUBLIC_URL}/api/action`,
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
