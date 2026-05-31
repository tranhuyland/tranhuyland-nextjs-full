import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
});

export const metadata = {
  title: "Trần Huy Land | Kho Nhà Đất Chính Chủ Hải Châu Cẩm Lệ Đà Nẵng",
  description: "Mua bán, ký gửi nhà đất chính chủ uy tín tại Hải Châu, Cẩm Lệ, Đà Nẵng. Cập nhật giỏ hàng thực tế mỗi ngày. Pháp lý minh bạch, có sẵn sổ đỏ bản vẽ xem ngay.",
  keywords: ["nhà đất đà nẵng", "nhà đất chính chủ hải châu", "ký gửi nhà đất cẩm lệ", "nhà đất trần huy"],
  openGraph: {
    title: "Trần Huy Land | Kho Nhà Đất Chính Chủ Hải Châu Cẩm Lệ Đà Nẵng",
    description: "Mua bán, ký gửi nhà đất chính chủ uy tín tại Hải Châu, Cẩm Lệ, Đà Nẵng.",
    images: [{ url: "https://i.postimg.cc/JhKg8VZ9/70554272-47DB-4D3A-A1AE-2782EFCAF00F.png" }],
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
      <body class="antialiased min-h-screen flex flex-col pb-20 md:pb-0">
        {children}
      </body>
    </html>
  );
}
