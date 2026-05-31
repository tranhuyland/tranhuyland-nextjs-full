import { getBdsData } from "@/lib/googleSheets";

export default async function sitemap() {
  const data = await getBdsData();

  const properties = data.map((item) => ({
    url: `https://tranhuyland.vn/nha-dat/${item.id}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: "https://tranhuyland.vn",
      lastModified: new Date(),
    },

    {
      url: "https://tranhuyland.vn/quan/hai-chau",
      lastModified: new Date(),
    },

    {
      url: "https://tranhuyland.vn/quan/cam-le",
      lastModified: new Date(),
    },

    {
      url: "https://tranhuyland.vn/quan/son-tra",
      lastModified: new Date(),
    },

    {
      url: "https://tranhuyland.vn/quan/ngu-hanh-son",
      lastModified: new Date(),
    },

    ...properties,
  ];
}
