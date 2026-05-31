'use client';
import { useState, useEffect } from 'react';
import { X, ShieldCheck, MapPin, Calendar, Square, Bed, Phone } from 'lucide-react';

export default function Modals({ selectedProduct, onClose, tinhThoiGianCachDay, layMangHinhAnh }) {
  const [showKyGui, setShowKyGui] = useState(false);
  const [kgTen, setKgTen] = useState('');
  const [kgDiaChi, setKgDiaChi] = useState('');
  const [kgGia, setKgGia] = useState('');

  useEffect(() => {
    const open = () => setShowKyGui(true);
    window.addEventListener('open-modal-kygui', open);
    return () => window.removeEventListener('open-modal-kygui', open);
  }, []);

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

  return (
    <>
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-xl rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl relative max-h-[92vh] sm:max-h-[88vh] flex flex-col text-slate-800">
            <button onClick={onClose} className="absolute top-4 right-4 z-50 w-8 h-8 bg-slate-900/50 text-white rounded-full flex items-center justify-center font-bold">✕</button>
            <div className="overflow-y-auto flex-1 no-scrollbar">
              <div className="relative aspect-[16/10] bg-slate-100">
                <div className="w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar">
                  {danhSachAnh.map((url, idx) => (
                    <img key={idx} src={url} className="w-full h-full object-cover flex-shrink-0 snap-start" alt="Hình thực tế" />
                  ))}
                </div>
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

                <p className="text-slate-700 text-sm leading-relaxed mt-4 whitespace-pre-line">{selectedProduct.moTa}</p>
                <div className="flex gap-3 mt-6 border-t pt-4">
                  <a href="tel:0931555551" className="flex-1 bg-slate-900 text-white text-center py-3 rounded-xl font-bold flex items-center justify-center gap-1">Gọi ngay</a>
                  <a href="https://zalo.me/0931555551" target="_blank" className="flex-1 bg-blue-600 text-white text-center py-3 rounded-xl font-bold flex items-center justify-center gap-1">Zalo</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showKyGui && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 relative text-slate-800">
            <button onClick={closeKyGui} className="absolute top-4 right-4 text-slate-400">✕</button>
            <h3 className="font-bold text-slate-900 text-base mb-4">Ký Gửi Nhanh Trong 10s</h3>
            <form onSubmit={handleKyGuiSubmit} className="space-y-3 text-xs">
              <input type="text" required placeholder="Tên & SĐT của bạn" value={kgTen} onChange={e => setKgTen(e.target.value)} className="w-full border rounded-xl p-3" />
              <input type="text" required placeholder="Địa chỉ bất động sản" value={kgDiaChi} onChange={e => setKgDiaChi(e.target.value)} className="w-full border rounded-xl p-3" />
              <input type="text" placeholder="Giá mong muốn (Không bắt buộc)" value={kgGia} onChange={e => setKgGia(e.target.value)} className="w-full border rounded-xl p-3" />
              <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl">Xác nhận ký gửi</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
