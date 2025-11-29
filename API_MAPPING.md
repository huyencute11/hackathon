# API Mapping: Frontend ↔ Backend

Tài liệu mapping giữa Frontend (TypeScript/React) và Backend (Python/FastAPI)

## 📋 Tổng quan

- **Frontend Base URL**: `http://localhost:8000/api` (configurable via `VITE_API_URL`)
- **Backend Base URL**: `http://localhost:8000/api`
- **API Version**: 1.0.0

---

## 🔌 API Endpoints Mapping

### 1. Get All Regions

**Frontend:**
```typescript
apiService.getRegions(): Promise<Region[]>
GET /api/regions
```

**Backend:**
```python
@app.get("/api/regions", response_model=List[RegionResponse])
async def get_regions(db: Session = Depends(database.get_db))
```

**Status**: ✅ **MATCHED**

**Request**: None

**Response**:
```typescript
// Frontend Type
Region[] = [
  { id: number, name: string, description: string }
]

// Backend Response
List[RegionResponse] = [
  { id: int, name: str, description: Optional[str] }
]
```

---

### 2. Get Region Detail

**Frontend:**
```typescript
apiService.getRegionDetail(regionId: number): Promise<RegionDetail>
GET /api/regions/{regionId}
```

**Backend:**
```python
@app.get("/api/regions/{region_id}", response_model=RegionDetailResponse)
async def get_region_detail(region_id: int, db: Session = Depends(database.get_db))
```

**Status**: ✅ **MATCHED**

**Request**: Path parameter `regionId` / `region_id`

**Response**:
```typescript
// Frontend Type
RegionDetail = Region & {
  tags: Tag[],
  items: RegionItem[],
  providers: ProviderRegion[]
}

// Backend Response
RegionDetailResponse = {
  id: int,
  name: str,
  description: Optional[str],
  tags: List[TagResponse],
  items: List[RegionItemResponse],
  providers: List[ProviderRegionResponse]
}
```

---

### 3. Get Region Suggestions

**Frontend:**
```typescript
apiService.getSuggestions(regionId: number): Promise<SuggestionResponse>
GET /api/regions/{regionId}/suggestions
```

**Backend:**
```python
@app.get("/api/regions/{region_id}/suggestions", response_model=SuggestionResponse)
async def get_region_suggestions(region_id: int, db: Session = Depends(database.get_db))
```

**Status**: ✅ **MATCHED**

**Request**: Path parameter `regionId` / `region_id`

**Response**:
```typescript
// Frontend Type
SuggestionResponse = {
  region: RegionDetail,
  suggested_items: RegionItem[],
  recommended_providers: ProviderRegion[]
}

// Backend Response
SuggestionResponse = {
  region: RegionDetailResponse,
  suggested_items: List[RegionItemResponse],
  recommended_providers: List[ProviderRegionResponse]
}
```

---

### 4. Get All Regions with Suggestions

**Frontend:**
```typescript
apiService.getAllRegionsWithSuggestions(): Promise<SuggestionResponse[]>
GET /api/regions/suggestions
```

**Backend:**
```python
@app.get("/api/regions/suggestions", response_model=List[SuggestionResponse])
async def get_all_regions_with_suggestions(db: Session = Depends(database.get_db))
```

**Status**: ✅ **MATCHED**

**Request**: None

**Response**:
```typescript
// Frontend Type
SuggestionResponse[] = Array<SuggestionResponse>

// Backend Response
List[SuggestionResponse] = [SuggestionResponse, ...]
```

---

### 5. Get Products

**Frontend:**
```typescript
apiService.getProducts(): Promise<Product[]>
GET /api/products
```

**Backend:**
```python
@app.get("/api/products", response_model=List[ProductResponse])
async def get_products(db: Session = Depends(database.get_db))
```

**Status**: ✅ **MATCHED**

**Request**: None

**Response**:
```typescript
// Frontend Type
Product[] = [
  { id: number, name: string, description: string, category: string }
]

// Backend Response
List[ProductResponse] = [
  { id: int, name: str, description: Optional[str], category: Optional[str] }
]
```

**Note**: Frontend expects `description` and `category` as required, but backend has them as optional. This is acceptable.

---

### 6. Submit Donation

**Frontend:**
```typescript
apiService.submitDonation(request: DonationRequest): Promise<DonationResponse>
POST /api/donations
```

**Backend:**
```python
@app.post("/api/donations", response_model=DonationResponse)
async def submit_donation(request: DonationRequest, db: Session = Depends(database.get_db))
```

**Status**: ✅ **MATCHED**

**Request**:
```typescript
// Frontend Type
DonationRequest = {
  region_ids: number[],
  product_ids: number[]
}

// Backend Request
DonationRequest = {
  region_ids: List[int] = [],
  product_ids: List[int] = []
}
```

**Response**:
```typescript
// Frontend Type
DonationResponse = {
  locations: DonationLocation[]
}

DonationLocation = {
  id: number,
  name: string,
  address: string,
  phone?: string,
  email?: string,
  opening_hours?: string,
  distance?: number,
  notes?: string
}

// Backend Response
DonationResponse = {
  locations: List[DonationLocationResponse]
}

DonationLocationResponse = {
  id: int,
  name: str,
  address: str,
  phone: Optional[str],
  email: Optional[str],
  opening_hours: Optional[str],
  distance: Optional[float],
  notes: Optional[str]
}
```

**Note**: Backend removes `region_id` from response to match frontend expectations.

---

## 📊 Type Mapping

### Basic Types

| Frontend (TypeScript) | Backend (Python) | Notes |
|----------------------|------------------|-------|
| `number` | `int` / `float` | Integer and float both map to number |
| `string` | `str` | ✅ |
| `boolean` | `bool` | ✅ |
| `null` / `undefined` | `None` / `Optional[T]` | ✅ |
| `[]` | `List[T]` | ✅ |
| `{}` | `Dict` / Pydantic Model | ✅ |

### Complex Types

| Frontend Interface | Backend Pydantic Model | Status |
|-------------------|------------------------|--------|
| `Region` | `RegionResponse` | ✅ Matched |
| `RegionDetail` | `RegionDetailResponse` | ✅ Matched |
| `Tag` | `TagResponse` | ✅ Matched |
| `Item` | `ItemResponse` | ✅ Matched |
| `RegionItem` | `RegionItemResponse` | ✅ Matched |
| `Provider` | `ProviderResponse` | ✅ Matched |
| `ProviderRegion` | `ProviderRegionResponse` | ✅ Matched |
| `SuggestionResponse` | `SuggestionResponse` | ✅ Matched |
| `Product` | `ProductResponse` | ✅ Matched |
| `DonationLocation` | `DonationLocationResponse` | ✅ Matched |
| `DonationRequest` | `DonationRequest` | ✅ Matched |
| `DonationResponse` | `DonationResponse` | ✅ Matched |

---

## ⚠️ Important Notes

### 1. Optional Fields

- **Frontend**: Uses `?` for optional fields (e.g., `phone?: string`)
- **Backend**: Uses `Optional[T]` (e.g., `phone: Optional[str] = None`)
- **Status**: ✅ Compatible

### 2. Empty Arrays

- Both frontend and backend accept empty arrays `[]` for `region_ids` and `product_ids` in donation requests
- Backend will return all locations if filters are empty

### 3. Missing Fields

- `DonationLocation` in frontend does NOT include `region_id` (removed for UI simplicity)
- Backend removes `region_id` from response to match frontend

### 4. Mock Data Mode

- Frontend has `USE_MOCK_DATA` flag (default: `true`)
- Set `VITE_USE_MOCK_DATA=false` in frontend `.env` to use real API
- Backend always returns real data from database

### 5. CORS Configuration

- Backend allows all origins: `allow_origins=["*"]`
- For production, update to specific frontend URL

---

## 🔍 Field-by-Field Comparison

### RegionDetailResponse

| Field | Frontend | Backend | Match |
|-------|----------|---------|-------|
| `id` | `number` | `int` | ✅ |
| `name` | `string` | `str` | ✅ |
| `description` | `string` | `Optional[str]` | ✅ (BE more flexible) |
| `tags` | `Tag[]` | `List[TagResponse]` | ✅ |
| `items` | `RegionItem[]` | `List[RegionItemResponse]` | ✅ |
| `providers` | `ProviderRegion[]` | `List[ProviderRegionResponse]` | ✅ |

### DonationLocationResponse

| Field | Frontend | Backend | Match |
|-------|----------|---------|-------|
| `id` | `number` | `int` | ✅ |
| `name` | `string` | `str` | ✅ |
| `address` | `string` | `str` | ✅ |
| `phone` | `string?` | `Optional[str]` | ✅ |
| `email` | `string?` | `Optional[str]` | ✅ |
| `opening_hours` | `string?` | `Optional[str]` | ✅ |
| `distance` | `number?` | `Optional[float]` | ✅ |
| `notes` | `string?` | `Optional[str]` | ✅ |
| `region_id` | ❌ Not included | ❌ Removed in response | ✅ Intentional |

---

## 🚀 Testing Checklist

- [x] `GET /api/regions` - Returns list of regions
- [x] `GET /api/regions/{id}` - Returns region detail
- [x] `GET /api/regions/{id}/suggestions` - Returns suggestions for region
- [x] `GET /api/regions/suggestions` - Returns all regions with suggestions
- [x] `GET /api/products` - Returns list of products
- [x] `POST /api/donations` - Returns donation locations

---

## 📝 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
VITE_USE_MOCK_DATA=false  # Set to false to use real API
```

### Backend (.env)
```env
DB_HOST=mysql
DB_PORT=3306
DB_USER=cursor
DB_PASSWORD=password
DB_NAME=3wolf
```

---

## 🔗 Quick Reference

| Frontend Method | HTTP Method | Endpoint | Backend Function |
|----------------|-------------|----------|------------------|
| `getRegions()` | GET | `/api/regions` | `get_regions()` |
| `getRegionDetail(id)` | GET | `/api/regions/{id}` | `get_region_detail()` |
| `getSuggestions(id)` | GET | `/api/regions/{id}/suggestions` | `get_region_suggestions()` |
| `getAllRegionsWithSuggestions()` | GET | `/api/regions/suggestions` | `get_all_regions_with_suggestions()` |
| `getProducts()` | GET | `/api/products` | `get_products()` |
| `submitDonation(request)` | POST | `/api/donations` | `submit_donation()` |

---

## ✅ Summary

**All API endpoints are properly mapped and compatible!**

- ✅ All 6 endpoints match between frontend and backend
- ✅ Request/Response types are compatible
- ✅ Optional fields handled correctly
- ✅ CORS configured for cross-origin requests
- ✅ Error handling compatible (404 for not found)

**Ready for integration!** 🎉

