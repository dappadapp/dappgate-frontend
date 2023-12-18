import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  const walletDataResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_NEW_BASE_URL}/wormhole/wallet/${data.wallet}?page=${data.page}&limit=${data.limit}&completed=${data.completed}&wormholeId=${data.wormholeId}`
  );

  return NextResponse.json(walletDataResponse.data);
}
