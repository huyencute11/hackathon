# MySQL Access Commands

## Kết nối vào MySQL container với quyền root

```bash
# Nếu container đang chạy
docker exec -it mysql-db mysql -uroot -ppassword

# Hoặc từ bên ngoài (nếu đã expose port)
mysql -h 127.0.0.1 -P 3306 -uroot -ppassword
```

## Cấp quyền cho user cursor

Sau khi kết nối vào MySQL, chạy các lệnh sau:

```sql
-- Cấp tất cả quyền cho user cursor trên database mysql
GRANT ALL PRIVILEGES ON mysql.* TO 'cursor'@'%';
FLUSH PRIVILEGES;

-- Hoặc cấp quyền trên tất cả databases
GRANT ALL PRIVILEGES ON *.* TO 'cursor'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

## Tạo database mới (nếu cần)

```sql
CREATE DATABASE IF NOT EXISTS relief_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON relief_db.* TO 'cursor'@'%';
FLUSH PRIVILEGES;
```

## Kiểm tra quyền của user

```sql
SHOW GRANTS FOR 'cursor'@'%';
```

## Lệnh nhanh để cấp quyền (one-liner)

```bash
docker exec -it mysql-db mysql -uroot -ppassword -e "GRANT ALL PRIVILEGES ON *.* TO 'cursor'@'%' WITH GRANT OPTION; FLUSH PRIVILEGES;"
```

