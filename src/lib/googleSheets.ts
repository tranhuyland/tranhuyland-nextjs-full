import Papa from "papaparse";

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1-LupBV6uNuUitz4vF6pFv6MupuVDMujafqhjQBNNPTA/export?format=csv";

// ==========================
// AUTO CREATE SLUG UNIQUE
// ==========================
function slugify(text) {
  return (text || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// ==========================
// NORMALIZE DATA
// ==========================
function normalize(row, index) {
  return {
    id: Number(row.id) || index,
    title: row.title || "",
    description: row.description || "",
    price: Number(String(row.price || row.soGia || "").replace(/[^\d]/g, "")) || 0,
    area: row.area || "",
    location: row.location || "",

    images: (row.images || "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean),

    ngayDang: row.ngayDang || row.date || "",

    slug: slugify(row.title || `bds-${index}`)
  };
}

// ==========================
// UNIQUE SLUG HANDLER
// ==========================
function makeUniqueSlugs(items) {
  const map = new Map();

  return items.map((item) => {
    const base = item.slug || "bds";
    const count = map.get(base) || 0;
    map.set(base, count + 1);

    return {
      ...item,
      slug: count === 0 ? base : `${base}-${count + 1}`,
    };
  });
}

// ==========================
// FETCH GOOGLE SHEET DATA
// ==========================
export async function getBdsData() {
  try {
    const res = await fetch(SHEET_URL, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Cannot fetch Google Sheet");

    const csv = await res.text();

    const parsed = Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
    });

    const raw = parsed.data || [];

    if (!Array.isArray(raw)) return [];

    // normalize
    let data = raw.map((row, index) => normalize(row, index));

    // unique slug
    data = makeUniqueSlugs(data);

    // sort newest first
    data.sort((a, b) => {
      const d1 = new Date(a.ngayDang || 0).getTime();
      const d2 = new Date(b.ngayDang || 0).getTime();
      return d2 - d1;
    });

    return data;
  } catch (error) {
    console.error("Google Sheet Error:", error);
    return [];
  }
}
