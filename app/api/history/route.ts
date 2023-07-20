import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  
  const refDataResponse = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/bridge?tx=${data.tx}&srcChain=${data.srcChain}&dstChain=${data.dstChain}&tokenId=${data.tokenId}&walletAddress=${data.walletAddress}&ref=${data.ref}`
  );
  return NextResponse.json(refDataResponse.data);
}
