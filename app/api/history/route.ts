import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();
  const refDataResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/history/${data.walletAddress}`
  );

  console.log("refDataResponse",refDataResponse);
  return NextResponse.json(refDataResponse.data);
}
