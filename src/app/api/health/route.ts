import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "PE_SDN302 Backend API",
    version: "1.0.0",
  });
}

