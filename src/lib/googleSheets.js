import Papa from "papaparse";

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1-LupBV6uNuUitz4vF6pFv6MupuVDMujafqhjQBNNPTA/export?format=csv";

// 🔥 normalize dữ liệu để UI không bao giờ lỗi
function normalizeProperty(row, index) {
  return {
    id: Number(row.id) || index,

    title: row.title || "",

    description: row.description || "",

    price: Number(row.soGia || row.price) || 0,

    area: row.area || "",

    location: row.location || "",

    // 🔥 FIX QUAN TRỌNG NHẤT: images luôn là array
    images: row.images
      ? row.images
          .split(",")
          .map((img) => img.trim())
          .filter(Boolean)
      : [],

    // 🔥 sổ đỏ fallback nhiều tên cột khác nhau
    sodo: row.sodo || row.so_do || row.giayto || null,

    ngayDang: row.ngayDang || row.date || "",
  };
}

// 🔥 parse date an toàn
function parseDate(dateStr) {
  if (!dateStr) return new Date(0);

  const parts = dateStr.split(/[-/]/);
  if (parts.length !== 3) return new Date(0);

  const [d, m, y] = parts.map((x) => parseInt(x, 10));

  if (isNaN(d) || isNaN(m) || isNaN(y)) return new Date(0);

  return new Date(y, m - 1, d);
}

export async function getBdsData() {
  try {
    const response = await fetch(SHEET_URL, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error("Không thể fetch Google Sheet");
    }

    const csv = await response.text();

    // 🔥 dùng parser chuẩn (KHÔNG tự parse nữa)
    const { data } = Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
    });

    if (!data || !Array.isArray(data)) return [];

    // 🔥 normalize toàn bộ data
    const result = data.map((row, index) =>
      normalizeProperty(row, index)
    );

    // 🔥 sort theo ngày đăng mới nhất
    result.sort((a, b) => {
      return parseDate(b.ngayDang) - parseDate(a.ngayDang);
    });

    return result;
  } catch (error) {
    console.error("Lỗi Google Sheet Reader:", error);
    return [];
  }
}
