import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  console.log("data", data);

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
  };

  const refDataResponse = await axios.post(
    `${process.env.NEXT_PUBLIC_API_NEW_URL}/txs/create`,
    {
      ...data,
    },
    {
      headers,
    }
  );

  return NextResponse.json(refDataResponse.data);
}
