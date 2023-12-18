import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  const claimDataResponse = await axios.post(
    `${process.env.NEXT_PUBLIC_NEW_BASE_URL}/wormhole/claim`,
    {
      sourceTx: data.sourceTx,
      targetTx: data.targetTx,
      completed: data.completed,
    }
  );

  return NextResponse.json(claimDataResponse.data);
}
