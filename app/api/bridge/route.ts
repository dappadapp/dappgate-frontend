import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

  console.log("request",request);
  const data = await request.json();
  const refDataResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/bridge/${data.walletAddress}`
  );

  console.log("refDataResponse",refDataResponse);
  return NextResponse.json(refDataResponse.data);
}
