----------Tóm tắt ý tưởng & mục tiêu chính

Dựa trên mô tả trước:

📌 Ý tưởng dự án

Xây dựng hệ thống xác định nhu cầu cứu trợ của từng khu vực dựa trên:

Region: khu vực cần hỗ trợ

Tag: loại nhu cầu (water, medicine, food…)

Item: sản phẩm cần hỗ trợ tương ứng

Provider region: nơi tập kết hàng hỗ trợ

Hệ thống dùng AI/ML để gợi ý sản phẩm cần ưu tiên cho từng khu vực dựa trên mức độ tương đồng nhu cầu với các khu vực khác.

🎯 Mục tiêu chính

Tự động xác định khu vực đang cần gì nhất

Gợi ý sản phẩm ưu tiên cần gửi đến

Tối ưu phân phối hàng cứu trợ, giảm lãng phí

Hỗ trợ ra quyết định nhanh và chính xác cho đội điều phối

Tạo demo nhanh gọn trong 3 giờ

Nếu bạn muốn, mình có thể giúp bạn:

👉 xây dựng 1 file Python chạy được
👉 dựng API FastAPI để demo
👉 hoặc tạo UI React để show gợi ý

----------------------------------------------------

User
 │
 ▼
Web App (React)
 │  yêu cầu dữ liệu
 ▼
API Backend (FastAPI)
 │
 ├──► Lấy danh sách region + nhu cầu
 │      từ Region Database
 │
 ├──► Gửi nhu cầu sang ML Suggestion Engine
 │      (TF-IDF + cosine similarity)
 │
 └──► Lấy danh sách Provider phù hợp
         từ Provider DB
 │
 ▼
Web App (hiển thị gợi ý sản phẩm)


Entity Relationship Diagram:
REGION
---------
id (PK)
name
description


TAG
---------
id (PK)
name
category


REGION_TAG
---------
region_id (FK)
tag_id (FK)


ITEM
---------
id (PK)
name
description
category


REGION_ITEM
---------
region_id (FK)
item_id (FK)
priority_score


PROVIDER
---------
id (PK)
name
location
capacity


PROVIDER_REGION
---------
provider_id (FK)
region_id (FK)
distance
shipping_estimate
