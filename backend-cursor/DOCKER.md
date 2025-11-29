# Docker Setup Guide

## Cấu trúc Services

Docker Compose bao gồm 3 services:

1. **mysql** - MySQL Database (port 3306)
2. **api** - FastAPI Backend (port 8000)
3. **frontend** - React Frontend với Nginx (port 3000)

## Cách chạy

### Cách 1: Sử dụng script (Khuyến nghị)

```bash
cd backend-cursor
./start.sh
```

Script này sẽ:
- Kiểm tra Docker và docker-compose
- Build và start tất cả services
- Hiển thị status và URLs

### Cách 2: Chạy thủ công

#### 1. Build và chạy tất cả services

```bash
cd backend-cursor
docker-compose up --build
```

#### 2. Chạy ở background

```bash
docker-compose up -d --build
```

#### 3. Dừng services

```bash
./stop.sh
# hoặc
docker-compose down
```

### 3. Xem logs

```bash
# Tất cả services
docker-compose logs -f

# Chỉ frontend
docker-compose logs -f frontend

# Chỉ backend
docker-compose logs -f api
```

### 4. Dừng services

```bash
docker-compose down
```

### 5. Dừng và xóa volumes

```bash
docker-compose down -v
```

## Truy cập ứng dụng

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **MySQL**: localhost:3306

## Kiến trúc

```
Browser (localhost:3000)
    ↓
Nginx (Frontend Container)
    ↓ /api requests
FastAPI Backend (localhost:8000)
    ↓
MySQL Database
```

## Environment Variables

### Frontend
- Tự động sử dụng relative path `/api` trong production
- Nginx sẽ proxy `/api` tới backend service

### Backend
- `DB_HOST`: mysql
- `DB_PORT`: 3306
- `DB_USER`: cursor
- `DB_PASSWORD`: password
- `DB_NAME`: 3wolf

## Troubleshooting

### Frontend không kết nối được với backend
- Kiểm tra nginx logs: `docker-compose logs frontend`
- Kiểm tra backend đã chạy: `docker-compose ps`
- Kiểm tra network: `docker network ls`

### Rebuild frontend sau khi thay đổi code
```bash
docker-compose build frontend
docker-compose up -d frontend
```

### Xóa và rebuild tất cả
```bash
docker-compose down -v
docker-compose up --build
```

