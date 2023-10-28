import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  console.log("data", data);

  const headers = {
    "Content-Type": "application/json",
    "x-api-key": process.env.NEXT_PUBLIC_NEW_API_KEY,
  };
  
  const refDataResponse = await axios.post("https://dapplabs.zkl.app/dropbase/deploy/create", {
    "wallet": data?.wallet,
    "type": data?.type,
    "contract": data?.contract,
  },
  
  {
    headers,
  });


  return NextResponse.json(refDataResponse.data);
}
