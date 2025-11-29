# 🚀 Deployment Guide - Relief Coordination System

Hướng dẫn triển khai đầy đủ hệ thống Frontend + Backend

## 📋 Tổng quan

- **Backend**: FastAPI + MySQL (Docker)
- **Frontend**: React + TypeScript + Vite
- **Database**: MySQL 8.0 trong Docker
- **Database name**: `3wolf`

---

## 🔧 Backend Setup

### 1. Khởi chạy Backend

```bash
cd backend-cursor
docker-compose up -d
```

**Kiểm tra status:**
```bash
docker-compose ps
```

Bạn sẽ thấy:
- `mysql-db` - healthy
- `fastapi-backend` - running

### 2. Kiểm tra API

```bash
# Health check
curl http://localhost:8000/health

# Test regions endpoint
curl http://localhost:8000/api/regions
```

**API Endpoints:**
- `http://localhost:8000/docs` - Swagger UI
- `http://localhost:8000/health` - Health check

---

## 💻 Frontend Setup

### 1. Tạo file .env

```bash
cd frontend-cursor
echo "VITE_API_URL=http://localhost:8000" > .env
echo "VITE_USE_MOCK_DATA=false" >> .env
```

### 2. Install dependencies (nếu chưa)

```bash
npm install
```

### 3. Chạy Frontend

```bash
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

---

## 📊 Database Schema

### Tables Created:

1. **regions** - Khu vực (5 rows)
   - Miền Bắc, Miền Trung, Miền Nam, Tây Nguyên, Đồng bằng sông Cửu Long

2. **tags** - Tags/Nhu cầu (8 rows)
   - Nước sạch, Thực phẩm, Thuốc men, Đèn pin, Vật dụng y tế, Quần áo, Chỗ ở, Chăn màn

3. **items** - Sản phẩm cụ thể (10 rows)
   - Nước đóng chai, Gạo, Mì tôm, Thuốc, Chăn, etc.

4. **products** - Sản phẩm quyên góp (8 rows)
   - Danh sách sản phẩm có thể quyên góp

5. **region_tags** - Mapping region ↔ tags
6. **region_items** - Mapping region ↔ items (với priority_score)
7. **providers** - Nhà cung cấp/Kho (5 rows)
8. **provider_regions** - Mapping provider ↔ region (với distance, shipping_estimate)
9. **donation_locations** - Địa điểm nhận quyên góp (8 rows)

---

## 🧪 Testing

### Test API từ curl:

```bash
# Get all regions with suggestions
curl http://localhost:8000/api/regions/suggestions | python3 -m json.tool

# Get specific region detail
curl http://localhost:8000/api/regions/1 | python3 -m json.tool

# Get products
curl http://localhost:8000/api/products | python3 -m json.tool

# Submit donation request
curl -X POST http://localhost:8000/api/donations \
  -H "Content-Type: application/json" \
  -d '{"region_ids": [1, 2], "product_ids": [1, 3]}' | python3 -m json.tool
```

### Test Frontend:

1. Mở `http://localhost:5173`
2. Dashboard sẽ hiển thị 5 khu vực với:
   - Tags (Nhu cầu)
   - Items ưu tiên với % priority
   - Số lượng providers

3. Click vào "Chi tiết" một khu vực sẽ thấy:
   - Gợi ý sản phẩm ưu tiên (AI/ML)
   - Nhà cung cấp được đề xuất với khoảng cách và thời gian vận chuyển

4. Test 3 nút trên navbar:
   - "Chọn khu vực" - Modal chọn regions
   - "Chọn sản phẩm" - Modal chọn products
   - "Tôi muốn quyên góp" - Hiển thị địa điểm quyên góp

---

## 🎯 Features Implemented

### Backend APIs:
- ✅ `GET /api/regions` - Danh sách khu vực
- ✅ `GET /api/regions/{id}` - Chi tiết khu vực với tags, items, providers
- ✅ `GET /api/regions/{id}/suggestions` - Gợi ý cho khu vực
- ✅ `GET /api/regions/suggestions` - Tất cả khu vực với suggestions
- ✅ `GET /api/products` - Danh sách sản phẩm
- ✅ `POST /api/donations` - Tìm địa điểm quyên góp

### Data Models:
- ✅ Regions với tags (nhu cầu)
- ✅ Items với priority scores (sản phẩm ưu tiên)
- ✅ Providers với distance & shipping estimate (nhà cung cấp)
- ✅ Donation locations (điểm tiếp nhận)

### UI Features:
- ✅ Dashboard hiển thị regions với tags và priority items
- ✅ Region detail page với suggestions
- ✅ 3 nút: Chọn khu vực, Chọn sản phẩm, Tôi muốn quyên góp
- ✅ Modals cho chọn regions và products
- ✅ Hiển thị donation locations

---

## 📝 Sample Data Summary

| Table | Count | Description |
|-------|-------|-------------|
| regions | 5 | 5 khu vực chính |
| tags | 8 | Tags nhu cầu |
| items | 10 | Sản phẩm cụ thể |
| products | 8 | Sản phẩm quyên góp |
| region_tags | 18 | Nhu cầu của từng khu vực |
| region_items | 18 | Priority items cho từng khu vực |
| providers | 5 | Kho cứu trợ |
| provider_regions | 8 | Kho hỗ trợ khu vực nào |
| donation_locations | 8 | Điểm tiếp nhận quyên góp |

---

## 🔗 URLs

- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Frontend**: http://localhost:5173
- **MySQL**: localhost:3306 (user: cursor, password: password, db: 3wolf)

---

## 💡 Tips

- Nếu thay đổi database, restart backend: `docker-compose restart api`
- Nếu thay đổi .env frontend, restart dev server (Ctrl+C rồi npm run dev lại)
- Xem logs backend: `docker-compose logs -f api`
- Xem logs MySQL: `docker-compose logs -f mysql`

---

## ✅ Done!

Hệ thống đã sẵn sàng với đầy đủ tính năng theo UI mockup! 🎉

