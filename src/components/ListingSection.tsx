import Link from "next/link";

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

type Props = {
  initialData: BdsItem[];
};

export default function ListingSection({ initialData }: Props) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      {/* TITLE */}
      <h2 className="text-2xl font-bold mb-6">
        Bất động sản mới nhất
      </h2>

      {/* EMPTY STATE */}
      {(!initialData || initialData.length === 0) && (
        <div className="text-gray-500">
          Không có dữ liệu bất động sản
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {initialData?.map((item) => {
          const image = item.images?.[0];

          return (
            <Link
              key={item.id}
              href={`/nha-dat/${item.slug}`}
              className="border rounded-xl overflow-hidden hover:shadow-lg transition"
            >
              {/* IMAGE */}
              {image ? (
                <img
                  src={image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200" />
              )}

              {/* CONTENT */}
              <div className="p-4">
                <h3 className="font-semibold line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-red-600 font-bold mt-2">
                  {item.price?.toLocaleString("vi-VN")} VNĐ
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {item.location}
                </p>

                <p className="text-sm text-gray-500">
                  {item.area}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
