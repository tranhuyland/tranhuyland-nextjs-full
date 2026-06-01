import Papa from "papaparse";

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1-LupBV6uNuUitz4vF6pFv6MupuVDMujafqhjQBNNPTA/export?format=csv";

let cache: any[] = [];
let lastFetch = 0;

function normalize(row: any, index: number) {
  return {
    id: Number(row.id) || index,
    title: row.title || "",
    description: row.description || "",
    price: Number(String(row.price || "").replace(/[^\d]/g, "")) || 0,
    area: row.area || "",
    location: row.location || "",
    images: (row.images || "").split(",").map((x: string) => x.trim()).filter(Boolean),
    slug: (row.title || `bds-${index}`)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, ""),
    ngayDang: row.ngayDang || "",
  };
}

export async function getBdsData() {
  const now = Date.now();

  // cache 60 giây
  if (cache.length && now - lastFetch < 60000) {
    return cache;
  }

  const res = await fetch(SHEET_URL);

  const csv = await res.text();

  const parsed = Papa.parse(csv, {
    header: true,
    skipEmptyLines: true,
  });

  const data = (parsed.data as any[]).map(normalize);

  cache = data;
  lastFetch = now;

  return data;
}
