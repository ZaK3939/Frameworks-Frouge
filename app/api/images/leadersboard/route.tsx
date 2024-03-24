import { NextRequest, NextResponse } from "next/server";
import { ImageResponse } from "next/og";
import { CARD_DIMENSIONS } from "../../../config";
import { AllHolders, TokenBalance } from "../../../../graphql/Mint";

export async function GET(req: NextRequest) {
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.PINATA_JWT}`,
    },
  };

  const searchParams = req.nextUrl.searchParams;
  const address = searchParams.get("address") ?? "0x00";
  console.log("address=", address);

  // Get action sum
  let action = 0;
  try {
    const response = await fetch(
      "https://api.pinata.cloud/farcaster/frames/interactions?custom_id=action&start_date=2024-03-23%2000%3A00%3A00&end_date=2024-04-30%2000%3A00%3A00",
      options,
    );
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    const data = await response.json();
    action = data.total_interactions;
  } catch (error) {
    console.error(error);
    return new Response("An error occurred", { status: 500 });
  }

  // Get Clear holders sum
  let HoldersSum = 0;
  try {
    const data = await AllHolders();
    HoldersSum = data.Base.TokenBalance.length;
  } catch (err) {
    console.log(err);
  }

  // Get your token balance
  let balance = 0;
  if (address !== "0x00") {
    const dataBalance = await TokenBalance(address);
    console.log("dataBalance=", dataBalance);
    if (
      dataBalance.Base &&
      dataBalance.Base.TokenBalance &&
      dataBalance.Base.TokenBalance.length > 0
    ) {
      console.log(dataBalance.Base.TokenBalance);
      balance = dataBalance.Base.TokenBalance[0].amount;
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          backgroundImage: `url(${process.env.NEXT_PUBLIC_URL}/background-images/06_leaderboard.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        tw="relative flex flex-col items-center text-center w-[376px] h-[196px] p-2 overflow-auto pt-16"
      >
        <div tw="flex justify-center w-full mb-2 gap-10">
          <div tw="flex flex-col items-center bg-[#FF0000] rounded-md text-white w-[110px] h-[52px] border border-white text-xs text-center mr-4">
            <div tw="w-full flex justify-start items-end p-1">
              <p tw="flex items-center justify-center h-2 m-0">All action</p>
            </div>
            <div tw="bg-[#7D0202] w-full flex justify-end items-end p-1">
              <p tw="flex items-center justify-center h-2 m-0">{action}</p>
            </div>
          </div>
          <div tw="flex flex-col items-center bg-[#CC8207] rounded-md text-white w-[110px] h-[52px] border border-white text-xs text-center">
            <div tw="w-full flex justify-start items-end p-1">
              <p tw="flex items-center justify-center h-2 m-0">
                Game Clear users
              </p>
            </div>
            <div tw="bg-[#B86900] w-full flex justify-end items-end p-1">
              <p tw="flex items-center justify-center h-2 m-0">{HoldersSum}</p>
            </div>
          </div>
        </div>
        <div tw="flex flex-col items-center bg-[#001D85] rounded-md text-white w-[110px] h-[52px] border border-white text-xs text-center">
          <div tw="w-full flex justify-start items-end p-1">
            <p tw="flex items-center justify-center h-2 m-0">Cleared?</p>
          </div>
          <div tw="bg-[#031159] w-full flex justify-end items-end p-1">
            <p tw="flex items-center justify-center h-2 m-0">{balance}</p>
          </div>
        </div>
      </div>
    ),
    CARD_DIMENSIONS,
  );
}
