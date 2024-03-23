import { NextResponse } from "next/server";
import { getFrameHtml } from "./getFrameHtml";

export function errorResponse() {
  return new NextResponse(
    getFrameHtml({
      image: `${process.env.NEXT_PUBLIC_URL}/api/images/error`,
    }),
  );
}
export function verifiedAccounts(fid: number) {
  return new NextResponse(
    getFrameHtml({
      buttons: [
        {
          label: "Verify Account",
          action: "link",
          target: `https://verify.warpcast.com/verify/${fid}`,
        },
      ],
      image: `${process.env.NEXT_PUBLIC_URL}/api/images/verify`,
    }),
  );
}
