import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  const refDataResponse = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/sync?wallet=${data.wallet}&username=${data.username}`
  );
  return NextResponse.json(refDataResponse.data);
}
