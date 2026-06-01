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
    const res = await fetch(SHEET_URL, { cache: "no-store" });
    if (!res.ok) return [];

    const csv = await res.text();

    const parsed = Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
    });

    const raw = parsed.data as any[];

    if (!Array.isArray(raw)) return [];

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

    unique.sort(
      (a, b) =>
        new Date(b.ngayDang || 0).getTime() -
        new Date(a.ngayDang || 0).getTime()
    );

    return unique;
  } catch (e) {
    console.error(e);
    return [];
  }
}
