'use client';
import { useState, useEffect, useRef } from 'react';
import { X, ShieldCheck, MapPin, Calendar, Layers } from 'lucide-react';

export default function Modals({ selectedProduct, onClose, tinhThoiGianCachDay, layMangHinhAnh }) {
  const [showKyGui, setShowKyGui] = useState(false);
  const [kgTen, setKgTen] = useState('');
  const [kgDiaChi, setKgDiaChi] = useState('');
  const [kgGia, setKgGia] = useState('');
  
  const khungModalRef = useRef(null);
  const slideRef = useRef(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  useEffect(() => {
    const open = () => setShowKyGui(true);
    window.addEventListener('open-modal-kygui', open);
    return () => window.removeEventListener('open-modal-kygui', open);
  }, []);

  useEffect(() => {
    const modalElement = khungModalRef.current;
    if (!modalElement) return;

    const handleTouchStart = (e) => {
      touchStartX.current = e.changedTouches[0].screenX;
      touchStartY.current = e.changedTouches[0].screenY;
    };

    const handleTouchEnd = (e) => {
      if (e.target.closest('.image-slider-container')) return;

      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const khoangCachX = touchEndX - touchStartX.current;
      const khoangCachY = Math.abs(touchEndY - touchStartY.current);

      if (khoangCachX > 80 && khoangCachY < 35) {
        if (touchStartX.current < 50) return; 
        onClose();
      }
    };

    modalElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    modalElement.addEventListener('touchend', handleTouchEnd, { passive: true });

    if (selectedProduct) document.body.style.overflow = 'hidden';

    return () => {
      modalElement.removeEventListener('touchstart', handleTouchStart);
      modalElement.removeEventListener('touchend', handleTouchEnd);
      document.body.style.overflow = '';
    };
  }, [selectedProduct, onClose]);

  // BỔ SUNG: Hàm click nút bấm chuyển đổi slide ảnh thủ công
  const chuyenAnhSlide = (huong) => {
    if (!slideRef.current) return;
    const doRongKhung = slideRef.current.clientWidth;
    slideRef.current.scrollBy({ 
      left: huong === 'phai' ? doRongKhung : -doRongKhung, 
      behavior: 'smooth' 
    });
  };

  const closeKyGui = () => setShowKyGui(false);

  const handleKyGuiSubmit = (e) => {
    e.preventDefault();
    const txt = `Chào anh Huy, tôi muốn ký gửi nhà đất:\n- Liên hệ: ${kgTen}\n- Địa chỉ: ${kgDiaChi}\n- Giá: ${kgGia || "Thương lượng"}`;
    navigator.clipboard.writeText(txt).then(() => {
      alert("📋 Đã sao chép thông tin! Hệ thống đang mở Zalo, bạn hãy bấm DÁN (Paste) để gửi.");
      window.open("https://zalo.me/0931555551", "_blank");
      closeKyGui();
    });
  };

  const danhSachAnh = selectedProduct ? layMangHinhAnh(selectedProduct.anh) : [];
  const tongSoMuc = danhSachAnh.length;

  return (
    <>
      {selectedProduct && (
        <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div 
            ref={khungModalRef} 
            className="bg-white w-full sm:max-w-xl rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl relative max-h-[92vh] sm:max-h-[88vh] flex flex-col text-slate-800 will-change-transform transform transition-transform"
            style={{ WebkitBackfaceVisibility: 'hidden', backfaceVisibility: 'hidden' }}
          >
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 z-50 w-8 h-8 bg-slate-900/60 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-slate-900 transition-all shadow active:scale-90"
            >
              <X className="w-4 h-4 stroke-[3]" />
            </button>

            <div className="overflow-y-auto flex-1 no-scrollbar">
              {/* VÙNG ẢNH: Đã tối ưu hóa bộ nút chuyển slide ảnh hai bên */}
              <div className="relative aspect-[16/10] bg-slate-100 image-slider-container group">
                <div ref={slideRef} className="w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar">
                  {danhSachAnh.map((url, idx) => (
                    <img key={idx} src={url} className="w-full h-full object-cover flex-shrink-0 snap-start" alt="Hình thực tế" />
                  ))}
                </div>

                {/* BỔ SUNG: Cặp mũi tên điều hướng hai bên hông ảnh khi có nhiều ảnh */}
                {tongSoMuc > 1 && (
                  <>
                    <button 
                      onClick={() => chuyenAnhSlide('trai')} 
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center font-bold text-lg active:scale-90 select-none transition-opacity"
                    >
                      ‹
                    </button>
                    <button 
                      onClick={() => chuyenAnhSlide('phai')} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white rounded-full flex items-center justify-center font-bold text-lg active:scale-90 select-none transition-opacity"
                    >
                      ›
                    </button>
                    {/* Nhãn hiển thị số lượng hình ảnh tổng quan */}
                    <div className="bg-slate-900/70 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-md absolute top-4 left-4 z-10 pointer-events-none flex items-center gap-1 shadow-sm uppercase tracking-wider">
                      <Layers className="w-3 h-3 text-amber-400" /> Giỏ hàng: {tongSoMuc} Ảnh
                    </div>
                  </>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between">
                  <span className="bg-amber-100 text-amber-900 font-black px-3 py-1 rounded-xl shadow-sm">{selectedProduct.gia}</span>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 flex items-center"><ShieldCheck className="w-4 h-4 text-emerald-500 mr-1" />{selectedProduct.phapLy || 'Sổ hồng sẵn sàng'}</span>
                </div>
                
                <h1 className="text-base sm:text-lg font-extrabold mt-4 leading-snug">{selectedProduct.tieude}</h1>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-400 text-xs mt-2 border-b border-slate-100 pb-4 font-semibold">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-amber-500" />{selectedProduct.khuVucFull}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Đăng: {selectedProduct.ngayDang}</span>
                  <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md text-[10px] uppercase">{tinhThoiGianCachDay(selectedProduct.ngayDang)}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 my-5 p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm text-slate-600 text-center font-semibold shadow-inner">
                  <div><div className="text-slate-400 text-[11px] font-bold uppercase mb-0.5 tracking-wider">Diện tích</div><strong className="text-slate-900 text-sm sm:text-base">{selectedProduct.dienTich}</strong></div>
                  <div><div className="text-slate-400 text-[11px] font-bold uppercase mb-0.5 tracking-wider">Cấu trúc</div><strong className="text-slate-900 text-sm sm:text-base">{selectedProduct.phongNgu || 'Đất ở'}</strong></div>
                  <div><div className="text-slate-400 text-[11px] font-bold uppercase mb-0.5 tracking-wider">Hướng</div><strong className="text-slate-900 text-sm sm:text-base">{selectedProduct.huong || 'Chưa rõ'}</strong></div>
                </div>

                <p className="text-slate-700 text-sm leading-relaxed mt-4 whitespace-pre-line text-justify">{selectedProduct.moTa}</p>
                <div className="flex gap-3 mt-6 border-t pt-4">
                  <a href="tel:0931555551" className="flex-1 bg-slate-900 text-white text-center py-3 rounded-xl font-bold flex items-center justify-center gap-1">Gọi ngay</a>
                  <a href="https://zalo.me/0931555551" target="_blank" className="flex-1 bg-blue-600 text-white text-center py-3 rounded-xl font-bold flex items-center justify-center gap-1">Zalo</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POPUP KÝ GỬI */}
      {showKyGui && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 relative text-slate-800">
            <button onClick={closeKyGui} className="absolute top-4 right-4 text-slate-400"><X className="w-4 h-4" /></button>
            <h3 className="font-bold text-slate-900 text-base mb-4">Ký Gửi Nhanh Trong 10s</h3>
            <form onSubmit={handleKyGuiSubmit} className="space-y-3 text-xs">
              <input type="text" required placeholder="Tên & SĐT của bạn" value={kgTen} onChange={e => setKgTen(e.target.value)} className="w-full border rounded-xl p-3 focus:outline-none" />
              <input type="text" required placeholder="Địa chỉ bất động sản" value={kgDiaChi} onChange={e => setKgDiaChi(e.target.value)} className="w-full border rounded-xl p-3 focus:outline-none" />
              <input type="text" placeholder="Giá mong muốn (Không bắt buộc)" value={kgGia} onChange={e => setKgGia(e.target.value)} className="w-full border rounded-xl p-3 focus:outline-none" />
              <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl">Xác nhận ký gửi</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
