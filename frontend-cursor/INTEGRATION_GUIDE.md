# Frontend-Backend Integration Guide

Hướng dẫn tích hợp API Backend vào Frontend

## ✅ Đã hoàn thành

1. ✅ API service đã được cấu hình để kết nối với backend
2. ✅ Error handling và interceptors đã được thêm vào
3. ✅ Tất cả components đã sử dụng `apiService` đúng cách
4. ✅ Mock data mode đã được tắt mặc định

## 🚀 Cách sử dụng

### 1. Cấu hình Environment Variables

Tạo file `.env` trong thư mục `frontend-cursor`:

```env
VITE_API_URL=http://localhost:8000
VITE_USE_MOCK_DATA=false
```

**Lưu ý**: 
- Nếu muốn dùng mock data, set `VITE_USE_MOCK_DATA=true`
- Nếu backend chạy ở port khác, thay đổi `VITE_API_URL`

### 2. Đảm bảo Backend đang chạy

```bash
cd backend-cursor
docker-compose up -d
```

Kiểm tra backend:
```bash
curl http://localhost:8000/health
```

### 3. Chạy Frontend

```bash
cd frontend-cursor
npm install  # Nếu chưa install
npm run dev
```

Frontend sẽ chạy tại `http://localhost:5173` (hoặc port khác nếu 5173 đã được dùng)

## 📡 API Endpoints được sử dụng

| Component | API Call | Endpoint |
|-----------|----------|----------|
| `Dashboard` | `getAllRegionsWithSuggestions()` | `GET /api/regions/suggestions` |
| `RegionSelector` | `getRegions()` | `GET /api/regions` |
| `ProductSelector` | `getProducts()` | `GET /api/products` |
| `Dashboard` (Donation) | `submitDonation()` | `POST /api/donations` |
| `RegionDetail` | `getRegionDetail()` | `GET /api/regions/{id}` |
| `RegionDetail` | `getSuggestions()` | `GET /api/regions/{id}/suggestions` |

## 🔍 Debugging

### Kiểm tra kết nối API

Mở Browser DevTools (F12) và xem Console tab. Bạn sẽ thấy:
- `[API] GET /regions` - Request logs
- `[API] Response: 200 /regions` - Response logs
- Error messages nếu có lỗi

### Common Issues

1. **CORS Error**
   - ✅ Đã được cấu hình trong backend
   - Nếu vẫn gặp lỗi, kiểm tra backend CORS settings

2. **Connection Refused**
   - Kiểm tra backend có đang chạy: `docker-compose ps`
   - Kiểm tra port 8000 có bị chiếm: `lsof -i :8000`

3. **404 Not Found**
   - Kiểm tra `VITE_API_URL` trong `.env`
   - Đảm bảo backend đang chạy đúng port

4. **Timeout**
   - API timeout được set là 10 giây
   - Nếu cần tăng, sửa trong `api.ts`: `timeout: 30000`

## 🧪 Testing

### Test từng API endpoint:

```bash
# Test regions
curl http://localhost:8000/api/regions

# Test products
curl http://localhost:8000/api/products

# Test donations
curl -X POST http://localhost:8000/api/donations \
  -H "Content-Type: application/json" \
  -d '{"region_ids": [1], "product_ids": []}'
```

## 📝 Notes

- Frontend sẽ tự động fallback về mock data nếu API không khả dụng (trong development)
- Tất cả API calls đều có error handling
- Console logs giúp debug dễ dàng hơn
- CORS đã được cấu hình để cho phép tất cả origins (development only)

## 🎯 Next Steps

1. Tạo file `.env` với cấu hình phù hợp
2. Đảm bảo backend đang chạy
3. Start frontend và test các chức năng
4. Kiểm tra console logs để đảm bảo API calls thành công

