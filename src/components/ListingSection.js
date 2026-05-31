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

  // TỐI ƯU CHỐNG NHÁY: Đồng bộ trạng thái Modal mượt mà với lịch sử duyệt của Safari
  useEffect(() => {
    const handlePopState = (event) => {
      const urlParams = new URLSearchParams(window.location.search);
      const idParam = urlParams.get('id');
      
      if (!idParam) {
        // Nếu không có id trên URL nữa, đóng modal lập tức
        setSelectedProduct(null);
      } else if (danhSachBds.length > 0) {
        const product = danhSachBds.find(p => p.id === parseInt(idParam));
        if (product) setSelectedProduct(product);
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    // Tự động mở nếu truy cập thẳng vào đường dẫn có sẵn ID sản phẩm
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
              <article key={item.id} onClick={() => handleSelectProduct(item)} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer">
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

      <Modals 
        selectedProduct={selectedProduct} 
        onClose={handleCloseModal} 
        tinhThoiGianCachDay={(ngay) => "Tin mới"}
        layMangHinhAnh={layMangHinhAnh}
      />
    </>
  );
}
