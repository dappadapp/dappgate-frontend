import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  const refDataResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/create?wallet=${data.wallet}`
  );

  return NextResponse.json(refDataResponse.data);
}
