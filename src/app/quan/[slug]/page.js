import { notFound } from "next/navigation";
import { getBdsData } from "@/lib/googleSheets";
import PropertyCard from "@/components/PropertyCard";

const DISTRICTS = {
  "hai-chau": "Hải Châu",
  "cam-le": "Cẩm Lệ",
  "son-tra": "Sơn Trà",
  "ngu-hanh-son": "Ngũ Hành Sơn",
};

export async function generateStaticParams() {
  return Object.keys(DISTRICTS).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }) {
  const district = DISTRICTS[params.slug];

  if (!district) return {};

  return {
    title: `Nhà đất ${district} Đà Nẵng`,
    description: `Kho nhà đất ${district} cập nhật mới nhất.`,
  };
}

export default async function DistrictPage({ params }) {
  const district = DISTRICTS[params.slug];

  if (!district) {
    notFound();
  }

  const data = await getBdsData();

  const properties = data.filter(
    (item) => item.khuVuc?.trim() === district
  );

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">
        Nhà đất {district}
      </h1>

      <p className="text-gray-600 mb-8">
        Tổng hợp nhà đất chính chủ tại {district}.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((item) => (
          <PropertyCard
            key={item.id}
            property={item}
          />
        ))}
      </div>
    </main>
  );
}
