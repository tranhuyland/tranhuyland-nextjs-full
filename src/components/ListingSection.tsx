import Link from "next/link";
import type { BdsItem } from "@/lib/googleSheets";

export default function ListingSection({
  initialData,
}: {
  initialData: BdsItem[];
}) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {initialData.map((item) => (
        <Link
          key={item.id}
          href={`/nha-dat/${item.slug}`}
          className="border rounded-xl p-4"
        >
          <h3 className="font-bold">{item.title}</h3>
          <p>{item.price}</p>
          <p>{item.location}</p>
        </Link>
      ))}
    </section>
  );
}
