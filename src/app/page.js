import { getBdsData } from "@/lib/googleSheets";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ListingSection from "@/components/ListingSection";
import About from "@/components/About";
import Blog from "@/components/Blog";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";

export default async function Home() {
  // Fetch dữ liệu trực tiếp từ Server để tối ưu Google SEO
  const initialData = await getBdsData();

  return (
    <>
      <Header />
      <Hero />
      <ListingSection initialData={initialData} />
      <About />
      <Blog />
      <ContactCTA />
      <Footer />
    </>
  );
}
