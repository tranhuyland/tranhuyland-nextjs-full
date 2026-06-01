import { getBdsData } from "@/lib/googleSheets";
import ListingSection from "@/components/ListingSection";

export default async function HomePage() {
  const initialData = await getBdsData();

  return (
    <main>
      <ListingSection bdsData={initialData} />
    </main>
  );
}
