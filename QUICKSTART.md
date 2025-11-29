# 🚀 Quick Start Guide - Relief Coordination System

Hướng dẫn nhanh để chạy toàn bộ hệ thống với Docker Compose.

## 📋 Yêu cầu

- Docker Desktop (hoặc Docker Engine + Docker Compose)
- 4GB RAM trở lên
- Ports 3000, 8000, 3306 phải trống

## 🎯 Cách chạy nhanh nhất

### Bước 1: Di chuyển vào thư mục backend

```bash
cd backend-cursor
```

### Bước 2: Chạy script start

```bash
./start.sh
```

Hoặc nếu không có quyền execute:

```bash
bash start.sh
```

### Bước 3: Truy cập ứng dụng

Sau khi các services đã khởi động (khoảng 30-60 giây):

- 🌐 **Frontend**: http://localhost:3000
- 🔧 **Backend API**: http://localhost:8000
- 📚 **API Documentation**: http://localhost:8000/docs
- 🗄️ **MySQL**: localhost:3306

## 📝 Các lệnh hữu ích

### Xem logs

```bash
# Tất cả services
docker-compose logs -f

# Chỉ frontend
docker-compose logs -f frontend

# Chỉ backend
docker-compose logs -f api

# Chỉ database
docker-compose logs -f mysql
```

### Kiểm tra status

```bash
docker-compose ps
```

### Dừng services

```bash
./stop.sh
# hoặc
docker-compose down
```

### Dừng và xóa tất cả (bao gồm data)

```bash
docker-compose down -v
```

### Rebuild sau khi thay đổi code

```bash
# Rebuild tất cả
docker-compose up --build -d

# Chỉ rebuild frontend
docker-compose build frontend
docker-compose up -d frontend

# Chỉ rebuild backend
docker-compose build api
docker-compose up -d api
```

## 🏗️ Kiến trúc hệ thống

```
┌─────────────┐
│   Browser   │
│ localhost:  │
│    3000     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Nginx     │  Frontend Container
│  (React)    │
└──────┬──────┘
       │ /api
       ▼
┌─────────────┐
│   FastAPI   │  Backend Container
│  (Python)   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   MySQL     │  Database Container
│   (8.0)     │
└─────────────┘
```

## 🔧 Troubleshooting

### Lỗi: Port đã được sử dụng

```bash
# Kiểm tra port nào đang được sử dụng
lsof -i :3000
lsof -i :8000
lsof -i :3306

# Hoặc thay đổi port trong docker-compose.yml
```

### Lỗi: Frontend không kết nối được backend

1. Kiểm tra backend đã chạy:
   ```bash
   docker-compose ps
   curl http://localhost:8000/docs
   ```

2. Kiểm tra nginx logs:
   ```bash
   docker-compose logs frontend
   ```

3. Kiểm tra network:
   ```bash
   docker network ls
   docker network inspect backend-cursor_backend-network
   ```

### Lỗi: Database connection failed

1. Kiểm tra MySQL đã sẵn sàng:
   ```bash
   docker-compose logs mysql
   ```

2. Đợi MySQL khởi động hoàn toàn (có thể mất 30-60 giây)

3. Kiểm tra healthcheck:
   ```bash
   docker-compose ps mysql
   ```

### Rebuild từ đầu

```bash
# Dừng và xóa tất cả
docker-compose down -v

# Xóa images cũ (optional)
docker-compose rm -f
docker rmi $(docker images -q)

# Build lại
docker-compose up --build
```

## 📦 Services trong Docker Compose

| Service | Container Name | Port | Description |
|---------|---------------|------|-------------|
| mysql | mysql-db | 3306 | MySQL Database |
| api | fastapi-backend | 8000 | FastAPI Backend |
| frontend | react-frontend | 3000 | React Frontend (Nginx) |

## 🔐 Credentials

### MySQL
- User: `cursor`
- Password: `password`
- Database: `3wolf`

### API
- Base URL: `http://localhost:8000`
- Docs: `http://localhost:8000/docs`

## 📚 Tài liệu thêm

- [DOCKER.md](./backend-cursor/DOCKER.md) - Chi tiết về Docker setup
- [README.md](./README.md) - Tổng quan về dự án
- [Frontend README](./frontend-cursor/README.md) - Frontend documentation
- [Backend README](./backend-cursor/README.md) - Backend documentation

## ✅ Checklist sau khi chạy

- [ ] MySQL container đang chạy
- [ ] Backend API container đang chạy
- [ ] Frontend container đang chạy
- [ ] Có thể truy cập http://localhost:3000
- [ ] Có thể truy cập http://localhost:8000/docs
- [ ] Frontend có thể gọi API thành công

## 🆘 Cần giúp đỡ?

Nếu gặp vấn đề, hãy:
1. Kiểm tra logs: `docker-compose logs -f`
2. Kiểm tra status: `docker-compose ps`
3. Xem [Troubleshooting](#-troubleshooting) section ở trên

