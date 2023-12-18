import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  const createDataResponse = await axios.post(
    `${process.env.NEXT_PUBLIC_NEW_BASE_URL}/wormhole/create`,
    {
      wallet: data.wallet,
      sourceTx: data.sourceTx,
      wormholeId: data.wormholeId,
    }
  );

  return NextResponse.json(createDataResponse.data);
}
