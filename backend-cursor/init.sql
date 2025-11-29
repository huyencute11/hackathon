-- Initialize database with sample data

USE mysql;

-- Create tables if they don't exist (SQLAlchemy will handle this, but we can add sample data)
INSERT IGNORE INTO regions (id, name, description) VALUES
(1, 'Miền Bắc', 'Các tỉnh phía Bắc Việt Nam'),
(2, 'Miền Trung', 'Các tỉnh miền Trung Việt Nam'),
(3, 'Miền Nam', 'Các tỉnh phía Nam Việt Nam'),
(4, 'Tây Nguyên', 'Các tỉnh Tây Nguyên'),
(5, 'Đồng bằng sông Cửu Long', 'Các tỉnh đồng bằng sông Cửu Long');

INSERT IGNORE INTO products (id, name, description, category) VALUES
(1, 'Gạo', 'Gạo trắng, gạo nếp', 'Thực phẩm'),
(2, 'Mì tôm', 'Mì ăn liền các loại', 'Thực phẩm'),
(3, 'Nước uống', 'Nước đóng chai, nước suối', 'Đồ uống'),
(4, 'Quần áo', 'Quần áo cũ còn sử dụng được', 'Quần áo'),
(5, 'Chăn màn', 'Chăn, màn, gối', 'Đồ dùng'),
(6, 'Thuốc men', 'Thuốc cơ bản, băng gạc', 'Y tế'),
(7, 'Đèn pin', 'Đèn pin, pin dự phòng', 'Đồ dùng'),
(8, 'Bàn chải đánh răng', 'Bàn chải, kem đánh răng', 'Vệ sinh');

INSERT IGNORE INTO donation_locations (id, region_id, name, address, phone, email, opening_hours) VALUES
(1, 1, 'Trung tâm Cứu trợ Hà Nội', '123 Đường Láng, Đống Đa, Hà Nội', '024-1234-5678', 'hanoi@relief.vn', '8:00 - 17:00'),
(2, 1, 'Điểm thu gom Hải Phòng', '456 Đường Lạch Tray, Ngô Quyền, Hải Phòng', '031-2345-6789', 'haiphong@relief.vn', '8:00 - 17:00'),
(3, 2, 'Trung tâm Cứu trợ Đà Nẵng', '789 Đường Trần Phú, Hải Châu, Đà Nẵng', '0236-3456-7890', 'danang@relief.vn', '8:00 - 17:00'),
(4, 2, 'Điểm thu gom Huế', '321 Đường Lê Lợi, Thành phố Huế', '0234-4567-8901', 'hue@relief.vn', '8:00 - 17:00'),
(5, 3, 'Trung tâm Cứu trợ TP.HCM', '654 Đường Nguyễn Huệ, Quận 1, TP.HCM', '028-5678-9012', 'hcm@relief.vn', '8:00 - 18:00'),
(6, 3, 'Điểm thu gom Cần Thơ', '987 Đường Trần Hưng Đạo, Ninh Kiều, Cần Thơ', '0292-6789-0123', 'cantho@relief.vn', '8:00 - 17:00'),
(7, 4, 'Trung tâm Cứu trợ Đắk Lắk', '147 Đường Y Wang, Buôn Ma Thuột', '0262-7890-1234', 'daklak@relief.vn', '8:00 - 17:00'),
(8, 5, 'Điểm thu gom An Giang', '258 Đường Trần Hưng Đạo, Long Xuyên, An Giang', '0296-8901-2345', 'angiang@relief.vn', '8:00 - 17:00');

