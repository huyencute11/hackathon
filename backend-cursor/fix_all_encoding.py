#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import pymysql
import sys

# Database configuration
DB_CONFIG = {
    'host': 'mysql',
    'port': 3306,
    'user': 'cursor',
    'password': 'password',
    'database': '3wolf',
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor
}

def fix_all_data():
    connection = pymysql.connect(**DB_CONFIG)
    try:
        with connection.cursor() as cursor:
            print("🔄 Bắt đầu sửa encoding cho tất cả tables...")
            print()
            
            # Delete all data in correct order (children first)
            print("🗑️  Xóa dữ liệu cũ (theo thứ tự foreign key)...")
            cursor.execute("DELETE FROM provider_regions")
            cursor.execute("DELETE FROM region_items")
            cursor.execute("DELETE FROM region_tags")
            cursor.execute("DELETE FROM donation_locations")
            cursor.execute("DELETE FROM providers")
            cursor.execute("DELETE FROM items")
            cursor.execute("DELETE FROM tags")
            cursor.execute("DELETE FROM products")
            cursor.execute("DELETE FROM regions")
            print("   ✅ Đã xóa tất cả dữ liệu cũ")
            print()
            
            # 1. Fix REGIONS
            print("1️⃣ Fixing REGIONS...")
            regions_data = [
                (1, 'Miền Bắc', 'Các tỉnh phía Bắc Việt Nam'),
                (2, 'Miền Trung', 'Các tỉnh miền Trung Việt Nam'),
                (3, 'Miền Nam', 'Các tỉnh phía Nam Việt Nam'),
                (4, 'Tây Nguyên', 'Các tỉnh Tây Nguyên'),
                (5, 'Đồng bằng sông Cửu Long', 'Các tỉnh đồng bằng sông Cửu Long'),
            ]
            cursor.executemany(
                "INSERT INTO regions (id, name, description) VALUES (%s, %s, %s)",
                regions_data
            )
            print(f"   ✅ Inserted {len(regions_data)} regions")
            
            # 2. Fix PRODUCTS
            print("2️⃣ Fixing PRODUCTS...")
            products_data = [
                (1, 'Gạo', 'Thực phẩm', 'Gạo trắng'),
                (2, 'Mì tôm', 'Thực phẩm', 'Mì ăn liền'),
                (3, 'Nước uống', 'Đồ uống', 'Nước đóng chai'),
                (4, 'Quần áo', 'Quần áo', 'Quần áo cũ'),
                (5, 'Chăn màn', 'Đồ dùng', 'Chăn ấm, màn'),
                (6, 'Thuốc men', 'Y tế', 'Thuốc cơ bản'),
                (7, 'Đèn pin', 'Đồ dùng', 'Đèn pin, pin'),
                (8, 'Bàn chải đánh răng', 'Vệ sinh', 'Đồ vệ sinh cá nhân'),
            ]
            cursor.executemany(
                "INSERT INTO products (id, name, category, description) VALUES (%s, %s, %s, %s)",
                products_data
            )
            print(f"   ✅ Inserted {len(products_data)} products")
            
            # 3. Fix DONATION_LOCATIONS
            print("3️⃣ Fixing DONATION_LOCATIONS...")
            donation_locations_data = [
                (1, 'Trung tâm Cứu trợ Hà Nội', '123 Đường Láng, Đống Đa, Hà Nội', '024-1234-5678', 1),
                (2, 'Điểm thu gom Hải Phòng', '456 Đường Lạch Tray, Ngô Quyền, Hải Phòng', '0225-234-5678', 1),
                (3, 'Trung tâm Cứu trợ Đà Nẵng', '789 Đường Trần Phú, Hải Châu, Đà Nẵng', '0236-345-6789', 2),
                (4, 'Điểm thu gom Quảng Nam', '321 Đường Hùng Vương, Tam Kỳ, Quảng Nam', '0235-456-7890', 2),
                (5, 'Trung tâm Cứu trợ TP.HCM', '654 Đường Nguyễn Huệ, Quận 1, TP.HCM', '028-567-8901', 3),
                (6, 'Điểm thu gom Bình Dương', '987 Đường Phạm Văn Đồng, Thủ Dầu Một, Bình Dương', '0274-678-9012', 3),
                (7, 'Trung tâm Cứu trợ Pleiku', '147 Đường Hùng Vương, Pleiku, Gia Lai', '0269-789-0123', 4),
                (8, 'Trung tâm Cứu trợ Cần Thơ', '258 Đường 30/4, Ninh Kiều, Cần Thơ', '0292-890-1234', 5),
            ]
            cursor.executemany(
                "INSERT INTO donation_locations (id, name, address, phone, region_id) VALUES (%s, %s, %s, %s, %s)",
                donation_locations_data
            )
            print(f"   ✅ Inserted {len(donation_locations_data)} donation_locations")
            
            # 4. Fix TAGS
            print("4️⃣ Fixing TAGS...")
            tags_data = [
                (1, 'Nước sạch', 'Thiết yếu'),
                (2, 'Thực phẩm', 'Thiết yếu'),
                (3, 'Thuốc men', 'Y tế'),
                (4, 'Đèn pin', 'Tiện ích'),
                (5, 'Vật dụng y tế', 'Y tế'),
                (6, 'Quần áo', 'Thiết yếu'),
                (7, 'Chỗ ở', 'Khẩn cấp'),
                (8, 'Chăn màn', 'Thiết yếu'),
            ]
            cursor.executemany(
                "INSERT INTO tags (id, name, category) VALUES (%s, %s, %s)",
                tags_data
            )
            print(f"   ✅ Inserted {len(tags_data)} tags")
            
            # 5. Fix ITEMS
            print("5️⃣ Fixing ITEMS...")
            items_data = [
                (1, 'Nước đóng chai 500ml', 'Nước uống đóng chai', 'water'),
                (2, 'Nước sạch 20L', 'Thùng nước lớn', 'water'),
                (3, 'Gạo', 'Gạo trắng', 'food'),
                (4, 'Mì tôm', 'Mì ăn liền', 'food'),
                (5, 'Thuốc giảm đau', 'Paracetamol 500mg', 'medicine'),
                (6, 'Thuốc kháng sinh', 'Kháng sinh phổ rộng', 'medicine'),
                (7, 'Băng gạc', 'Băng gạc y tế', 'medical_supplies'),
                (8, 'Lều bạt', 'Lều dã ngoại', 'shelter'),
                (9, 'Áo khoác', 'Áo giữ nhiệt', 'clothing'),
                (10, 'Chăn', 'Chăn ấm', 'bedding'),
            ]
            cursor.executemany(
                "INSERT INTO items (id, name, description, category) VALUES (%s, %s, %s, %s)",
                items_data
            )
            print(f"   ✅ Inserted {len(items_data)} items")
            
            # 6. Fix PROVIDERS
            print("6️⃣ Fixing PROVIDERS...")
            providers_data = [
                (1, 'Kho cứu trợ Hà Nội', 'Hà Nội', 10000),
                (2, 'Kho cứu trợ TP.HCM', 'TP. Hồ Chí Minh', 15000),
                (3, 'Kho cứu trợ Đà Nẵng', 'Đà Nẵng', 8000),
                (4, 'Kho cứu trợ Cần Thơ', 'Cần Thơ', 5000),
            ]
            cursor.executemany(
                "INSERT INTO providers (id, name, location, capacity) VALUES (%s, %s, %s, %s)",
                providers_data
            )
            print(f"   ✅ Inserted {len(providers_data)} providers")
            
            # 7. Re-insert relationship data
            print("7️⃣ Inserting relationship data...")
            
            # Region Tags
            region_tags_data = [
                (1, 1), (1, 2), (1, 4),
                (2, 1), (2, 2), (2, 5), (2, 7),
                (3, 1), (3, 2), (3, 3),
                (4, 2), (4, 6), (4, 8),
                (5, 1), (5, 2), (5, 3), (5, 5),
            ]
            cursor.executemany(
                "INSERT INTO region_tags (region_id, tag_id) VALUES (%s, %s)",
                region_tags_data
            )
            print(f"   ✅ Inserted {len(region_tags_data)} region_tags")
            
            # Region Items
            region_items_data = [
                (1, 1, 0.95), (1, 2, 0.90), (1, 3, 0.85), (1, 4, 0.80), (1, 5, 0.70),
                (2, 8, 0.92), (2, 2, 0.88), (2, 6, 0.85), (2, 7, 0.80),
                (3, 2, 0.93), (3, 5, 0.87), (3, 6, 0.82),
                (4, 3, 0.91), (4, 9, 0.85), (4, 10, 0.80),
                (5, 1, 0.91), (5, 2, 0.88), (5, 3, 0.83),
            ]
            cursor.executemany(
                "INSERT INTO region_items (region_id, item_id, priority_score) VALUES (%s, %s, %s)",
                region_items_data
            )
            print(f"   ✅ Inserted {len(region_items_data)} region_items")
            
            # Provider Regions
            provider_regions_data = [
                (1, 1, 0.0, '1-2 ngày'),
                (1, 2, 150.0, '3-5 ngày'),
                (2, 3, 120.0, '2-3 ngày'),
                (2, 5, 0.0, '1-2 ngày'),
                (3, 2, 100.0, '2-4 ngày'),
                (4, 5, 50.0, '1-2 ngày'),
            ]
            cursor.executemany(
                "INSERT INTO provider_regions (provider_id, region_id, distance, shipping_estimate) VALUES (%s, %s, %s, %s)",
                provider_regions_data
            )
            print(f"   ✅ Inserted {len(provider_regions_data)} provider_regions")
            
        connection.commit()
        print()
        print("✅ ĐÃ SỬA XONG TẤT CẢ ENCODING!")
        print()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        connection.rollback()
    finally:
        connection.close()

if __name__ == '__main__':
    fix_all_data()

