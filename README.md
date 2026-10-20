# Bảng Đánh Giá Tình Trạng Mãn Kinh - MRS (Menopause Rating Scale)

Ứng dụng web đánh giá tình trạng mãn kinh chuẩn y khoa MRS (Menopause Rating Scale), thiết kế chuyên nghiệp theo biểu mẫu y tế, hoạt động mượt mà trên iPad, máy tính bảng và máy tính để bàn.

---

## 🌟 Tính Năng Nổi Bật

1. **Giao diện chuẩn y tế (Medical Teal Design)**:
   - Màu sắc chủ đạo: Xanh ngọc / Teal y tế, phối viền cam san hô trang nhã.
   - Thanh thang điểm 5 mức độ trực quan với biểu tượng cảm xúc (0: Hoàn toàn không, 1: Nhẹ, 2: Trung bình, 3: Nặng, 4: Rất nặng).
   - Nút chọn to, rõ, bo tròn mềm mại, tối ưu cho thao tác chạm (touch) trên iPad.

2. **Cấu trúc 11 câu hỏi chuẩn 3 nhóm MRS**:
   - **Nhóm 1 - Triệu chứng tâm lý (MRS1)**: 4 triệu chứng.
   - **Nhóm 2 - Rối loạn thần kinh thực vật (MRS2)**: 4 triệu chứng.
   - **Nhóm 3 - Triệu chứng niệu dục (MRS3)**: 3 triệu chứng.

3. **Tính điểm tự động thời gian thực (Real-time Calculation)**:
   - Tự động cộng dồn điểm MRS1, MRS2, MRS3 và Tổng số điểm MRS hiển thị ngay trong ô điểm, tinh gọn đúng chuẩn biểu mẫu.

4. **Lưu trữ lịch sử cục bộ trên iPad (LocalStorage)**:
   - Khi bấm **"Hoàn tất đánh giá"**, phiếu đánh giá sẽ được tự động lưu ngay vào bộ nhớ cục bộ trên iPad.
   - Không cần server, không lo rò rỉ thông tin bệnh nhân.
   - Lưu trữ danh sách bệnh nhân, ngày khám, chi tiết điểm số từng câu hỏi.
   - Xem lại, tìm kiếm theo tên hoặc ngày, mở lại phiếu cũ và xuất file `.json` sao lưu.

5. **In phiếu & Xuất PDF chuyên dụng**:
   - Tích hợp sẵn nút "In phiếu / PDF".
   - Tối ưu hóa `@media print` cho khổ giấy A4 dọc, tự động ẩn các nút công cụ, giữ lại bản in sạch đẹp chuẩn y khoa.

---

## 🚀 Hướng Dẫn Cài Đặt Lên GitHub Pages Và Cài Vào iPad

### Bước 1: Đẩy mã nguồn lên GitHub
1. Mở terminal tại thư mục dự án và chạy các lệnh:
   ```bash
   git init
   git add .
   git commit -m "Khoi tao ung dung MRS Menopause Rating Scale"
   git branch -M main
   git remote add origin https://github.com/<tai-khoan-cua-ban>/<ten-repo>.git
   git push -u origin main
   ```

### Bước 2: Kích hoạt GitHub Pages để lấy link online
1. Vào repository trên GitHub > bấm vào tab **Settings**.
2. Chọn mục **Pages** ở thanh menu bên trái.
3. Ở phần **Build and deployment** > **Source**: chọn `Deploy from a branch`.
4. Branch: chọn `main` và thư mục `/ (root)`, sau đó bấm **Save**.
5. Sau 1-2 phút, GitHub sẽ cung cấp cho bạn một đường link online (ví dụ: `https://<ten-user>.github.io/<ten-repo>/`).

### Bước 3: Cài đặt và sử dụng trên iPad như ứng dụng độc lập
1. Mở trình duyệt **Safari** trên iPad và truy cập link GitHub Pages vừa tạo.
2. Bấm vào nút **Chia sẻ** (biểu tượng hình vuông có mũi tên chỉ lên ở góc trên bên phải Safari).
3. Cuộn xuống và chọn **"Thêm vào Màn hình chính" (Add to Home Screen)**.
4. Đặt tên (ví dụ: "MRS Mãn Kinh") rồi bấm **Thêm (Add)**.
5. Biểu tượng ứng dụng sẽ xuất hiện ngay trên màn hình iPad của bạn. Khi mở ra, ứng dụng sẽ chạy toàn màn hình (không có thanh địa chỉ duyệt web) và **dữ liệu lưu trữ hoàn toàn cục bộ trên iPad**, hoạt động ngay cả khi không có mạng Internet.
