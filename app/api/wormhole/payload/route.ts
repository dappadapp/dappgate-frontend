import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  const walletDataResponse = await axios.get(
    `https://api.wormholescan.io/api/v1/vaas?txHash=${data.hash}&parsedPayload=true`
  );

  return NextResponse.json(walletDataResponse.data);
}
