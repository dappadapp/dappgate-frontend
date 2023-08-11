import axios from "axios";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();
  let ip = request.ip ?? request.headers.get("x-real-ip");
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (!ip && forwardedFor) {
    ip = forwardedFor.split(",").at(0) ?? "Unknown";
  }
  const refDataResponse = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/saveip?wallet=${data.wallet}&ip=${ip}`
  );
  return NextResponse.json(refDataResponse.data);
}
