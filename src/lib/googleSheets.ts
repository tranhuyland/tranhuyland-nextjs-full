export type BdsItem = {
  id: number;
  title: string;
  description: string;
  price: number;
  area: string;
  location: string;
  images: string[];
  slug: string;
  ngayDang: string;
};

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1-LupBV6uNuUitz4vF6pFv6MupuVDMujafqhjQBNNPTA/gviz/tq?tqx=out:json";

function slugify(text: string) {
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function parseGoogleJson(text: string) {
  const json = JSON.parse(text.substring(47).slice(0, -2));

  const cols = json.table.cols;
  const rows = json.table.rows;

  return rows.map((r: any, i: number) => {
    const c = r.c;

    return {
      id: i,
      title: c?.[0]?.v || "",
      description: c?.[1]?.v || "",
      price: Number(c?.[2]?.v || 0),
      area: c?.[3]?.v || "",
      location: c?.[4]?.v || "",
      images: (c?.[5]?.v || "").split(",").filter(Boolean),
      slug: slugify(c?.[0]?.v || `bds-${i}`),
      ngayDang: c?.[6]?.v || "",
    };
  });
}

export async function getBdsData(): Promise<BdsItem[]> {
  try {
    const res = await fetch(SHEET_URL, {
      cache: "no-store",
    });

    const text = await res.text();

    if (!text.includes("table")) {
      console.error("Invalid Google response");
      return [];
    }

    return parseGoogleJson(text);
  } catch (e) {
    console.error("Google Sheets error:", e);
    return [];
  }
}
