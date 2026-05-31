'use client';
import { useState, useEffect } from 'react';
import { Compass, Clock, MapPin, Square, Bed, ChevronRight } from 'lucide-react';
import Modals from './Modals';

const ITEMS_PER_PAGE = 6;

export default function ListingSection({ initialData }) {
  const [danhSachBds, setDanhSachBds] = useState(initialData || []);
  const [filteredData, setFilteredData] = useState(initialData || []);
  const [trangHienTai, setTrangHienTai] = useState(1);
  const [filters, setFilters] = useState({ khuvuc: 'all', gia: 'all' });
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetch('/api/bds')
      .then(res => res.json())
      .then(data => { if (data?.length > 0) setDanhSachBds(data); });
  }, []);

  useEffect(() => {
    let kq = [...danhSachBds];
    if (filters.khuvuc !== 'all') kq = kq.filter(i => i.khuVuc === filters.khuvuc);
    if (filters.gia !== 'all') {
      if (filters.gia === 'duoi3') kq = kq.filter(i => i.soGia < 3.0);
      else if (filters.gia === '3to5') kq = kq.filter(i => i.soGia >= 3.0 && i.soGia <= 5.0);
      else if (filters.gia === 'tren5') kq = kq.filter(i => i.soGia > 5.0);
    }
    setFilteredData(kq); 
    setTrangHienTai(1);
  }, [filters, danhSachBds]);

  // BỔ SUNG: Khôi phục 2 hàm xử lý chuỗi và thời gian bị thiếu gây crash giao diện
  const chuyenDoiNgayThangChuan = (ngayDangStr) => {
    if (!ngayDangStr) return null;
    const chuoiSach = ngayDangStr.toString().replace(/[\r\n\t]/g, "").trim();
    if (!chuoiSach) return null;
    const parts = chuoiSach.split(/[-/]/);
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) return new Date(year, month, day);
    }
    return null;
  };

  const tinhThoiGianCachDay = (ngayDangStr) => {
    const ngayDang = chuyenDoiNgayThangChuan(ngayDangStr);
    if (!ngayDang) return "Tin mới";
    const homNay = new Date();
    ngayDang.setHours(0,0,0,0);
    homNay.setHours(0,0,0,0);
    const hieuThoiGian = homNay.getTime() - ngayDang.getTime();
    const soNgay = Math.floor(hieuThoiGian / (1000 * 60 * 60 * 24));
    
    if (soNgay <= 0) return "Hôm nay";
    if (soNgay === 1) return "1 ngày trước";
    if (soNgay < 7) return `${soNgay} ngày trước`;
    const soTuan = Math.floor(soNgay / 7);
    if (soTuan < 4) return `${soTuan} tuần trước`;
    const soThang = Math.floor(soNgay / 30);
    if (soThang < 12) return `${soThang} tháng trước`;
    return `${ngayDang.getDate()}/${ngayDang.getMonth() + 1}/${ngayDang.getFullYear()}`;
  };

  const layMangHinhAnh = (chuoiAnh) => {
    if (!chuoiAnh) return [];
    return chuoiAnh.split(',').map(url => url.trim()).filter(url => url !== '');
  };

  const batDau = (trangHienTai - 1) * ITEMS_PER_PAGE;
  const dataTrangHienTai = filteredData.slice(batDau, batDau + ITEMS_PER_PAGE);

  return (
    <>
      <main className="max-w-7xl mx-auto w-full px-4 mt-16 mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {dataTrangHienTai.map(item => {
            const danhSachAnh = layMangHinhAnh(item.anh);
            const anhDaiDien = danhSachAnh.length > 0 ? danhSachAnh[0] : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80';
            return (
              <article key={item.id} onClick={() => setSelectedProduct(item)} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer">
                <div className="relative aspect-[4/3] bg-slate-100">
                  <img src={anhDaiDien} alt={item.tieude} className="w-full h-full object-cover" />
                  <span className="absolute bottom-3 right-3 bg-slate-900 text-white font-extrabold text-sm px-3 py-1 rounded-xl shadow-md">{item.gia}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">{item.tieude}</h3>
                </div>
              </article>
            );
          })}
        </div>
      </main>

      {/* Truyền đầy đủ các hàm xử lý dữ liệu xuống Modal */}
      <Modals 
        selectedProduct={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        tinhThoiGianCachDay={tinhThoiGianCachDay}
        layMangHinhAnh={layMangHinhAnh}
      />
    </>
  );
}
