import { getBdsData } from "@/lib/googleSheets";

export async function GET() {
  const data = await getBdsData();

  return Response.json({
    success: true,
    count: data.length,
    data,
  });
}
