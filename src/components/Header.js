'use client';
import { PlusCircle } from 'lucide-react';

export default function Header() {
  const moModalKyGui = () => {
    window.dispatchEvent(new Event('open-modal-kygui'));
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 glass border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src="https://i.postimg.cc/JhKg8VZ9/70554272-47DB-4D3A-A1AE-2782EFCAF00F.png" alt="Trần Huy Land" className="h-9 sm:h-11 w-auto object-contain select-none" />
          <div>
            <h1 className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight">TRẦN HUY LAND</h1>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Mua Bán Nhà Phố • Đất Nền TP Đà Nẵng</p>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-slate-600">
          <a href="#" className="hover:text-slate-900 transition-all">Trang Chủ</a>
          <a href="#listing-section" className="hover:text-slate-900 transition-all">Nhà Đất Đang Bán</a>
          <a href="#about-section" className="hover:text-slate-900 transition-all">Giới Thiệu</a>
          <a href="#blog-section" className="hover:text-slate-900 transition-all">Tin Tức Khảo Sát</a>
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={moModalKyGui} className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold text-sm px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 shadow-sm">
            <PlusCircle className="w-4 h-4 text-slate-900" /> Ký Gửi Nhanh
          </button>
        </div>
      </div>
    </header>
  );
}
