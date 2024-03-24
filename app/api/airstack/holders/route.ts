import { NextRequest, NextResponse } from 'next/server';
import { AllHolders } from "../../../../graphql/Mint";

export async function GET(req: NextRequest, res: NextResponse) {

  try {
    const data = await AllHolders();
    return Response.json({ data })
  } catch (err) {
    console.log(err);
  }
}

export const dynamic = "force-dynamic";


