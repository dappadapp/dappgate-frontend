import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();

  const refDataResponse = await axios.get(
    `https://api.twitter.com/oauth/authenticate?oauth_token=YlRNRERDRFVmRmxMVDRzd0VPcFI6MTpjaQ`
  );

  return NextResponse.json(refDataResponse.data);
}
