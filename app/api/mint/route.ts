import { NextResponse } from "next/server"
import axios from 'axios'

export async function POST(request: Request) {
  const data = await request.json();

  console.log('data', data)


  return NextResponse.json(data)
}