export default function About() {
  return (
    <section id="about-section" className="bg-white border-t border-b border-slate-100 py-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 sm:p-12 text-white shadow-xl flex flex-col justify-center">
          <p className="text-amber-400 uppercase tracking-widest text-xs font-bold mb-3">VÌ SAO CHỌN TRẦN HUY LAND</p>
          <h3 className="text-3xl font-extrabold leading-tight mb-6">Chuyên Nhà Đất Thực Tế Tại Đà Nẵng</h3>
          <div className="space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed">
            <div>
              <h4 className="text-white font-bold mb-1.5 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>Hình Ảnh & Vị Trí Thật</h4>
              <p className="text-slate-400 text-sm">Cam kết hạn chế tối đa tin ảo, hình minh họa sai lệch thực tế hoặc nhà đã giao dịch xong làm mất thời gian khách hàng.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-1.5 flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>Hỗ Trợ Pháp Lý Minh Bạch</h4>
              <p className="text-slate-400 text-sm">Kiểm tra quy hoạch đô thị, hỗ trợ xem trực tiếp bản vẽ sổ hồng gốc và thương lượng giá cả trực tiếp với chủ tài sản.</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center bg-slate-50 border border-slate-100 p-8 sm:p-12 rounded-[2.5rem]">
          <p className="text-amber-500 uppercase tracking-widest text-xs font-bold mb-2">THỊ TRƯỜNG ĐÀ NẴNG</p>
          <h3 className="text-3xl font-extrabold text-slate-900 leading-tight mb-5">Phân Tích Địa Bàn Nổi Bật</h3>
          <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-4 text-justify">
            <p>Thị trường nhà đất Đà Nẵng hiện đang tập trung dòng tiền mạnh tại khu vực Hải Châu, Cẩm Lệ và Sơn Trà nhờ hạ tầng giao thông đồng bộ, mật độ cư dân sầm uất và tính khai thác mặt bằng kinh doanh dòng tiền vượt trội.</p>
            <p>Trong khi phân khúc nhà mặt tiền trung tâm phù hợp dòng tiền lớn cho thuê, phân khúc nhà trong kiệt rộng ô tô đỗ cửa tại Cẩm Lệ luôn được các hộ gia đình trẻ săn đón nhiệt tình vì phù hợp nhu cầu định cư an toàn lâu dài.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
