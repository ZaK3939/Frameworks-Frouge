import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";
import { CARD_DIMENSIONS } from "../../../config";
import { AllHolders, TokenBalance } from "../../../../graphql/Mint";
import { FrameRequest, getFrameMessage } from "@coinbase/onchainkit";

type FidResponse = {
  verifications: string[];
};

// Based on https://github.com/coinbase/build-onchain-apps/blob/b0afac264799caa2f64d437125940aa674bf20a2/template/app/api/frame/route.ts#L13
// async function getAddrByFid(fid: number) {
//   const options = {
//     method: 'GET',
//     url: `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
//     headers: { accept: 'application/json', api_key: process.env.NEYNAR_API_KEY || "" },
//   };
//   const resp = await fetch(options.url, { headers: options.headers });
//   const responseBody = await resp.json(); // Parse the response body as JSON
//   if (responseBody.users) {
//     const userVerifications = responseBody.users[0] as FidResponse;
//     if (userVerifications.verifications) {
//       return userVerifications.verifications[0];
//     }
//   }
//   return '0x00';
// }

export async function GET(req: NextRequest) {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, {
    neynarApiKey: process.env.NEYNAR_API_KEY,
  });
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.PINATA_JWT}`,
    }
  };

  // Get action sum
  let action = 0;
  try {
    const response = await fetch('https://api.pinata.cloud/farcaster/frames/interactions?custom_id=action&start_date=2024-03-23%2000%3A00%3A00&end_date=2024-04-30%2000%3A00%3A00', options);
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
  // if (isValid ) {
  //   const fid = message.interactor.fid;
  //   const addressFromFid = await getAddrByFid(fid);
  //   const dataBalance = await TokenBalance(addressFromFid);
  //   balance = dataBalance.Base.TokenBalance[0].amount;
  // }


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
              <p tw="flex items-center justify-center h-2 m-0">Game Clear users</p>
            </div>
            <div tw="bg-[#B86900] w-full flex justify-end items-end p-1">
              <p tw="flex items-center justify-center h-2 m-0">{HoldersSum}</p>
            </div>
          </div>
        </div>
        <div tw="flex flex-col items-center bg-[#001D85] rounded-md text-white w-[110px] h-[52px] border border-white text-xs text-center">
          <div tw="w-full flex justify-start items-end p-1">
            <p tw="flex items-center justify-center h-2 m-0">Your clear sum</p>
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
