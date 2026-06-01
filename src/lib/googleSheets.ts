import Papa from "papaparse";

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1-LupBV6uNuUitz4vF6pFv6MupuVDMujafqhjQBNNPTA/export?format=csv";

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

let cache: BdsItem[] = [];
let lastFetch = 0;

const CACHE_TIME = 10 * 60 * 1000;

const slugify = (text: string) =>
  (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export async function getBdsData(): Promise<BdsItem[]> {
  const now = Date.now();

  if (cache.length > 0 && now - lastFetch < CACHE_TIME) {
    return cache;
  }

  try {
    const res = await fetch(SHEET_URL, {
      next: { revalidate: 300 },
    });

    const csv = await res.text();

    const parsed = Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
    });

    const raw = parsed.data as any[];

    const data = raw.map((row, index) => ({
      id: Number(row.id) || index,
      title: row.title || "",
      description: row.description || "",
      price: Number(String(row.price || "").replace(/[^\d]/g, "")) || 0,
      area: row.area || "",
      location: row.location || "",
      images: (row.images || "").split(",").map((x: string) => x.trim()),
      slug: slugify(row.title || `bds-${index}`),
      ngayDang: row.ngayDang || "",
    }));

    cache = data;
    lastFetch = now;

    return data;
  } catch (e) {
    console.error(e);
    return cache || [];
  }
}
