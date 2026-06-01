import { getBdsData } from "@/lib/googleSheets";

export const revalidate = 600;

export default async function sitemap() {
  const data = await getBdsData();

  const routes = data.map((item) => ({
    url: `https://tranhuyland.vn/nha-dat/${item.slug}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: "https://tranhuyland.vn",
      lastModified: new Date(),
    },
    ...routes,
  ];
}
