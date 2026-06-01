export const dynamic = "force-dynamic";
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

  if (!district) {
    return {
      title: "Nhà đất Đà Nẵng | Trần Huy Land",
      description: "Mua bán nhà đất Đà Nẵng chính chủ.",
    };
  }

  return {
  title: `Nhà đất ${district} Đà Nẵng | Trần Huy Land`,
  description: `Mua bán nhà đất ${district} Đà Nẵng chính chủ, cập nhật mới nhất.`,

  keywords: [
    `nhà đất ${district}`,
    `bán nhà ${district}`,
    `bất động sản ${district}`,
    `${district} Đà Nẵng`,
  ],

  openGraph: {
    title: `Nhà đất ${district} Đà Nẵng | Trần Huy Land`,
    description: `Mua bán nhà đất ${district} Đà Nẵng chính chủ, cập nhật mới nhất.`,
    type: "website",
    locale: "vi_VN",
    siteName: "Trần Huy Land",
    url: `https://tranhuyland.vn/quan/${slug}`,
  },

  alternates: {
    canonical: `https://tranhuyland.vn/quan/${slug}`,
  },
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
    (item) => item.khuVuc && item.khuVuc.trim() === district
  );

  return (
    <div>
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">
          Nhà đất {district} Đà Nẵng
        </h1>

        <p className="text-slate-600 mt-2">
          Tổng hợp bất động sản khu vực {district}, cập nhật mới nhất.
        </p>
      </section>

      <ListingSection initialData={filteredData} />
    </div>
  );
}
