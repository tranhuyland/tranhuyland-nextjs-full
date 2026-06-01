import Papa from "papaparse";

// ========================
// GOOGLE SHEET URL
// ========================
const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1-LupBV6uNuUitz4vF6pFv6MupuVDMujafqhjQBNNPTA/export?format=csv";

// ========================
// TYPES (optional nhưng an toàn)
// ========================
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

// ========================
// SLUGIFY
// ========================
const slugify = (text: string = "") =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

// ========================
// AUTO UNIQUE SLUG
// ========================
function generateUniqueSlugs(data: any[]) {
  const used = new Map<string, number>();

  return data.map((item, index) => {
    let base = slugify(item.title || `bds-${index}`);

    if (!base) base = `bds-${index}`;

    const count = used.get(base) || 0;
    used.set(base, count + 1);

    return {
      ...item,
      slug: count === 0 ? base : `${base}-${count + 1}`,
    };
  });
}

// ========================
// NORMALIZE DATA
// ========================
function normalizeProperty(row: any, index: number): BdsItem {
  return {
    id: Number(row.id) || index,
    title: row.title || "",
    description: row.description || "",

    price: Number(String(row.price || row.soGia || "").replace(/[^\d]/g, "")) || 0,

    area: row.area || "",
    location: row.location || "",

    images: (row.images || "")
      .split(/,|;/)
      .map((img: string) => img.trim())
      .filter(Boolean),

    slug: "",

    ngayDang: row.ngayDang || row.date || "",
  };
}

// ========================
// SAFE DATE PARSE
// ========================
function parseDate(str: string) {
  if (!str) return new Date(0);

  const parts = str.split(/[-/]/);
  if (parts.length !== 3) return new Date(0);

  const [d, m, y] = parts.map(Number);
  if (isNaN(d) || isNaN(m) || isNaN(y)) return new Date(0);

  return new Date(y, m - 1, d);
}

// ========================
// MAIN FUNCTION
// ========================
export async function getBdsData(): Promise<BdsItem[]> {
  try {
    const res = await fetch(SHEET_URL, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Fetch Google Sheet failed");

    const csv = await res.text();

    const parsed = Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
    });

    const raw = parsed.data as any[];

    if (!Array.isArray(raw) || raw.length === 0) return [];

    // normalize
    let result: BdsItem[] = raw.map((row, index) =>
      normalizeProperty(row, index)
    );

    // auto slug unique
    result = generateUniqueSlugs(result);

    // sort newest
    result.sort(
      (a, b) =>
        parseDate(b.ngayDang).getTime() - parseDate(a.ngayDang).getTime()
    );

    return result;
  } catch (err) {
    console.error("Google Sheet Error:", err);
    return [];
  }
}
