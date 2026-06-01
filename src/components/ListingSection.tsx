import Link from "next/link";

export default function ListingSection({ bdsData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {bdsData?.map((item) => (
        <Link
          key={item.slug}
          href={`/nha-dat/${item.slug}`}
          className="border p-4 rounded-lg"
        >
          <h2 className="font-bold">{item.title}</h2>
          <p>{item.price?.toLocaleString()} đ</p>
          <p>{item.location}</p>
        </Link>
      ))}
    </div>
  );
}
