import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";
import { CARD_DIMENSIONS } from "../../../config";

export async function GET(req: NextRequest) {

  return new ImageResponse(
    (
      <div 
        style={{
          backgroundImage: `url(${process.env.NEXT_PUBLIC_URL}/background-images/05_que.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
        tw="relative flex flex-col items-start text-center w-[376px] h-[196px] p-2 overflow-auto`"
      >
        <img
          src={`${process.env.NEXT_PUBLIC_URL}/gif/frog-spin.gif`}
          width={100}
          height={100}
          alt={`frog-spin.gif`}
        />
      </div>
    ),
    CARD_DIMENSIONS,
  );
}
