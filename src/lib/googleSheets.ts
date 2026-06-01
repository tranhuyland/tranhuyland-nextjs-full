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

// slug chuẩn
const slugify = (text: string) =>
  (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

// map an toàn Google Sheet (FIX lỗi uppercase/lowercase)
function getValue(row: any, keys: string[]) {
  for (const k of keys) {
    if (row?.[k] !== undefined) return row[k];
  }
  return "";
}

function normalize(row: any, index: number): BdsItem {
  const title = getValue(row, ["title", "Title"]);
  const description = getValue(row, ["description", "Description"]);

  const priceRaw = getValue(row, ["price", "Price", "soGia"]);
  const area = getValue(row, ["area", "Area"]);
  const location = getValue(row, ["location", "Location"]);
  const imagesRaw = getValue(row, ["images", "Images"]);
  const ngayDang = getValue(row, ["ngayDang", "date", "Date"]);

  return {
    id: Number(getValue(row, ["id"])) || index,
    title,
    description,
    price: Number(String(priceRaw).replace(/[^\d]/g, "")) || 0,
    area,
    location,
    images: String(imagesRaw)
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean),
    slug: slugify(title || `bds-${index}`),
    ngayDang,
  };
}

export async function getBdsData(): Promise<BdsItem[]> {
  try {
    const res = await fetch(SHEET_URL, {
      // 🔥 FIX quan trọng cho Vercel
      next: { revalidate: 600 }, // 10 phút cache
    });

    if (!res.ok) return [];

    const csv = await res.text();

    const parsed = Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
    });

    const raw = parsed.data as any[];

    const data = raw.map(normalize);

    // unique slug
    const used = new Map<string, number>();

    return data
      .map((item) => {
        const count = used.get(item.slug) || 0;
        used.set(item.slug, count + 1);

        return {
          ...item,
          slug: count === 0 ? item.slug : `${item.slug}-${count + 1}`,
        };
      })
      .sort(
        (a, b) =>
          new Date(b.ngayDang || 0).getTime() -
          new Date(a.ngayDang || 0).getTime()
      );
  } catch (e) {
    console.error("GoogleSheet error:", e);
    return [];
  }
}
