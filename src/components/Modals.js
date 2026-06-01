'use client';
import { useState } from 'react';

export default function Modals() {
  // Quản lý trạng thái đóng/mở của 3 Popup độc lập
  const [activeModal, setActiveModal] = useState(null); // 'gallery' | 'map' | 'consignment' | null
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const sampleImages = [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c'
  ];

  // Xử lý gửi Form Ký Gửi thẳng sang Zalo
  const handleConsignmentSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('fullName');
    const phone = formData.get('phoneNumber');
    const details = formData.get('propertyDetails');
    
    const message = `Xin chào anh Huy, tôi muốn ký gửi BĐS:\n- Họ tên: ${name}\n- SĐT: ${phone}\n- Thông tin: ${details}`;
    const zaloUrl = `https://zalo.me/0905555xxx?text=${encodeURIComponent(message)}`; // Điền SĐT anh Huy
    window.open(zaloUrl, '_blank');
    setActiveModal(null);
  };

  return (
    <>
      {/* Nút Demo cố định ở góc màn hình để kích hoạt Popup nhanh (Khớp tính năng bản gốc) */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col space-y-2">
        <button 
          onClick={() => { setActiveModal('gallery'); setCurrentImgIndex(0); }}
          className="bg-black/80 hover:bg-black text-white text-xs px-3 py-2 rounded-full shadow-lg transition"
        >
          📷 Xem Ảnh Dự Án
        </button>
        <button 
          onClick={() => setActiveModal('map')}
          className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-2 rounded-full shadow-lg transition"
        >
          🗺️ Bản Vẽ Trích Lục
        </button>
        <button 
          onClick={() => setActiveModal('consignment')}
          className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-2 rounded-full shadow-lg transition"
        >
          ✍️ Ký Gửi Nhà Đất
        </button>
      </div>

      {activeModal && (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          
          {/* 1. MODAL SLIDE ẢNH CHI TIẾT */}
          {activeModal === 'gallery' && (
            <div className="bg-white rounded-xl overflow-hidden max-w-3xl w-full p-4 relative shadow-2xl">
              <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-700 hover:text-black font-bold text-2xl z-10">✕</button>
              <h3 className="text-lg font-bold mb-4 text-gray-900">Thư Viện Ảnh Thực Tế</h3>
              <div className="relative h-64 md:h-96 w-full bg-gray-100 rounded-lg overflow-hidden">
                <img src={sampleImages[currentImgIndex]} alt="BĐS" className="object-cover w-full h-full transition duration-300" />
                <button 
                  onClick={() => setCurrentImgIndex(prev => prev === 0 ? sampleImages.length - 1 : prev - 1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black"
                >
                  ◀
                </button>
                <button 
                  onClick={() => setCurrentImgIndex(prev => prev === sampleImages.length - 1 ? 0 : prev + 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black"
                >
                  ▶
                </button>
              </div>
              <div className="flex justify-center space-x-2 mt-4">
                {sampleImages.map((_, i) => (
                  <span key={i} className={`h-2 w-2 rounded-full ${i === currentImgIndex ? 'bg-blue-600' : 'bg-gray-300'}`} />
                ))}
              </div>
            </div>
          )}

          {/* 2. MODAL XEM BẢN VẼ TRÍCH LỤC QUY HOẠCH */}
          {activeModal === 'map' && (
            <div className="bg-white rounded-xl overflow-hidden max-w-2xl w-full p-4 relative shadow-2xl">
              <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-700 hover:text-black font-bold text-2xl z-10">✕</button>
              <h3 className="text-lg font-bold mb-2 text-gray-900">Sơ Đồ Bản Vẽ Trích Lục Quy Hoạch</h3>
              <p className="text-xs text-gray-500 mb-4">Bạn có thể dùng tổ hợp phím hoặc cử chỉ thu phóng trên trình duyệt để xem rõ các mốc lộ giới.</p>
              <div className="overflow-auto border rounded max-h-[70vh] bg-gray-50 flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b" 
                  alt="Sơ đồ quy hoạch" 
                  className="max-w-none w-[150%] h-auto cursor-zoom-in"
                />
              </div>
            </div>
          )}

          {/* 3. MODAL FORM KÝ GỬI CHUYỂN TRỰC TIẾP QUA ZALO ANH HUY */}
          {activeModal === 'consignment' && (
            <div className="bg-white rounded-xl p-6 max-w-md w-full relative shadow-2xl">
              <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl">✕</button>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Đăng Ký Ký Gửi Nhà Đất</h3>
              <p className="text-sm text-gray-600 mb-4">Thông tin ký gửi của anh/chị sẽ được chuyển trực tiếp tới hệ thống xử lý tin của Trần Huy Land.</p>
              <form onSubmit={handleConsignmentSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">HỌ VÀ TÊN <span className="text-red-500">*</span></label>
                  <input type="text" name="fullName" required placeholder="Nguyễn Văn A" className="w-full border p-2.5 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">SỐ ĐIỆN THOẠI (ZALO) <span className="text-red-500">*</span></label>
                  <input type="tel" name="phoneNumber" required placeholder="0905xxxxxx" className="w-full border p-2.5 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">THÔNG TIN CHI TIẾT BĐS <span className="text-red-500">*</span></label>
                  <textarea name="propertyDetails" rows="3" required placeholder="Địa chỉ, diện tích, giá mong muốn..." className="w-full border p-2.5 rounded-lg text-sm"></textarea>
                </div>
                <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg text-sm transition">
                  🚀 Xác Nhận Gửi Qua Zalo
                </button>
              </form>
            </div>
          )}

        </div>
      )}
    </>
  );
}
