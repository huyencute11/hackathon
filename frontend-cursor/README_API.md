# 🚀 Quick Start - API Integration

## Bước 1: Tạo file .env

Tạo file `.env` trong thư mục `frontend-cursor`:

```bash
cd frontend-cursor
cat > .env << EOF
VITE_API_URL=http://localhost:8000
VITE_USE_MOCK_DATA=false
EOF
```

## Bước 2: Đảm bảo Backend đang chạy

```bash
cd ../backend-cursor
docker-compose ps  # Kiểm tra status
# Nếu chưa chạy:
docker-compose up -d
```

## Bước 3: Chạy Frontend

```bash
cd ../frontend-cursor
npm run dev
```

## ✅ Kiểm tra

1. Mở browser tại `http://localhost:5173`
2. Mở DevTools (F12) → Console tab
3. Bạn sẽ thấy logs như:
   ```
   [API] GET /regions
   [API] Response: 200 /regions
   ```

## 🔧 Troubleshooting

### Backend không kết nối được?

```bash
# Test backend
curl http://localhost:8000/health
curl http://localhost:8000/api/regions
```

### Frontend vẫn dùng mock data?

- Kiểm tra file `.env` có đúng không
- Đảm bảo `VITE_USE_MOCK_DATA=false`
- Restart dev server sau khi sửa `.env`

### CORS Error?

- Backend đã cấu hình CORS cho phép tất cả origins
- Nếu vẫn lỗi, kiểm tra backend logs: `docker-compose logs api`

## 📝 Notes

- API timeout: 10 giây
- Tất cả errors được log ra console
- Mock data mode có thể bật/tắt bằng env variable

