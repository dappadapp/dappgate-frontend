import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  const walletDataResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_NEW_BASE_URL}/wormhole/topic/${data.id}/${data.hash}`
  );

  return NextResponse.json(walletDataResponse.data);
}
