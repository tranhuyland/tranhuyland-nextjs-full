import { getBdsData } from "../../../lib/googleSheets";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await getBdsData();
  return NextResponse.json(data);
}
