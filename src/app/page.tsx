import { getBdsData } from "@/lib/googleSheets";
import ListingSection from "@/components/ListingSection";

export default async function Home() {
  const initialData = await getBdsData();

  return (
    <main>
      <ListingSection initialData={initialData} />
    </main>
  );
}
