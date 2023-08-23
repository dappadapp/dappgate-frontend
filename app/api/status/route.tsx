import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const statusDataResponse = await axios.get("https://galxe.dappgate.io/mints/status/0", {
    headers: { "x-api-key": "gate_f6fc8a3115494dd7a7" },
  });

  return NextResponse.json(statusDataResponse.data);
}
