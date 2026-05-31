import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
});

export const metadata = {
  metadataBase: new URL("https://tranhuyland.vn"),

  title: {
    default: "Trần Huy Land - Nhà Đất Đà Nẵng Chính Chủ",
    template: "%s | Trần Huy Land",
  },

  description:
    "Kho nhà đất chính chủ Đà Nẵng. Nhà phố Hải Châu, Cẩm Lệ, Sơn Trà, Ngũ Hành Sơn. Hình thật, giá thật, pháp lý minh bạch.",

  keywords: [
    "nhà đất đà nẵng",
    "nhà đất hải châu",
    "nhà đất cẩm lệ",
    "bán nhà đà nẵng",
    "đất nền hòa xuân",
    "trần huy land",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Trần Huy Land",
    description: "Kho nhà đất chính chủ Đà Nẵng cập nhật mỗi ngày.",
    url: "https://tranhuyland.vn",
    siteName: "Trần Huy Land",
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={`${plusJakartaSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              "name": "Trần Huy Land",
              "url": "https://tranhuyland.vn",
              "telephone": "0931555551",
              "image": "https://i.postimg.cc/JhKg8VZ9/70554272-47DB-4D3A-A1AE-2782EFCAF00F.png",
              "priceRange": "$$$",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "26 Cẩm Bá Thước, Phường Hòa Cường Bắc",
                "addressLocality": "Hải Châu",
                "addressRegion": "Đà Nẵng",
                "addressCountry": "VN"
              },
              "areaServed": ["Hải Châu", "Cẩm Lệ", "Sơn Trà", "Thanh Khê", "Đà Nẵng"]
            }),
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col pb-20 md:pb-0">
        {children}
      </body>
    </html>
  );
}
