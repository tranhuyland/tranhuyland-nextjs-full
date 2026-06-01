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

const slugify = (text: string) =>
  (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

// 🔥 IMPORTANT: cache nhẹ để tránh dynamic error
let cache: BdsItem[] | null = null;
let lastFetch = 0;

function normalize(row: any, index: number): BdsItem {
  return {
    id: Number(row.id) || index,
    title: row.title || "",
    description: row.description || "",
    price: Number(String(row.price || row.soGia || "").replace(/[^\d]/g, "")) || 0,
    area: row.area || "",
    location: row.location || "",
    images: (row.images || "")
      .split(",")
      .map((i: string) => i.trim())
      .filter(Boolean),
    slug: slugify(row.title || `bds-${index}`),
    ngayDang: row.ngayDang || row.date || "",
  };
}

export async function getBdsData(): Promise<BdsItem[]> {
  try {
    // 🔥 cache 60s để tránh build lỗi + tăng performance
    const now = Date.now();
    if (cache && now - lastFetch < 60000) return cache;

    const res = await fetch(SHEET_URL);

    if (!res.ok) return cache || [];

    const csv = await res.text();

    const parsed = Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
    });

    const raw = parsed.data as any[];

    const data = raw.map(normalize);

    const used = new Map<string, number>();

    const unique = data.map((item) => {
      const count = used.get(item.slug) || 0;
      used.set(item.slug, count + 1);

      return {
        ...item,
        slug: count === 0 ? item.slug : `${item.slug}-${count + 1}`,
      };
    });

    cache = unique;
    lastFetch = now;

    return unique;
  } catch (e) {
    console.error("GoogleSheet error:", e);
    return cache || [];
  }
}
