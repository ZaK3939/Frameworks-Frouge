import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest, res: NextResponse) {
  // return getResponse(req);
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.PINATA_JWT}`,
    }
  };

  try {
    const response = await fetch('https://api.pinata.cloud/farcaster/frames/interactions?custom_id=action&start_date=2024-03-23%2000%3A00%3A00&end_date=2024-04-30%2000%3A00%3A00', options);
    const data = await response.json();
    return Response.json({ data })
  } catch (error) {
    console.error(error);
  }
}

export const dynamic = "force-dynamic";


