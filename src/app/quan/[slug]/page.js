import ListingSection from "@/components/ListingSection";
import { getBdsData } from "@/lib/googleSheets";
import { notFound } from "next/navigation";

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
  const { slug } = await params;

  const district = DISTRICTS[slug];

  return {
    title: `Nhà đất ${district} Đà Nẵng`,
    description: `Mua bán nhà đất ${district} Đà Nẵng chính chủ`,
  };
}

export default async function DistrictPage({ params }) {
  const { slug } = await params;

  const district = DISTRICTS[slug];

  if (!district) {
    notFound();
  }

  const data = await getBdsData();

  const filteredData = data.filter(
    (item) =>
      item.khuVuc &&
      item.khuVuc.trim() === district
  );

  return (
    <div>
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">
          Nhà đất {district}
        </h1>

        <p className="text-slate-600 mt-2">
          Tổng hợp bất động sản khu vực {district}.
        </p>
      </section>

      <ListingSection initialData={filteredData} />
    </div>
  );
}
