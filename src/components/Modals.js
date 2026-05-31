'use client';
import { useState, useEffect, useRef } from 'react';
import { X, ShieldCheck, MapPin, Calendar, Square, Bed, Map, FileText, Phone, PenTool, FilePlus2 } from 'lucide-react';

export default function Modals({ selectedProduct, onClose, tinhThoiGianCachDay, layMangHinhAnh }) {
  const [showKyGui, setShowKyGui] = useState(false);
  const [soDoUrl, setSoDoUrl] = useState(null);
  
  const [kgTen, setKgTen] = useState('');
  const [kgDiaChi, setKgDiaChi] = useState('');
  const [kgGia, setKgGia] = useState('');

  const slideRef = useRef(null);

  useEffect(() => {
    const handleOpenKyGui = () => { setShowKyGui(true); document.body.style.overflow = 'hidden'; };
    window.addEventListener('open-modal-kygui', handleOpenKyGui);
    return () => window.removeEventListener('open-modal-kygui', handleOpenKyGui);
  }, []);

  const closeKyGui = () => { setShowKyGui(false); document.body.style.overflow = ''; };

  const handleKyGuiSubmit = (e) => {
    e.preventDefault();
    const giaText = kgGia || "Thương lượng";
    const tinNhan = `Chào anh Huy, tôi muốn ký gửi nhà đất với thông tin:\n- Liên hệ: ${kgTen}\n- Địa chỉ: ${kgDiaChi}\n- Giá mong muốn: ${giaText}`;
    
    navigator.clipboard.writeText(tinNhan).then(() => {
      alert("📋 Đã tự động sao chép thông tin ký gửi!\nHệ thống đang mở Zalo anh Huy, bạn chỉ cần bấm chọn 'DÂN' (Paste) và gửi đi là xong ngay nhé.");
      window.open("https://zalo.me/0931555551", "_blank");
      closeKyGui();
    }).catch(() => {
      window.open("https://zalo.me/0931555551", "_blank");
      closeKyGui();
    });
  };

  const chuyenAnhSlide = (huong) => {
    if (!slideRef.current) return;
    const doRongKhung = slideRef.current.clientWidth;
    slideRef.current.scrollBy({ left: huong === 'phai' ? doRongKhung : -doRongKhung, behavior: 'smooth' });
  };

  const danhSachAnh = selectedProduct ? layMangHinhAnh(selectedProduct.anh) : [];
  const tongSoMuc = selectedProduct ? danhSachAnh.length + (selectedProduct.videoUrl ? 1 : 0) : 0;

  return (
    <>
      {/* 1. MODAL CHI TIẾT SẢN PHẨM */}
      {selectedProduct && (
        <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-xl rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl relative max-h-[92vh] sm:max-h-[88vh] flex flex-col">
            <button onClick={onClose} className="absolute top-4 right-4 z-50 w-8 h-8 bg-slate-900/50 backdrop-blur-md text-white rounded-full flex items-center justify-center hover:bg-slate-900 transition-all shadow">
              <X className="w-4 h-4" />
            </button>
            
            <div className="overflow-y-auto flex-1 no-scrollbar">
              <div className="relative w-full aspect-[16/10] bg-slate-100 group/slide">
                <div ref={slideRef} className="w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar">
                  {selectedProduct.videoUrl && (
                    <div className="w-full h-full flex-shrink-0 snap-start snap-always relative">
                      <iframe className="w-full h-full" src={selectedProduct.videoUrl} allowFullScreen></iframe>
                    </div>
                  )}
                  {danhSachAnh.map((url, idx) => (
                    <div key={idx} className="w-full h-full flex-shrink-0 snap-start snap-always">
                      <img src={url} alt="Hàng thực tế" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                
                {tongSoMuc > 1 && (
                  <>
                    <button onClick={() => chuyenAnhSlide('trai')} className="absolute left-3 top-1/2 -translate-y-1/2 z-50 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-all opacity-100 active:scale-90">‹</button>
                    <button onClick={() => chuyenAnhSlide('phai')} className="absolute right-3 top-1/2 -translate-y-1/2 z-50 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-all opacity-100 active:scale-90">›</button>
                    <div className="bg-slate-900/60 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-md absolute top-4 left-4 z-10 select-none flex items-center gap-1 shadow-sm uppercase tracking-wider">
                      <Layers className="w-3 h-3 text-amber-400" /> Giỏ hàng: {selectedProduct.videoUrl ? '1 Video & ' : ''}{danhSachAnh.length} Ảnh
                    </div>
                  </>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between">
                  <span className="bg-amber-100 text-amber-900 font-extrabold text-base px-3 py-1 rounded-xl shadow-sm">{selectedProduct.gia}</span>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 flex items-center"><ShieldCheck className="w-4 h-4 text-emerald-500 mr-1" />{selectedProduct.phapLy || 'Sổ hồng sẵn sàng'}</span>
                </div>
                
                <h1 className="text-base sm:text-lg font-extrabold text-slate-900 mt-4 leading-snug">{selectedProduct.tieude}</h1>
                
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

                <div className="grid grid-cols-2 gap-3 mb-5">
                  {selectedProduct.linkMap && <a href={selectedProduct.linkMap} target="_blank" rel="noopener noreferrer" className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold border border-emerald-200 rounded-xl py-2.5 px-3 text-center text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors shadow-sm"><Map className="w-4 h-4" /> Bản Đồ Vị Trí</a>}
                  {selectedProduct.anhSoDo && <button onClick={() => setSoDoUrl(selectedProduct.anhSoDo)} className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold border border-indigo-200 rounded-xl py-2.5 px-3 text-center text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors shadow-sm"><FileText className="w-4 h-4" /> Sổ Đỏ Bản Vẽ</button>}
                </div>

                <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider mb-2">Mô tả thực tế nhà đất:</h4>
                <p className="text-slate-700 text-sm sm:text-base leading-relaxed text-justify whitespace-pre-line mb-6">{selectedProduct.moTa}</p>
                
                <div className="flex gap-3 mt-4 border-t border-slate-100 pt-4">
                  <a href="tel:0931555551" className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl py-3 px-4 flex items-center justify-center gap-2 text-sm transition-all active:scale-95 shadow-md">
                    <Phone className="w-4 h-4 text-amber-400 fill-amber-400" /> Gọi Thỏa Thuận
                  </a>
                  <a href="https://zalo.me/0931555551" target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#0068ff] hover:opacity-90 text-white font-extrabold rounded-xl py-3 px-4 flex items-center justify-center text-sm transition-all active:scale-95 shadow-md">Liên Hệ Zalo</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. POPUP PHÓNG TO SỔ ĐỎ */}
      {soDoUrl && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <button onClick={() => setSoDoUrl(null)} className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-all"><X className="w-6 h-6" /></button>
          <div className="max-w-3xl w-full max-h-[85vh] flex items-center justify-center overflow-hidden rounded-xl">
            <img src={soDoUrl} alt="Trích lục sổ đỏ chi tiết" className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-xl" />
          </div>
        </div>
      )}

      {/* 3. MODAL KÝ GỬI NHANH 10S */}
      {showKyGui && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl p-6 relative">
            <button onClick={closeKyGui} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
            <h3 className="font-extrabold text-slate-900 text-base mb-1 flex items-center gap-2"><PenTool className="text-amber-500 w-4 h-4" /> Ký Gửi Nhanh Trong 10s</h3>
            <p className="text-xs text-slate-400 mb-4">Thông tin đăng ký sẽ tự động soạn thảo để gửi trực tiếp sang ứng dụng Zalo của anh Huy.</p>
            <form onSubmit={handleKyGuiSubmit} className="space-y-3 text-sm">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Tên & SĐT Liên Hệ *</label>
                <input type="text" required placeholder="Ví dụ: Anh Nam - 0905..." value={kgTen} onChange={e => setKgTen(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-1">Địa Chỉ Nhà Đất Ký Gửi *</label>
                <input type="text" required placeholder="Số nhà, tên đường, tên quận..." value={kgDiaChi} onChange={e => setKgDiaChi(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="block font-bold text-slate-600 mb-1">Giá Bán Mong Muốn</label>
                <input type="text" placeholder="Ví dụ: 3.5 Tỷ (Để trống nếu muốn thương lượng)" value={kgGia} onChange={e => setKgGia(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500" />
              </div>
              <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl py-3 text-sm mt-3 shadow-md transition-all active:scale-95">Xác Nhận Ký Gửi</button>
            </form>
          </div>
        </div>
      )}

      {/* 4. THANH ĐIỀU HƯỚNG NHANH TRÊN MOBILE */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 flex gap-3 z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <button onClick={() => { setShowKyGui(true); document.body.style.overflow = 'hidden'; }} className="flex-[2] bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold rounded-xl py-3 px-4 flex items-center justify-center gap-1.5 text-sm shadow-sm active:scale-95 transition-all">
          <FilePlus2 className="w-4 h-4" /> Ký Gửi Nhanh
        </button>
        <a href="tel:0931555551" className="flex-[1.5] bg-slate-900 text-white font-bold rounded-xl py-3 px-4 flex items-center justify-center gap-1.5 text-sm transition-transform active:scale-95 shadow-md">
          Gọi Ngay
        </a>
        <a href="https://zalo.me/0931555551" target="_blank" rel="noopener noreferrer" className="flex-[1.5] bg-[#0068ff] text-white font-bold rounded-xl py-3 px-4 flex items-center justify-center text-sm transition-transform active:scale-95 shadow-md">Zalo</a>
      </div>

      {/* BUTTON NỔI TRÊN DESKTOP */}
      <div className="hidden md:flex fixed bottom-6 right-6 z-40 flex-col gap-3">
        <a href="https://zalo.me/0931555551" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-[#0068ff] text-white flex items-center justify-center shadow-2xl font-bold text-sm hover:scale-105 transition-transform">
          Zalo
        </a>
        <a href="tel:0931555551" className="w-14 h-14 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center shadow-2xl floating-btn">
          <Phone className="w-5 h-5 text-slate-900 fill-slate-900/10" />
        </a>
      </div>
    </>
  );
}
