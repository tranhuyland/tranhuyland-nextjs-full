'use client';
import { useState, useEffect } from 'react';
import { Compass, Clock, MapPin, ChevronRight, Video } from 'lucide-react';
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
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const idParam = urlParams.get('id');
      if (!idParam) {
        setSelectedProduct(null);
      } else if (danhSachBds.length > 0) {
        const product = danhSachBds.find(p => p.id === parseInt(idParam));
        if (product) setSelectedProduct(product);
      }
    };
    window.addEventListener('popstate', handlePopState);
    
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get('id');
    if (idParam && danhSachBds.length > 0) {
      const product = danhSachBds.find(p => p.id === parseInt(idParam));
      if (product) setSelectedProduct(product);
    }
    return () => window.removeEventListener('popstate', handlePopState);
  }, [danhSachBds]);

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

  const handleSelectProduct = (item) => {
    setSelectedProduct(item);
    window.history.pushState({ id: item.id }, "", `?id=${item.id}`);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    window.history.pushState({}, "", window.location.pathname);
  };

  // LOGIC PHÂN TRANG: Tính toán vị trí cắt mốc 6 bài một trang
  const batDau = (trangHienTai - 1) * ITEMS_PER_PAGE;
  const dataTrangHienTai = filteredData.slice(batDau, batDau + ITEMS_PER_PAGE);
  const tongSoTrang = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  return (
    <>
      <main className="max-w-7xl mx-auto w-full px-4 mt-16 mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {dataTrangHienTai.map(item => {
            const danhSachAnh = layMangHinhAnh(item.anh);
            const anhDaiDien = danhSachAnh.length > 0 ? danhSachAnh[0] : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80';
            const vanBanCachDay = tinhThoiGianCachDay(item.ngayDang);

            return (
              <article key={item.id} onClick={() => handleSelectProduct(item)} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer transform hover:-translate-y-1">
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img src={anhDaiDien} alt={item.tieude} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  
                  {/* BỔ SUNG: Hiển thị nhãn hệ thống (Tag nhãn nội dung đè lên ảnh giống 100% bản gốc) */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    {/* Nhãn loại hình hoặc hàng độc quyền */}
                    <span className={`text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-lg tracking-wider shadow-sm ${item.tagColor || 'bg-slate-900'}`}>
                      {item.tag || 'Bán Đất'}
                    </span>
                    {/* Nhãn nhận biết mặt tiền */}
                    {(item.isMatTien === true || item.isMatTien === 'TRUE') && (
                      <span className="bg-red-600 text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-lg tracking-wider shadow-sm flex items-center gap-1">
                        🔥 Mặt Tiền Kinh Doanh
                      </span>
                    )}
                    {/* Nhãn nhận biết bài đăng có video thực tế */}
                    {item.videoUrl && (
                      <span className="bg-emerald-600 text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-lg tracking-wider shadow-sm flex items-center gap-1">
                        <Video className="w-3 h-3" /> Có Video Khảo Sát
                      </span>
                    )}
                  </div>

                  {item.huong && (
                    <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-slate-800 font-extrabold text-[10px] px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1 z-10">
                      <Compass className="w-3 h-3 text-amber-500" />{item.huong}
                    </span>
                  )}
                  
                  <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 z-10">
                    <Clock className="w-3 h-3 text-amber-400" /> {vanBanCachDay}
                  </span>

                  <span className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-sm text-white font-extrabold text-sm px-3 py-1 rounded-xl shadow-md z-10">{item.gia}</span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      <span className="truncate">{item.khuVucFull || item.khuVuc}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-amber-500 transition-colors">{item.tieude}</h3>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-end text-slate-500 text-sm font-medium">
                    <span className="text-amber-500 font-bold flex items-center gap-0.5 text-xs uppercase tracking-wider group-hover:translate-x-0.5 transition-transform">Chi tiết <ChevronRight className="w-3 h-3" /></span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* BỔ SUNG: Thanh nút bấm chuyển phân trang mượt mà khi kho hàng có > 6 sản phẩm */}
        {tongSoTrang > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12 mb-10">
            {Array.from({ length: tongSoTrang }, (_, i) => i + 1).map(page => (
              <button 
                key={page} 
                onClick={() => {
                  setTrangHienTai(page);
                  window.scrollTo({ top: document.getElementById('listing-section').offsetTop - 90, behavior: 'smooth' });
                }} 
                className={`w-9 h-9 rounded-xl text-sm transition-all active:scale-95 font-bold ${page === trangHienTai ? 'bg-amber-500 text-slate-900 shadow-sm font-extrabold scale-105' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'}`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </main>

      <Modals 
        selectedProduct={selectedProduct} 
        onClose={handleCloseModal} 
        tinhThoiGianCachDay={tinhThoiGianCachDay}
        layMangHinhAnh={layMangHinhAnh}
      />
    </>
  );
}
