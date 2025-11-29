# Relief Coordination Backend API

FastAPI backend với MySQL connection cho hệ thống cứu trợ.

## Cấu trúc

- `main.py` - FastAPI application với các endpoints
- `database.py` - Database models và connection
- `models.py` - Pydantic models cho request/response
- `requirements.txt` - Python dependencies
- `Dockerfile` - Docker image cho FastAPI
- `docker-compose.yml` - Docker Compose với MySQL và FastAPI
- `init.sql` - Sample data cho database

## API Endpoints

### 1. GET /api/regions
Lấy danh sách tất cả các khu vực.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Miền Bắc",
    "description": "Các tỉnh phía Bắc Việt Nam"
  }
]
```

### 2. GET /api/products
Lấy danh sách tất cả các sản phẩm.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Gạo",
    "description": "Gạo trắng, gạo nếp",
    "category": "Thực phẩm"
  }
]
```

### 3. POST /api/donation-locations
Lấy danh sách địa điểm quyên góp dựa trên khu vực và sản phẩm đã chọn.

**Request:**
```json
{
  "region_ids": [1, 2],
  "product_ids": [1, 3]
}
```

**Response:**
```json
{
  "locations": [
    {
      "id": 1,
      "region_id": 1,
      "name": "Trung tâm Cứu trợ Hà Nội",
      "address": "123 Đường Láng, Đống Đa, Hà Nội",
      "phone": "024-1234-5678",
      "email": "hanoi@relief.vn",
      "opening_hours": "8:00 - 17:00"
    }
  ]
}
```

**Lưu ý:** `region_ids` và `product_ids` có thể là mảng rỗng `[]`. Nếu rỗng, API sẽ trả về tất cả địa điểm quyên góp.

## Cách chạy

### Sử dụng Docker Compose (Khuyến nghị)

```bash
cd backend-cursor
docker-compose up -d
```

Backend sẽ chạy tại: `http://localhost:8000`
MySQL sẽ chạy tại: `localhost:3306`

### Chạy thủ công

1. Cài đặt dependencies:
```bash
pip install -r requirements.txt
```

2. Đảm bảo MySQL đang chạy và cấu hình trong `.env`:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=cursor
DB_PASSWORD=password
DB_NAME=mysql
```

3. Chạy FastAPI:
```bash
uvicorn main:app --reload
```

## Database Schema

### Tables

- **regions**: Khu vực cứu trợ
- **products**: Sản phẩm quyên góp
- **donation_locations**: Địa điểm nhận quyên góp

## API Documentation

Sau khi chạy server, truy cập:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

