# 📸 REGION IMAGES FEATURE

## ✨ Tính năng mới: Hình ảnh cho các khu vực bị thiên tai

Mỗi region giờ có hình ảnh phản ánh tình hình thiên tai thực tế!

---

## 🔧 BACKEND CHANGES

### 1. Database Schema

```sql
ALTER TABLE regions 
ADD COLUMN image_url VARCHAR(500);
```

### 2. Data (với Unsplash images)

| Region | Description | Image |
|--------|-------------|-------|
| **Miền Bắc** | Bão Yagi 2024, lũ lụt 2025 | 🌊 Flood/water disaster |
| **Miền Trung** | Bão lũ thường xuyên | 🌪️ Storm/flood damage |
| **Miền Nam** | Hạn hán, xâm nhập mặn | ☀️ Drought/dry fields |
| **Tây Nguyên** | Sạt lở, vùng xa | ⛰️ Mountains/highlands |
| **ĐBSCL** | Ngập lụt, hạn hán | 🌾 Rice fields/delta |

### 3. Models Update

**database.py:**
```python
class Region(Base):
    __tablename__ = "regions"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    image_url = Column(String(500))  # NEW!
```

**models.py:**
```python
class RegionResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None  # NEW!
```

**main.py:**
```python
return RegionDetailResponse(
    id=region.id,
    name=region.name,
    description=region.description,
    image_url=region.image_url,  # NEW!
    ...
)
```

---

## 🎨 FRONTEND CHANGES

### 1. Types Update

**types/index.ts:**
```typescript
export interface Region {
  id: number;
  name: string;
  description: string;
  image_url?: string;  // NEW!
}
```

### 2. Dashboard - RegionCard

**Before:**
```tsx
<Card title={...}>
  <p>{region.description}</p>
  ...
</Card>
```

**After:**
```tsx
<Card
  cover={
    region.image_url && (
      <div className="relative h-48 overflow-hidden">
        <img
          src={region.image_url}
          className="w-full h-full object-cover hover:scale-105 transition-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50" />
      </div>
    )
  }
  title={...}
>
  ...
</Card>
```

**Features:**
- Cover image height: 192px (h-48)
- Hover zoom effect (scale-105)
- Gradient overlay for better text readability
- Smooth transitions

### 3. Region Detail Page

**Before:**
```tsx
<Card>
  <Title level={2}>{data.region.name}</Title>
  <Paragraph>{data.region.description}</Paragraph>
</Card>
```

**After:**
```tsx
<Card 
  cover={
    data.region.image_url && (
      <div className="relative h-64 overflow-hidden">
        <img src={data.region.image_url} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-6 text-white">
          <Title level={2} className="!text-white">{data.region.name}</Title>
        </div>
      </div>
    )
  }
>
  <Paragraph>{data.region.description}</Paragraph>
</Card>
```

**Features:**
- Hero image height: 256px (h-64)
- Title overlay on image (white text)
- Gradient from bottom to top
- Professional magazine-style layout
- Fallback if no image

---

## 🖼️ IMAGE SOURCES

### Current: Unsplash (Free, High Quality)

- **Miền Bắc**: `photo-1547683905-f686c993aae5` - Flood
- **Miền Trung**: `photo-1547683905-86e2223a11cf` - Storm damage
- **Miền Nam**: `photo-1559827260-dc66d52bef19` - Dry landscape
- **Tây Nguyên**: `photo-1506905925346-21bda4d32df4` - Mountains
- **ĐBSCL**: `photo-1474557157379-8aa74a6ef541` - Rice fields

### Alternative Sources:

**Free Stock Photos:**
- Unsplash (https://unsplash.com)
  - Keywords: "vietnam flood", "vietnam storm", "vietnam disaster"
- Pexels (https://pexels.com)
- Pixabay (https://pixabay.com)

**News Photos** (Check copyright!):
- VNExpress
- Tuổi Trẻ
- Dân Trí
- Báo Chính Phủ

**How to Update:**
```bash
# Find real disaster photos
# Get image URL

# Update database
docker exec mysql-db mysql -ucursor -ppassword 3wolf -e "
UPDATE regions 
SET image_url = 'YOUR_NEW_IMAGE_URL' 
WHERE id = 2;
"

# Restart API
docker-compose restart api
```

---

## 🎨 UI EXAMPLES

### Dashboard Card:

```
┌────────────────────────────────────┐
│                                    │
│     [HÌNH ẢNH LŨ LỤT MIỀN TRUNG]  │ ← Cover image
│      ▼ Gradient overlay            │
│                                    │
├────────────────────────────────────┤
│ 📍 Miền Trung      [👁️ Chi tiết]  │
│                                    │
│ Thường xuyên chịu ảnh hưởng bão... │
│                                    │
│ 🏷️ Nước sạch  Lương thực  Y tế    │
│                                    │
│ 🔥 Món đồ ưu tiên:                 │
│    Bạt nhựa, lều  [93%] 🔴        │
│    Nước đóng chai [90%] 🔴        │
│                                    │
│         [🤖 AI Gợi ý]              │
└────────────────────────────────────┘
       ↑ Hover → Zoom effect
```

### Region Detail Page:

```
┌──────────────────────────────────────────────┐
│                                              │
│                                              │
│        [HERO IMAGE - LŨ LỤT MIỀN TRUNG]     │ ← h-64, full width
│              ▼ Gradient overlay              │
│                                              │
│          Miền Trung ←─ White title on image │
│                                              │
└──────────────────────────────────────────────┘
│                                              │
│ Miền Trung - Thường xuyên chịu ảnh hưởng... │
│                                              │
│ [Items List]  [Providers List]               │
│                                              │
```

---

## ✅ BENEFITS

**Before (No images):**
- ❌ Plain text cards
- ❌ Boring UI
- ❌ Không có visual impact

**After (With images):**
- ✅ Eye-catching cover images
- ✅ Professional design
- ✅ Emotional connection (người dùng thấy tình hình thực tế)
- ✅ Better UX
- ✅ Hackathon-worthy! 🏆

---

## 🧪 TESTING

```bash
# Test single region
curl http://localhost:8000/api/regions/2

# Expected output:
{
  "id": 2,
  "name": "Miền Trung",
  "description": "Miền Trung - Thường xuyên...",
  "image_url": "https://images.unsplash.com/photo-1547683905-86e2223a11cf?w=800",  // ✅
  "tags": [...],
  "items": [...],
  "providers": [...]
}
```

---

## 📱 USER EXPERIENCE

1. **Vào Dashboard**
   - Thấy 5 region cards với beautiful cover images
   - Hover vào card → Hình zoom nhẹ (smooth effect)
   
2. **Click vào region**
   - Hero image lớn ở đầu trang
   - Title hiển thị trên hình (magazine style)
   - Professional & polished

3. **Emotional Impact**
   - User thấy ảnh lũ lụt thật → Cảm động
   - Muốn quyên góp nhiều hơn
   - Hiểu rõ tình hình hơn

---

## 🚀 RESULT

**UI giờ SINH ĐỘNG & CÓ TÁC ĐỘNG CẢM XÚC!** 📸

Perfect for Hackathon demo! 🏆

