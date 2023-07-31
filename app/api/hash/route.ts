import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();
  const refDataResponse = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/hash?type=${data.type}&hash=${data.hash}&ref=${data.ref}`
  );
  return NextResponse.json(refDataResponse.data);
}
