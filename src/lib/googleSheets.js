import Papa from "papaparse";

// ========================
// GOOGLE SHEET URL
// ========================
const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1-LupBV6uNuUitz4vF6pFv6MupuVDMujafqhjQBNNPTA/export?format=csv";

// ========================
// SLUGIFY (SEO chuẩn)
// ========================
const slugify = (text) =>
  text
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

// ========================
// AUTO UNIQUE SLUG
// ========================
function generateUniqueSlugs(data) {
  const used = new Map();

  return data.map((item, index) => {
    let base = slugify(item.title || `bds-${index}`);

    if (!base) base = `bds-${index}`;

    let count = used.get(base) || 0;

    let slug = count === 0 ? base : `${base}-${count + 1}`;

    used.set(base, count + 1);

    return {
      ...item,
      slug,
    };
  });
}

// ========================
// NORMALIZE PROPERTY
// ========================
function normalizeProperty(row, index) {
  return {
    id: Number(row.id) || index,
    title: row.title || "",
    description: row.description || "",

    price: Number(String(row.price || row.soGia || "").replace(/[^\d]/g, "")) || 0,

    area: row.area || "",
    location: row.location || "",

    images: (row.images || "")
      .split(/,|;/)
      .map((img) => img.trim())
      .filter((img) => img),

    ngayDang: row.ngayDang || row.date || "",
  };
}

// ========================
// PARSE DATE SAFE
// ========================
function parseDate(dateStr) {
  if (!dateStr) return new Date(0);

  const parts = dateStr.split(/[-/]/);
  if (parts.length !== 3) return new Date(0);

  const [d, m, y] = parts.map(Number);

  if (isNaN(d) || isNaN(m) || isNaN(y)) return new Date(0);

  return new Date(y, m - 1, d);
}

// ========================
// MAIN FUNCTION
// ========================
export async function getBdsData() {
  try {
    const response = await fetch(SHEET_URL, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Không thể fetch Google Sheet");
    }

    const csv = await response.text();

    const parsed = Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
    });

    const data = parsed.data;

    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    // normalize
    let result = data.map((row, index) =>
      normalizeProperty(row, index)
    );

    // auto slug unique
    result = generateUniqueSlugs(result);

    // sort mới nhất
    result.sort((a, b) => {
      return parseDate(b.ngayDang) - parseDate(a.ngayDang);
    });

    return result;
  } catch (error) {
    console.error("Google Sheet Error:", error);
    return [];
  }
}
