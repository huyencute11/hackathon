-- Seed data for Relief Coordination System
USE `3wolf`;

-- Tags (Nhu cầu)
INSERT INTO tags (id, name, category) VALUES
(1, 'Nước sạch', 'Thiết yếu'),
(2, 'Thực phẩm', 'Thiết yếu'),
(3, 'Thuốc men', 'Y tế'),
(4, 'Đèn pin', 'Tiện ích'),
(5, 'Pin', 'Tiện ích'),
(6, 'Quần áo', 'Thiết yếu'),
(7, 'Chỗ ở', 'Khẩn cấp'),
(8, 'Vật dụng y tế', 'Y tế'),
(9, 'Chăn màn', 'Thiết yếu');

-- Items (Sản phẩm cụ thể)
INSERT INTO items (id, name, description, category) VALUES
(1, 'Nước đóng chai 500ml', 'Nước uống đóng chai', 'water'),
(2, 'Nước sạch 20L', 'Thùng nước lớn', 'water'),
(3, 'Gạo', 'Gạo trắng', 'food'),
(4, 'Mì tôm', 'Mì ăn liền', 'food'),
(5, 'Thuốc giảm đau', 'Paracetamol 500mg', 'medicine'),
(6, 'Thuốc kháng sinh', 'Kháng sinh phổ rộng', 'medicine'),
(7, 'Băng gạc', 'Băng gạc y tế', 'medical_supplies'),
(8, 'Lều bạt', 'Lều dã ngoại', 'shelter'),
(9, 'Áo khoác', 'Áo giữ nhiệt', 'clothing'),
(10, 'Chăn', 'Chăn ấm', 'bedding');

-- Region Tags (Nhu cầu của từng khu vực)
INSERT IGNORE INTO region_tags (region_id, tag_id) VALUES
-- Miền Bắc
(1, 1), (1, 2), (1, 4),
-- Miền Trung  
(2, 1), (2, 2), (2, 7), (2, 8),
-- Miền Nam
(3, 2), (3, 3), (3, 1),
-- Tây Nguyên
(4, 2), (4, 6), (4, 9),
-- Đồng bằng sông Cửu Long
(5, 1), (5, 2), (5, 3), (5, 8);

-- Region Items (Sản phẩm ưu tiên cho từng khu vực với priority score)
INSERT IGNORE INTO region_items (region_id, item_id, priority_score) VALUES
-- Miền Bắc (Bắc Giang example)
(1, 1, 0.95),  -- Nước đóng chai 95%
(1, 2, 0.90),  -- Nước sạch 20L 90%
(1, 3, 0.85),  -- Gạo 85%
(1, 4, 0.80),  -- Mì tôm 80%
(1, 5, 0.70),  -- Thuốc giảm đau 70%
-- Miền Trung (Quảng Nam example)
(2, 8, 0.92),  -- Lều bạt 92%
(2, 2, 0.88),  -- Nước sạch 88%
(2, 6, 0.85),  -- Thuốc kháng sinh 85%
(2, 7, 0.80),  -- Băng gạc 80%
-- Miền Nam (Đồng Tháp example) 
(3, 2, 0.93),  -- Nước sạch 20L 93%
(3, 5, 0.87),  -- Thuốc giảm đau 87%
(3, 6, 0.82),  -- Thuốc kháng sinh 82%
-- Tây Nguyên
(4, 3, 0.90),  -- Gạo 90%
(4, 9, 0.85),  -- Áo khoác 85%
(4, 10, 0.80), -- Chăn 80%
-- Đồng bằng sông Cửu Long
(5, 1, 0.91),  -- Nước đóng chai 91%
(5, 2, 0.88),  -- Nước sạch 88%
(5, 3, 0.83);  -- Gạo 83%

-- Providers (Nhà cung cấp/Kho cứu trợ)
INSERT IGNORE INTO providers (id, name, location, capacity) VALUES
(1, 'Kho cứu trợ Hà Nội', 'Hà Nội', 10000),
(2, 'Kho cứu trợ TP.HCM', 'TP. Hồ Chí Minh', 15000),
(3, 'Kho cứu trợ Đà Nẵng', 'Đà Nẵng', 8000),
(4, 'Kho cứu trợ Cần Thơ', 'Cần Thơ', 6000),
(5, 'Kho cứu trợ Hải Phòng', 'Hải Phòng', 7000);

-- Provider Regions (Mapping providers với regions)
INSERT IGNORE INTO provider_regions (provider_id, region_id, distance, shipping_estimate) VALUES
-- Kho Hà Nội hỗ trợ Miền Bắc
(1, 1, 50, '2-3 giờ'),
-- Kho HCM hỗ trợ Miền Bắc (xa hơn)
(2, 1, 1200, '1-2 ngày'),
-- Kho Đà Nẵng hỗ trợ Miền Trung
(3, 2, 100, '3-4 giờ'),
-- Kho HCM hỗ trợ Miền Nam
(2, 3, 150, '4-5 giờ'),
-- Kho Cần Thơ hỗ trợ Đồng bằng sông Cửu Long
(4, 5, 80, '2-3 giờ'),
-- Kho Hà Nội hỗ trợ Tây Nguyên
(1, 4, 300, '6-8 giờ'),
-- Kho Đà Nẵng hỗ trợ Tây Nguyên
(3, 4, 200, '4-5 giờ'),
-- Kho Hải Phòng hỗ trợ Miền Bắc
(5, 1, 120, '3-4 giờ');
