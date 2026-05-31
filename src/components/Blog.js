import { Building2, Map, Car } from 'lucide-react';

export default function Blog() {
  return (
    <section id="blog-section" className="max-w-7xl mx-auto w-full px-4 py-20">
      <div className="mb-10 text-center sm:text-left">
        <p className="text-amber-500 uppercase tracking-widest text-xs font-bold mb-2">GÓC CHIA SẺ KINH NGHIỆM</p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Tin Tức & Kiến Thức Thị Trường</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <article className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mb-4"><Building2 className="w-5 h-5" /></div>
          <h3 className="font-extrabold text-lg mb-3 text-slate-900 hover:text-amber-500 transition-colors">Có Nên Mua Nhà Hải Châu?</h3>
          <p className="text-slate-500 text-sm leading-relaxed text-justify">Phân tích chuyên sâu về tiềm năng tăng giá bền vững, mật độ tiện ích công cộng và nhu cầu sở hữu bất động sản lõi đô thị trung tâm Đà Nẵng.</p>
        </article>
        <article className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4"><Map className="w-5 h-5" /></div>
          <h3 className="font-extrabold text-lg mb-3 text-slate-900 hover:text-amber-500 transition-colors">Kinh Nghiệm Mua Đất Sơn Trà</h3>
          <p className="text-slate-500 text-sm leading-relaxed text-justify">Những lưu ý pháp lý quan trọng cốt lõi, kiểm tra tranh chấp ranh giới và khoảng cách an toàn khi chọn mua đất thổ cư gần biển Đà Nẵng.</p>
        </article>
        <article className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4"><Car className="w-5 h-5" /></div>
          <h3 className="font-extrabold text-lg mb-3 text-slate-900 hover:text-amber-500 transition-colors">Nhà Kiệt Ô Tô Là Gì?</h3>
          <p className="text-slate-500 text-sm leading-relaxed text-justify">Định nghĩa lộ giới kiệt hẻm tissue chuẩn, giải thích ưu nhược điểm thực tế và cách thẩm định giá khi tìm mua phân khúc nhà kiệt ô tô ở thực.</p>
        </article>
      </div>
    </section>
  );
}
