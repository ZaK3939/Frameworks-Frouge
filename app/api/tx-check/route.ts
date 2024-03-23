import { FrameRequest, getFrameMessage } from "@coinbase/onchainkit";
import { NextRequest, NextResponse } from "next/server";
import { allowedOrigin } from "../../lib/origin";
import { getFrameHtml } from "../../lib/getFrameHtml";
import { errorResponse, verifiedAccounts } from "../../lib/responses";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const searchParams = req.nextUrl.searchParams;
  const { isValid, message } = await getFrameMessage(body, {
    neynarApiKey: process.env.NEYNAR_API_KEY,
  });

  if (isValid && allowedOrigin(message)) {
    // TODO: Check the status of the transaction
    // https://viem.sh/docs/actions/public/getTransactionReceipt#gettransactionreceipt

    return new NextResponse(
      getFrameHtml({
        buttons: [
          {
            label: `Tx: ${body?.untrustedData?.transactionId || "--"}`,
            action: "link",
            target: `https://explorer-frame.syndicate.io/tx/${body?.untrustedData?.transactionId}`,
          },
          {
            label: `Go Next`,
          },
        ],
        post_url: `${process.env.NEXT_PUBLIC_URL}/api/action`,
        image: `${process.env.NEXT_PUBLIC_URL}/api/images/que`,
      }),
    );
  } else return new NextResponse("Unauthorized", { status: 401 });
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
