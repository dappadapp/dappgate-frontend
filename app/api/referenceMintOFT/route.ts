import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();
  const refDataResponse = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/mint-oft?id=${data.id}&address=${data.walletAddress}&ref=${data.ref}&tx=${data.tx_id}&chain=${data.chainId}&amount=${data.amount}`
  );
  return NextResponse.json(refDataResponse.data);
}
