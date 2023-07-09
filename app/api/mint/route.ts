import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  await axios.get(
    `https://gas.zkl.app/77ee866aa47d42cfaebe715c593cf393/${data.tokenId}`
  );

  console.log("data", data);

  return NextResponse.json(data);
}
