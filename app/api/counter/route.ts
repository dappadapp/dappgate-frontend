import axios from "axios";
import { NextResponse } from "next/server";

export async function POST() {


  const refDataResponse = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/counter?cache=true`
  );

  console.log("refDataResponse",refDataResponse);
  return NextResponse.json(refDataResponse.data);
}
