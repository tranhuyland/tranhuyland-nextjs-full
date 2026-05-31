'use client';
import { useState, useEffect } from 'react';
import { Compass, Clock, MapPin, Square, Bed, ChevronRight, Layers } from 'lucide-react';
import Modals from './Modals';

const ITEMS_PER_PAGE = 6;

export default function ListingSection({ initialData }) {
  const [danhSachBds, setDanhSachBds] = useState(initialData || []);
  const [filteredData, setFilteredData] = useState(initialData || []);
  const [trangHienTai, setTrangHienTai] = useState(1);
  const [activeTag, setActiveTag] = useState('all');
  
  const [filters, setFilters] = useState({
    khuvuc: 'all',
    loaihinh: 'all',
    gia: 'all',
    huong: 'all'
  });

  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // Sync Client khi có API updates
    fetch('/api/bds')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setDanhSachBds(data);
        }
      }).catch(err => console.error(err));
  }, []);

  useEffect(() => {
    let kq = [...danhSachBds];
    
    if (filters.khuvuc !== 'all') kq = kq.filter(i => i.khuVuc === filters.khuvuc);
    if (filters.loaihinh !== 'all') kq = kq.filter(i => i.loaiHinh === filters.loaihinh);
    
    if (filters.gia !== 'all') {
      if (filters.gia === 'duoi3') kq = kq.filter(i => i.soGia < 3.0);
      else if (filters.gia === '3to5') kq = kq.filter(i => i.soGia >= 3.0 && i.soGia <= 5.0);
      else if (filters.gia === 'tren5') kq = kq.filter(i => i.soGia > 5.0);
    }
    if (filters.huong !== 'all') {
      kq = kq.filter(i => i.huong && i.huong.toLowerCase().includes(filters.huong.toLowerCase()));
    }

    if (activeTag === 'mattien') {
      kq = kq.filter(i => i.isMatTien === true || i.isMatTien === 'TRUE');
    } else if (activeTag === 'chinhchu') {
      kq = kq.filter(i => i.tag && i.tag.includes("Chính Chủ"));
    }

    setFilteredData(kq);
    setTrangHienTai(1);
  }, [filters, activeTag, danhSachBds]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const chuyenDoiNgayThangChuan = (ngayDangStr) => {
    if (!ngayDangStr) return null;
    const chuoiSach = ngayDangStr.toString().replace(/[\r\n\t]/g, "").trim();
    if (!chuoiSach) return null;
    const parts = chuoiSach.split(/[-/]/);
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month, day);
      }
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
  const tongSoTrang = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  return (
    <>
      <section className="max-w-7xl mx-auto w-full px-4 -mt-10 relative z-10">
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-100 shadow-xl space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1 tracking-wider">Khu Vực</label>
              <select name="khuvuc" value={filters.khuvuc} onChange={handleFilterChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm font-semibold focus:outline-none focus:border-amber-500 text-slate-700 cursor-pointer">
                <option value="all">Tất cả Quận Huyện</option>
                <option value="Hải Châu">Quận Hải Châu</option>
                <option value="Thanh Khê">Quận Thanh Khê</option>
                <option value="Liên Chiểu">Quận Liên Chiểu</option>
                <option value="Cẩm Lệ">Quận Cẩm Lệ</option>
                <option value="Sơn Trà">Quận Sơn Trà</option>
                <option value="Ngũ Hành Sơn">Quận Ngũ Hành Sơn</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1 tracking-wider">Loại Hình</label>
              <select name="loaihinh" value={filters.loaihinh} onChange={handleFilterChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm font-semibold focus:outline-none focus:border-amber-500 text-slate-700 cursor-pointer">
                <option value="all">Tất cả Loại hình</option>
                <option value="Nhà phố">Nhà phố / Kiệt</option>
                <option value="Đất nền">Đất nền / Đất ở</option>
                <option value="Căn hộ">Căn hộ / Chung cư</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1 tracking-wider">Khoảng Giá</label>
              <select name="gia" value={filters.gia} onChange={handleFilterChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm font-semibold focus:outline-none focus:border-amber-500 text-slate-700 cursor-pointer">
                <option value="all">Tất cả mức giá</option>
                <option value="duoi3">Dưới 3 Tỷ</option>
                <option value="3to5">Từ 3 - 5 Tỷ</option>
                <option value="tren5">Trên 5 Tỷ</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1 tracking-wider">Hướng Nhà</label>
              <select name="huong" value={filters.huong} onChange={handleFilterChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm font-semibold focus:outline-none focus:border-amber-500 text-slate-700 cursor-pointer">
                <option value="all">Tất cả các hướng</option>
                <option value="Đông">Hướng Đông</option>
                <option value="Tây">Hướng Tây</option>
                <option value="Nam">Hướng Nam</option>
                <option value="Bắc">Hướng Bắc</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100 items-center">
            <span className="text-xs font-bold text-slate-400 uppercase mr-1 tracking-wider hidden sm:inline">Lọc nhanh:</span>
            <button onClick={() => setActiveTag('all')} className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${activeTag === 'all' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600'}`}>Tất Cả</button>
            <button onClick={() => setActiveTag('mattien')} className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${activeTag === 'mattien' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:border-amber-500 hover:text-slate-900'}`}>Mặt Tiền Kinh Doanh</button>
            <button onClick={() => setActiveTag('chinhchu')} className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${activeTag === 'chinhchu' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:border-amber-500 hover:text-slate-900'}`}>Hàng Chính Chủ</button>
          </div>
        </div>
      </section>

      <main id="listing-section" className="max-w-7xl mx-auto w-full px-4 mt-16 mb-20 flex-1">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
          <div>
            <p className="text-amber-500 uppercase tracking-widest text-xs font-bold mb-1.5">Giỏ hàng cập nhật liên tục</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Nhà Đất Được Quan Tâm</h2>
          </div>
          <p className="text-sm text-slate-400 font-medium">Hình ảnh khảo sát thực tế • Không tin ảo • Cập nhật tự động</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {dataTrangHienTai.length === 0 ? (
            <div className="col-span-full text-center py-16 text-slate-400 text-sm font-medium">Không tìm thấy sản phẩm nhà đất nào phù hợp với bộ lọc hiện tại.</div>
          ) : (
            dataTrangHienTai.map(item => {
              const danhSachAnh = layMangHinhAnh(item.anh);
              const anhDaiDien = danhSachAnh.length > 0 ? danhSachAnh[0] : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80';
              return (
                <article key={item.id} onClick={() => setSelectedProduct(item)} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer transform hover:-translate-y-1">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <img src={anhDaiDien} alt={item.tieude} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                    <span className={`absolute top-3 left-3 ${item.tagColor || 'bg-slate-900'} text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-lg tracking-wider shadow-sm`}>{item.tag || 'Bán Đất'}</span>
                    {item.huong && (
                      <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-slate-800 font-extrabold text-[10px] px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1"><Compass className="w-3 h-3 text-amber-500" />{item.huong}</span>
                    )}
                    <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" /> {tinhThoiGianCachDay(item.ngayDang)}
                    </span>
                    <span className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-sm text-white font-extrabold text-sm px-3 py-1 rounded-xl shadow-md">{item.gia}</span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                        <MapPin className="w-3.5 h-3.5 text-amber-500" />
                        <span className="truncate">{item.khuVucFull}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 line-clamp-2 group-hover:text-amber-500 text-sm sm:text-base leading-snug transition-colors">{item.tieude}</h3>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-slate-500 text-sm font-medium">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-400">
                        <span><Square className="w-3.5 h-3.5 inline mr-0.5" /> {item.dienTich}</span>
                        <span><Bed className="w-3.5 h-3.5 inline mr-0.5" /> {item.phongNgu || 'Đất ở'}</span>
                      </div>
                      <span className="text-amber-500 font-bold flex items-center gap-0.5 text-xs uppercase tracking-wider group-hover:translate-x-0.5 transition-transform">Chi tiết <ChevronRight className="w-3 h-3" /></span>
                    </div>
                  </div>
                </article>
              )
            })
          )}
        </div>

        {tongSoTrang > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            {Array.from({ length: tongSoTrang }, (_, i) => i + 1).map(page => (
              <button key={page} onClick={() => { setTrangHienTai(page); window.scrollTo({ top: document.getElementById('listing-section').offsetTop - 90, behavior: 'smooth' }); }} className={`w-9 h-9 rounded-xl text-sm transition-all active:scale-95 font-bold ${page === trangHienTai ? 'bg-amber-500 text-slate-900 shadow-sm font-extrabold scale-105' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                {page}
              </button>
            ))}
          </div>
        )}
      </main>

      <Modals selectedProduct={selectedProduct} onClose={() => setSelectedProduct(null)} tinhThoiGianCachDay={tinhThoiGianCachDay} layMangHinhAnh={layMangHinhAnh} />
    </>
  );
}
