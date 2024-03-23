import { FrameRequest, getFrameMessage } from "@coinbase/onchainkit";
import { NextRequest, NextResponse } from "next/server";
import { getFrameHtml } from "../../lib/getFrameHtml";
async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  return new NextResponse(
    getFrameHtml({
      buttons: [
        {
          label: "Home",
        },
      ],
      post_url: `${process.env.NEXT_PUBLIC_URL}/api/top`,
      image: `${process.env.NEXT_PUBLIC_URL}/background-images/01_start.png`, // Only image
    }),
  );
}
