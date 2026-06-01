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

// =======================
// DEBUG SAFE NORMALIZE
// =======================
function normalize(row: any, index: number): BdsItem {
  return {
    id: Number(row.id || index),

    // 🔥 FIX: fallback nhiều tên cột Google Sheet
    title: row.title || row.tieude || "",

    description: row.description || row.moTa || "",

    price:
      Number(String(row.price || row.gia || row.soGia || "").replace(/[^\d]/g, "")) ||
      0,

    area: row.area || row.dienTich || "",

    location: row.location || row.khuVuc || "",

    images: (row.images || row.anh || "")
      .split(",")
      .map((i: string) => i.trim())
      .filter(Boolean),

    slug: slugify(row.title || row.tieude || `bds-${index}`),

    ngayDang: row.ngayDang || row.date || "",
  };
}

export async function getBdsData(): Promise<BdsItem[]> {
  try {
    const res = await fetch(SHEET_URL, {
      cache: "no-store",
    });

    const csv = await res.text();

    // 🔥 CHECK HTML ERROR (RẤT QUAN TRỌNG)
    if (!csv || csv.includes("<html")) {
      console.error("❌ Google Sheet chưa public hoặc bị redirect login");
      return [];
    }

    const parsed = Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
    });

    const raw = parsed.data as any[];

    if (!Array.isArray(raw)) {
      console.error("❌ parsed.data không phải array");
      return [];
    }

    const data = raw
      .map((row, index) => normalize(row, index))
      .filter((item) => item.title); // 🔥 lọc rác

    // =========================
    // UNIQUE SLUG
    // =========================
    const used = new Map<string, number>();

    const unique = data.map((item) => {
      const count = used.get(item.slug) || 0;
      used.set(item.slug, count + 1);

      return {
        ...item,
        slug: count === 0 ? item.slug : `${item.slug}-${count + 1}`,
      };
    });

    // =========================
    // SORT NEWEST
    // =========================
    unique.sort(
      (a, b) =>
        new Date(b.ngayDang || 0).getTime() -
        new Date(a.ngayDang || 0).getTime()
    );

    console.log("✅ BDS COUNT:", unique.length);

    return unique;
  } catch (err) {
    console.error("❌ GoogleSheet error:", err);
    return [];
  }
}
