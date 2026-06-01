export const revalidate = 60;
import { notFound } from "next/navigation";
import { getBdsData } from "@/lib/googleSheets";

// =========================
// SEO METADATA
// =========================
export async function generateMetadata({ params }) {
  const { slug } = await params;

  const data = await getBdsData();

  const item = data.find((x) => x.slug === slug);

  if (!item) {
    return {
      title: "Không tìm thấy bất động sản",
    };
  }

  const image = item.images?.[0];

  return {
    title: `${item.title} | Trần Huy Land`,
    description: item.description?.slice(0, 160) || "",

    openGraph: {
      title: item.title,
      description: item.description?.slice(0, 160) || "",
      images: image ? [{ url: image }] : [],
    },

    alternates: {
      canonical: `https://tranhuyland.vn/nha-dat/${slug}`,
    },
  };
}

// =========================
// STATIC PARAMS (SEO)
// =========================
export async function generateStaticParams() {
  const data = await getBdsData();

  return (data || [])
    .filter((item) => item.slug)
    .map((item) => ({
      slug: item.slug,
    }));
}

// =========================
// PAGE
// =========================
export default async function PropertyPage({ params }) {
  const { slug } = await params;

  const data = await getBdsData();

  const item = data.find((x) => x.slug === slug);

  if (!item) notFound();

  const image = item.images?.[0];

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">
        {item.title}
      </h1>

      {image && (
        <img
          src={image}
          alt={item.title}
          className="w-full rounded-2xl mb-6"
        />
      )}

      <div className="text-2xl font-bold text-red-600 mb-4">
        {item.price?.toLocaleString("vi-VN")}
      </div>

      <div className="space-y-2 text-slate-700">
        <p>
          <strong>Khu vực:</strong> {item.location}
        </p>

        <p>
          <strong>Diện tích:</strong> {item.area}
        </p>
      </div>

      <div className="mt-8 prose max-w-none">
        <p>{item.description}</p>
      </div>
    </main>
  );
}
