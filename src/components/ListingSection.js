'use client';
import { useState, useMemo } from 'react';

export default function ListingSection({ bdsData }) {
  // 1. Quản lý trạng thái bộ lọc
  const [filterDistrict, setFilterDistrict] = useState('All');
  const [filterPrice, setFilterPrice] = useState('All');
  const [filterDirection, setFilterDirection] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 2. Logic lọc dữ liệu thông minh khớp 100% với HTML gốc
  const filteredData = useMemo(() => {
    if (!bdsData || !Array.isArray(bdsData)) return [];
    
    return bdsData.filter(item => {
      // Lọc theo Quận
      const matchesDistrict = filterDistrict === 'All' || item.district?.trim() === filterDistrict;
      
      // Lọc theo Hướng
      const matchesDirection = filterDirection === 'All' || item.direction?.trim() === filterDirection;
      
      // Lọc theo Loại hình
      const matchesType = filterType === 'All' || item.type?.trim() === filterType;
      
      // Lọc theo Khoảng giá (Triệu/m2 hoặc Tổng giá trị tùy thuộc dữ liệu gốc của anh)
      let matchesPrice = true;
      if (filterPrice !== 'All') {
        const price = parseFloat(item.priceNumber) || 0;
        if (filterPrice === 'under2') matchesPrice = price < 2000; // Dưới 2 tỷ (đơn vị triệu)
        else if (filterPrice === '2to5') matchesPrice = price >= 2000 && price <= 5000;
        else if (filterPrice === 'over5') matchesPrice = price > 5000;
      }

      // Tìm kiếm theo từ khóa văn bản (Tiêu đề, Địa chỉ)
      const matchesSearch = searchQuery === '' || 
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.address?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesDistrict && matchesDirection && matchesType && matchesPrice && matchesSearch;
    });
  }, [bdsData, filterDistrict, filterPrice, filterDirection, filterType, searchQuery]);

  // 3. Phân trang dữ liệu
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <section id="listings" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Danh Sách Bất Động Sản Nổi Bật
        </h2>

        {/* BỘ LỌC ĐA NĂNG (GIỐNG 100% BẢN GỐC) */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-5 gap-4">
          <input 
            type="text" 
            placeholder="Tìm kiếm vị trí, tên dự án..." 
            className="border p-2 rounded w-full text-sm"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          />
          <select 
            className="border p-2 rounded w-full text-sm bg-white"
            value={filterDistrict}
            onChange={(e) => { setFilterDistrict(e.target.value); setCurrentPage(1); }}
          >
            <option value="All">Tất cả Quận/Huyện</option>
            <option value="Liên Chiểu">Liên Chiểu</option>
            <option value="Thanh Khê">Thanh Khê</option>
            <option value="Hải Châu">Hải Châu</option>
            <option value="Sơn Trà">Sơn Trà</option>
            <option value="Ngũ Hành Sơn">Ngũ Hành Sơn</option>
            <option value="Cẩm Lệ">Cẩm Lệ</option>
          </select>
          <select 
            className="border p-2 rounded w-full text-sm bg-white"
            value={filterPrice}
            onChange={(e) => { setFilterPrice(e.target.value); setCurrentPage(1); }}
          >
            <option value="All">Tất cả khoảng giá</option>
            <option value="under2">Dưới 2 Tỷ</option>
            <option value="2to5">2 Tỷ - 5 Tỷ</option>
            <option value="over5">Trên 5 Tỷ</option>
          </select>
          <select 
            className="border p-2 rounded w-full text-sm bg-white"
            value={filterDirection}
            onChange={(e) => { setFilterDirection(e.target.value); setCurrentPage(1); }}
          >
            <option value="All">Tất cả các hướng</option>
            <option value="Đông">Đông</option>
            <option value="Tây">Tây</option>
            <option value="Nam">Nam</option>
            <option value="Bắc">Bắc</option>
            <option value="Đông Nam">Đông Nam</option>
          </select>
          <select 
            className="border p-2 rounded w-full text-sm bg-white"
            value={filterType}
            onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
          >
            <option value="All">Loại hình sản phẩm</option>
            <option value="Đất nền">Đất nền</option>
            <option value="Nhà phố">Nhà phố</option>
            <option value="Căn hộ">Căn hộ</option>
          </select>
        </div>

        {/* LƯỚI HIỂN THỊ TIN ĐĂNG */}
        {paginatedData.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Không tìm thấy sản phẩm bất động sản phù hợp.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedData.map((item, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg border hover:shadow-2xl transition duration-300">
                <div className="relative h-48 w-full bg-gray-200">
                  <img 
                    src={item.image || 'https://via.placeholder.com/400x300?text=TranHuyLand'} 
                    alt={item.title}
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2.5 py-1 rounded-full font-bold">
                    {item.type || 'BĐS'}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 min-h-[3.5rem]">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 flex items-center">
                    📍 {item.address}
                  </p>
                  <div className="flex justify-between items-center border-t pt-4">
                    <span className="text-red-600 font-extrabold text-xl">
                      {item.priceText || 'Thỏa thuận'}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      🧭 Hướng: {item.direction || 'KXĐ'}
                    </span>
                  </div>
                  <button 
                    onClick={() => window.open(`https://zalo.me/0905555xxx`, '_blank')} // Thay số anh Huy vào đây
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm text-center transition"
                  >
                    Liên hệ ngay qua Zalo
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PHÂN TRANG */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-12">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-4 py-2 bg-white border rounded shadow-sm disabled:opacity-50 text-sm"
            >
              Trước
            </button>
            <span className="text-sm font-medium text-gray-700">Trang {currentPage} / {totalPages}</span>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-4 py-2 bg-white border rounded shadow-sm disabled:opacity-50 text-sm"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
