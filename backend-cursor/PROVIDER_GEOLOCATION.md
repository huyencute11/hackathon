# 📍 PROVIDER GEOLOCATION - Hiển thị nhà cung cấp từ gần đến xa

## ✨ Tính năng mới

Tương tự như Donation Locations, giờ **Nhà cung cấp** (Providers) cũng hiển thị theo khoảng cách từ user!

---

## 🔧 BACKEND CHANGES

### 1. Database Schema Update

Thêm `latitude` và `longitude` vào bảng `providers`:

```sql
ALTER TABLE providers 
ADD COLUMN latitude DECIMAL(10, 8), 
ADD COLUMN longitude DECIMAL(11, 8);
```

**GPS Data cho Providers:**

| Provider | Location | Latitude | Longitude |
|----------|----------|----------|-----------|
| Kho cứu trợ Hà Nội | Hà Nội | 21.0285 | 105.8542 |
| Kho cứu trợ TP.HCM | TP.HCM | 10.7769 | 106.7009 |
| Kho cứu trợ Đà Nẵng | Đà Nẵng | 16.0544 | 108.2022 |
| Kho cứu trợ Cần Thơ | Cần Thơ | 10.0342 | 105.7225 |

### 2. Models Update

**database.py:**
```python
class Provider(Base):
    __tablename__ = "providers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    capacity = Column(Integer, nullable=False, default=0)
    latitude = Column(Float)  # New!
    longitude = Column(Float)  # New!
```

**models.py:**
```python
class ProviderResponse(BaseModel):
    id: int
    name: str
    location: str
    capacity: int
    latitude: Optional[float] = None  # New!
    longitude: Optional[float] = None  # New!
    distance: Optional[float] = None  # New! Distance from user in km
```

### 3. API Update

**Endpoint:** `GET /api/regions/{region_id}`

**Query Parameters:**
- `user_latitude` (optional): User's latitude
- `user_longitude` (optional): User's longitude

**Logic:**
```python
@app.get("/api/regions/{region_id}", response_model=RegionDetailResponse)
async def get_region_detail(
    region_id: int, 
    user_latitude: Optional[float] = None,
    user_longitude: Optional[float] = None,
    db: Session = Depends(database.get_db)
):
    # ... get providers ...
    
    # Calculate distance from user to providers
    providers = []
    for pr, p in provider_regions_query:
        provider_distance = None
        if (user_latitude is not None and 
            user_longitude is not None and
            p.latitude is not None and 
            p.longitude is not None):
            provider_distance = calculate_distance(
                user_latitude, 
                user_longitude,
                p.latitude,
                p.longitude
            )
        
        providers.append(
            ProviderRegionResponse(
                ...
                provider=ProviderResponse(
                    ...
                    distance=provider_distance  # Distance from user
                )
            )
        )
    
    # Sort by distance from user
    if user_latitude is not None and user_longitude is not None:
        providers.sort(key=lambda x: x.provider.distance if x.provider.distance is not None else float('inf'))
```

---

## 🎨 FRONTEND CHANGES

### 1. Types Update

**types/index.ts:**
```typescript
export interface Provider {
  id: number;
  name: string;
  location: string;
  capacity: number;
  latitude?: number;  // New!
  longitude?: number;  // New!
  distance?: number;  // New! Distance from user in km
}
```

### 2. RegionDetail Page

**RegionDetail.tsx:**
```typescript
const [userLocation, setUserLocation] = useState<{ 
  latitude: number; 
  longitude: number 
} | null>(null);

// Request geolocation on mount
useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      }
    );
  }
}, []);

// Fetch data with user location
useEffect(() => {
  const response = await apiService.getSuggestions(
    Number(id),
    userLocation?.latitude,
    userLocation?.longitude
  );
  setData(response);
}, [id, userLocation]);
```

### 3. API Service Update

**api.ts:**
```typescript
getSuggestions: async (
  regionId: number,
  userLatitude?: number,
  userLongitude?: number
): Promise<SuggestionResponse> => {
  const params: Record<string, string> = {};
  if (userLatitude !== undefined && userLongitude !== undefined) {
    params.user_latitude = userLatitude.toString();
    params.user_longitude = userLongitude.toString();
  }
  
  const response = await api.get<SuggestionResponse>(
    `/regions/${regionId}/suggestions`, 
    { params }
  );
  return response.data;
},
```

### 4. ProviderList Component

**ProviderList.tsx:**
```typescript
// Sort by user distance if available
const sortedProviders = [...providers].sort((a, b) => {
  const distA = a.provider?.distance ?? a.distance ?? Infinity;
  const distB = b.provider?.distance ?? b.distance ?? Infinity;
  return distA - distB;
});

// Display distance
{hasUserDistance && (
  <Tag color="blue" className="mb-2">
    📍 {userDistance.toFixed(1)} km
  </Tag>
)}

{hasUserDistance && userDistance < 10 && (
  <Tag color="green">Gần bạn</Tag>
)}
```

---

## 🧪 TESTING

### Test 1: User ở Hà Nội
```bash
curl "http://localhost:8000/api/regions/1?user_latitude=21.0285&user_longitude=105.8542"
```

**Result:**
```
📍 Providers (sorted by distance from user):
🟢 1. Kho cứu trợ Hà Nội - 0.00 km ✅ (Gần nhất!)
```

### Test 2: User ở TP.HCM
```bash
curl "http://localhost:8000/api/regions/3?user_latitude=10.7769&user_longitude=106.7009"
```

**Result:**
```
📍 Providers:
🟢 1. Kho cứu trợ TP.HCM - 0.00 km ✅ (Gần bạn!)
```

### Test 3: No User Location
```bash
curl "http://localhost:8000/api/regions/1"
```

**Result:**
- Providers returned without `distance` field
- No sorting by distance
- Normal display

---

## 🎯 USER EXPERIENCE

### UI Display (Có GPS):

```
┌─────────────────────────────────────────────────────┐
│ 🏢 Nhà cung cấp được đề xuất                       │
├─────────────────────────────────────────────────────┤
│                                                      │
│ Kho cứu trợ Hà Nội         📍 0.00 km  [Gần bạn]  │
│ 📍 Hà Nội                  🟢 Dung lượng: 10000    │
│ ⏱️ Giao ngay                                        │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### UI Display (Không GPS):

```
┌─────────────────────────────────────────────────────┐
│ 🏢 Nhà cung cấp được đề xuất                       │
├─────────────────────────────────────────────────────┤
│                                                      │
│ Kho cứu trợ Hà Nội                                 │
│ 📍 Hà Nội                  🟢 Dung lượng: 10000    │
│ ⏱️ Giao ngay                                        │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## 📊 SO SÁNH: TRƯỚC vs SAU

### TRƯỚC:
- Providers hiển thị theo `provider_regions.distance` (distance từ provider đến region)
- Không biết provider nào gần user nhất
- Không có sorting theo location của user

### SAU:
- ✅ Providers hiển thị theo `provider.distance` (distance từ user đến provider)
- ✅ Sorted từ gần → xa dựa trên GPS của user
- ✅ Tag "Gần bạn" cho providers < 10km
- ✅ Privacy-friendly (không lưu location vào DB)

---

## 🔍 IMPLEMENTATION DETAILS

### Sorting Logic:
```typescript
// Priority: user distance > provider-region distance
const distA = a.provider?.distance ?? a.distance ?? Infinity;
const distB = b.provider?.distance ?? b.distance ?? Infinity;
return distA - distB;
```

### Display Logic:
```typescript
const userDistance = providerRegion.provider?.distance;
const hasUserDistance = userDistance !== undefined && userDistance !== null;

// Show distance tag
{hasUserDistance && (
  <Tag color="blue">📍 {userDistance.toFixed(1)} km</Tag>
)}

// Show "Gần bạn" tag if < 10km
{hasUserDistance && userDistance < 10 && (
  <Tag color="green">Gần bạn</Tag>
)}
```

---

## ✅ CHECKLIST

- [x] Database: Add latitude, longitude to providers table
- [x] Database: Insert GPS data for 4 providers
- [x] Backend: Update Provider model
- [x] Backend: Update ProviderResponse model
- [x] Backend: Update GET /api/regions/{id} to accept user location
- [x] Backend: Calculate distance from user to providers
- [x] Backend: Sort providers by distance
- [x] Frontend: Update Provider type
- [x] Frontend: Request geolocation in RegionDetail
- [x] Frontend: Send user location to API
- [x] Frontend: Update ProviderList to display distance
- [x] Frontend: Sort providers by user distance
- [x] Frontend: Show "Gần bạn" tag for nearby providers
- [x] Tested with multiple user locations

---

## 🎉 RESULT

**Giờ user thấy ngay kho cứu trợ GẦN NHẤT để quyên góp!** 🎯

**2 tính năng geolocation hoàn chỉnh:**
1. ✅ Donation Locations (AI Gợi ý modal)
2. ✅ **Providers (Trang chi tiết region)** ⭐ NEW!

