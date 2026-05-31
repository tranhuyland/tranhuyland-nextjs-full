import { notFound } from "next/navigation";
import { getBdsData } from "@/lib/googleSheets";

export async function generateMetadata({ params }) {
  const { id } = await params;

  const data = await getBdsData();

  const item = data.find(
    (x) => String(x.id) === String(id)
  );

  if (!item) {
    return {
      title: "Không tìm thấy bất động sản",
    };
  }

  return {
    title: `${item.tieude} | Trần Huy Land`,
    description: item.moTa?.slice(0, 160),

    openGraph: {
      title: item.tieude,
      description: item.moTa?.slice(0, 160),
      images: item.anh
        ? [item.anh.split(",")[0].trim()]
        : [],
    },

    alternates: {
      canonical: `https://tranhuyland.vn/nha-dat/${id}`,
    },
  };
}

export async function generateStaticParams() {
  const data = await getBdsData();

  return data.map((item) => ({
    id: String(item.id),
  }));
}

export default async function PropertyPage({ params }) {
  const { id } = await params;

  const data = await getBdsData();

  const item = data.find(
    (x) => String(x.id) === String(id)
  );

  if (!item) {
    notFound();
  }

  const image =
    item.anh?.split(",")[0]?.trim() || "";

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">
        {item.tieude}
      </h1>

      <img
        src={image}
        alt={item.tieude}
        className="w-full rounded-2xl mb-6"
      />

      <div className="text-2xl font-bold text-red-600 mb-4">
        {item.gia}
      </div>

      <div className="space-y-2 text-slate-700">
        <p>
          <strong>Khu vực:</strong> {item.khuVuc}
        </p>

        <p>
          <strong>Diện tích:</strong> {item.dienTich}
        </p>

        <p>
          <strong>Pháp lý:</strong> {item.phapLy}
        </p>

        <p>
          <strong>Hướng:</strong> {item.huong}
        </p>
      </div>

      <div className="mt-8 prose max-w-none">
        <p>{item.moTa}</p>
      </div>
    </main>
  );
}
