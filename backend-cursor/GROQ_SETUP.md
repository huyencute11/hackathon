# 🚀 Hướng dẫn Setup Groq AI (MIỄN PHÍ!)

## Tại sao chọn Groq?
- ✅ **100% MIỄN PHÍ** (không cần thẻ tín dụng)
- ✅ **Siêu nhanh** (~200-300ms, nhanh hơn OpenAI 10x)
- ✅ **Không giới hạn** requests trong beta
- ✅ **Llama 3.1 70B** - model rất mạnh

## Bước 1: Đăng ký Groq (2 phút)

1. Truy cập: https://console.groq.com/
2. Click "Sign Up" hoặc "Log in with Google"
3. Đăng nhập bằng Google account (hoặc email)
4. ✅ Done! Không cần verify credit card

## Bước 2: Lấy API Key (1 phút)

1. Sau khi đăng nhập, vào: https://console.groq.com/keys
2. Click "Create API Key"
3. Đặt tên: "hackathon" hoặc gì cũng được
4. Click "Create"
5. **COPY** API key (dạng: `gsk_...`)

⚠️ **Lưu ý:** Chỉ hiện 1 lần, copy ngay!

## Bước 3: Thêm vào Backend

### Option A: Thêm vào docker-compose.yml (Khuyến nghị)

Mở file `backend-cursor/docker-compose.yml`, thêm vào phần `environment` của service `api`:

```yaml
api:
  environment:
    # ... các biến khác ...
    GROQ_API_KEY: "gsk_paste_your_key_here"  # 👈 Thêm dòng này
```

Sau đó restart:
```bash
cd backend-cursor
docker-compose restart api
```

### Option B: Tạo file .env

Tạo file `backend-cursor/.env`:
```bash
GROQ_API_KEY=gsk_paste_your_key_here
```

Restart backend:
```bash
docker-compose restart api
```

## Bước 4: Kiểm tra

```bash
# Check logs để xem AI đã enable chưa
docker-compose logs api | grep "Groq"

# Nếu thấy: "✅ Groq AI enabled" = Success!
```

Test API:
```bash
curl -X POST http://localhost:8000/api/donations/ai \
  -H "Content-Type: application/json" \
  -d '{"region_id": 1, "item_ids": []}'
```

Nếu có Groq, response sẽ có:
- `reason` chi tiết hơn (do AI phân tích)
- `ai_message` được AI tạo dựa trên context

## ✨ Kết quả

**TRƯỚC (Rule-based):**
```json
{
  "reason": "Mức độ ưu tiên cao nhất - Cực kỳ cần thiết"
}
```

**SAU (AI-powered với Groq):**
```json
{
  "reason": "Nước sạch là nhu cầu thiết yếu nhất cho sinh hoạt và vệ sinh sau thiên tai, đặc biệt khi nguồn nước bị ô nhiễm"
}
```

## 🔥 Performance

| Mode | Speed | Quality | Cost |
|------|-------|---------|------|
| Rule-based | 50ms | Good | $0 |
| **Groq AI** | **200ms** | **Excellent** | **$0** |
| OpenAI | 1-2s | Very Good | $5 free |
| Claude | 2-5s | Excellent | $5+ |

## Troubleshooting

### "API key not found"
- Check xem đã thêm `GROQ_API_KEY` vào docker-compose.yml chưa
- Restart lại backend: `docker-compose restart api`

### "Rate limit exceeded"
- Groq hiện tại không có rate limit trong beta
- Nếu gặp, đợi 1 phút và thử lại

### Muốn tắt AI, dùng rule-based
- Xóa hoặc comment dòng `GROQ_API_KEY` trong docker-compose.yml
- Restart backend

## 🎯 Tóm tắt

1. Đăng ký: https://console.groq.com/
2. Lấy API key: https://console.groq.com/keys  
3. Thêm vào `docker-compose.yml`:
   ```yaml
   GROQ_API_KEY: "gsk_your_key_here"
   ```
4. Restart: `docker-compose restart api`
5. ✅ AI sẽ đọc database và phân tích thông minh!

---

**Mất 3 phút setup, được AI MIỄN PHÍ mãi mãi!** 🚀

