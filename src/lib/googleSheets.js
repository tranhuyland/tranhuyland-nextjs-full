export async function getBdsData() {
  const SHEET_URL = "https://docs.google.com/spreadsheets/d/1-LupBV6uNuUitz4vF6pFv6MupuVDMujafqhjQBNNPTA/export?format=csv";
  
  try {
    const response = await fetch(SHEET_URL, {
      next: { revalidate: 60 } // Tự động làm mới dữ liệu sau mỗi 60 giây
    });
    
    if (!response.ok) throw new Error("Không thể fetch dữ liệu Google Sheet");
    
    const text = await response.text();
    const lines = text.split('\n');
    if (lines.length === 0) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().replace(/[\"\']/g, ""));
    const jsonResult = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      
      const currentLine = [];
      let insideQuote = false;
      let entries = "";
      
      for (let j = 0; j < lines[i].length; j++) {
        let char = lines[i][j];
        if (char === '"') {
          insideQuote = !insideQuote;
        } else if (char === ',' && !insideQuote) {
          currentLine.push(entries.trim());
          entries = "";
        } else {
          entries += char;
        }
      }
      currentLine.push(entries.trim());
      
      if (currentLine.length >= headers.length) {
        const obj = {};
        headers.forEach((h, idx) => {
          let val = currentLine[idx] ? currentLine[idx].replace(/[\"\']/g, "") : "";
          if (h === 'id') obj[h] = parseInt(val) || i;
          else if (h === 'soGia') obj[h] = parseFloat(val) || 0;
          else obj[h] = val.replace(/[\r\n]/g, "").trim();
        });
        jsonResult.push(obj);
      }
    }

    // Hàm phụ trợ chuyển chuỗi dd/mm/yyyy thành đối tượng Date để so sánh máy tính
    const parseDate = (dateStr) => {
      if (!dateStr) return new Date(0); // Nếu không có ngày, đẩy về xa nhất
      const parts = dateStr.split(/[-/]/);
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          return new Date(year, month, day);
        }
      }
      return new Date(0);
    };

    // THUẬT TOÁN: Sắp xếp danh sách bất động sản theo ngày đăng mới nhất lên đầu
    jsonResult.sort((a, b) => {
      const dateA = parseDate(a.ngayDang);
      const dateB = parseDate(b.ngayDang);
      return dateB.getTime() - dateA.getTime(); // Sắp xếp giảm dần (mới nhất -> cũ nhất)
    });

    return jsonResult;
  } catch (error) {
    console.error("Lỗi Google Sheet Reader:", error);
    return [];
  }
}
