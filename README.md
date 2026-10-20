# MRS - Thang điểm đánh giá tình trạng Mãn kinh

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

4. **Lịch sử lưu trữ logic & Đa năng (iPad LocalStorage)**:
   - Khi bấm **"Hoàn tất đánh giá"**, phiếu đánh giá sẽ được tự động lưu ngay vào bộ nhớ cục bộ trên iPad.
   - **Nhận diện bệnh nhân thông minh (`patientKey`)**: Phân biệt chuẩn xác giữa "Tổng số ca đánh giá" (lượt khám) và "Số lượng bệnh nhân" (một bệnh nhân có thể đến khám và đánh giá nhiều lần để theo dõi điều trị).
   - Hiển thị huy hiệu số lần khám trực quan: `Lần đánh giá 1/3`, `2/3`...
   - **Tìm kiếm đa tiêu chí thời gian thực**: Tìm kiếm kết hợp theo **Tên bệnh nhân**, **Năm sinh** (4 số) và **Ngày đánh giá**.

5. **Xem từng phiếu dưới dạng PDF**:
   - Trong danh sách lịch sử, mỗi ca đều có nút **"Xem / In PDF"**.
   - Bấm vào sẽ mở giao diện phiếu y tế nguyên bản đầy đủ của bệnh nhân đó với các ô điểm được tô màu trực quan.
   - Nút **"In phiếu này / Lưu PDF (A4)"** cho phép in qua máy in AirPrint hoặc lưu thành file PDF trực tiếp vào ứng dụng Tệp (Files) trên iPad.

6. **Báo cáo & Thống kê theo Tháng / Theo Năm**:
   - Thống kê chi tiết theo: **Toàn bộ thời gian**, **Theo năm**, hoặc **Theo tháng & năm**.
   - Bảng 4 chỉ số KPI chính:
     + **Tổng số ca được đánh giá**
     + **Số bệnh nhân được đánh giá** (Unique Patients)
     + **Tần suất trung bình** (Lượt khám / BN)
     + **Điểm MRS trung bình**
   - Biểu đồ phân bố mức độ (Không/Nhẹ, Trung bình, Nặng) và điểm trung bình 3 nhóm (Tâm lý, TK thực vật, Niệu dục).
   - **Xuất báo cáo Excel (.CSV)**: Tệp CSV chuẩn UTF-8 BOM tiếng Việt, mở trực tiếp trên Excel không bị lỗi font.
   - **In báo cáo thống kê**: In phiếu tổng hợp kết quả y tế A4.

7. **Đồng bộ Đám Mây Đa Thiết Bị Thời Gian Thực (Firebase Realtime Cloud Sync)**:
   - **Tập trung dữ liệu về 1 nơi (Cloud Hub)**: Tất cả phiếu đánh giá từ nhiều iPad tại các phòng khám, điện thoại của điều dưỡng hoặc máy tính của bác sĩ đều được tự động lưu về một cơ sở dữ liệu Firebase Realtime Database duy nhất.
   - **Xem thống kê & Tìm kiếm tập trung**: Dù ca đánh giá được thực hiện ở thiết bị nào, bất kỳ máy nào cũng có thể tìm kiếm lại theo Tên, Năm sinh, Ngày khám và xem báo cáo tổng hợp toàn viện theo Tháng / Năm.
   - **Cơ chế 2 tầng thông minh (Offline-First Hybrid Sync)**: Luôn lưu song song vào bộ nhớ máy (LocalStorage) và Cloud. Hoạt động bình thường ngay cả khi phòng khám rớt mạng, và tự động đồng bộ khi có Internet.
   - **Huy hiệu trạng thái trực quan**: Thanh công cụ hiển thị rõ trạng thái `Cloud Realtime` (Xanh: đã kết nối, Xanh dương: đang đồng bộ, Xám: ngoại tuyến). Có thể bấm vào để xem chi tiết hoặc thay đổi cấu hình.

8. **Sao lưu, Bảo mật & Chuyển đổi dữ liệu**:
   - **Bảo mật quyền quản trị**: Tab **Sao lưu & Đồng bộ** và cài đặt Cloud được bảo vệ bằng mật khẩu quản trị `thanhta92`.
   - Xuất toàn bộ dữ liệu ra file `.json` để sao lưu hoặc chuyển đổi sang thiết bị khác.
   - Nhập file `.json` để khôi phục hoặc bổ sung dữ liệu khi cần thiết.

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
