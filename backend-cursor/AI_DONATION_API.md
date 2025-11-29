# AI Donation API Documentation

## Endpoint: POST /api/donations/ai

AI-powered donation suggestion endpoint. Phân tích thông tin khu vực và đưa ra gợi ý món đồ quyên góp phù hợp nhất.

### Request

```json
{
  "region_id": 1,           // Required: ID của khu vực muốn quyên góp
  "item_ids": [1, 2, 3]     // Optional: Danh sách items người dùng đã chọn (có thể để [] nếu chưa chọn)
}
```

### Response

```json
{
  "region_name": "Miền Bắc",
  "ai_message": "Cảm ơn bạn đã muốn quyên góp cho Miền Bắc...",
  "suggested_items": [
    {
      "item": {
        "id": 1,
        "name": "Nước đóng chai 500ml",
        "description": "Nước uống đóng chai",
        "category": "water"
      },
      "priority_score": 0.95,
      "reason": "Mức độ ưu tiên cao nhất - Cực kỳ cần thiết"
    }
  ],
  "donation_locations": [
    {
      "id": 1,
      "name": "Trung tâm Cứu trợ Hà Nội",
      "address": "123 Đường Láng, Đống Đa, Hà Nội",
      "phone": "024-1234-5678",
      "email": null,
      "opening_hours": null,
      "distance": null,
      "notes": null
    }
  ]
}
```

## Cách hoạt động

### 1. Không có AI API Key (Rule-based mode)
- Trả về top 5 items có priority_score cao nhất cho region
- Reason dựa trên priority_score levels
- AI message là template cố định

### 2. Có AI API Key (AI-powered mode)
- Gọi Claude AI để phân tích context:
  - Thông tin khu vực (tên, mô tả)
  - Tags nhu cầu (Nước sạch, Thực phẩm, ...)
  - Priority items hiện tại
  - Items người dùng đã chọn
- AI đưa ra gợi ý items + lý do cụ thể
- AI tạo message cá nhân hóa

## Cấu hình AI (Optional)

Thêm vào `.env` hoặc `docker-compose.yml`:

```bash
ANTHROPIC_API_KEY=sk-ant-api03-...
```

Nếu không có API key, hệ thống vẫn hoạt động bình thường với rule-based suggestions.

## Frontend Integration

### Example Usage

```typescript
// Frontend call
const response = await fetch('http://localhost:8000/api/donations/ai', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    region_id: selectedRegionId,
    item_ids: selectedItemIds  // [] if nothing selected
  })
});

const data = await response.json();

// Display results
console.log(data.region_name);        // "Miền Bắc"
console.log(data.ai_message);         // AI message
console.log(data.suggested_items);     // Array of suggestions
console.log(data.donation_locations);  // Where to donate
```

### Type Definitions

```typescript
interface AIDonationRequest {
  region_id: number;
  item_ids?: number[];
}

interface SuggestedItem {
  item: {
    id: number;
    name: string;
    description: string;
    category: string;
  };
  priority_score: number;
  reason: string;  // AI-generated or rule-based
}

interface AIDonationResponse {
  region_name: string;
  ai_message: string;
  suggested_items: SuggestedItem[];
  donation_locations: DonationLocation[];
}
```

## Testing

### Test 1: No items selected
```bash
curl -X POST http://localhost:8000/api/donations/ai \
  -H "Content-Type: application/json" \
  -d '{"region_id": 1, "item_ids": []}'
```

### Test 2: With selected items
```bash
curl -X POST http://localhost:8000/api/donations/ai \
  -H "Content-Type: application/json" \
  -d '{"region_id": 2, "item_ids": [2, 6]}'
```

## Error Handling

- 404: Region not found
- 422: Invalid request body
- 500: Internal server error

## Performance

- Rule-based mode: ~50ms
- AI mode: ~2-5 seconds (depends on Claude API)

## Notes

1. Endpoint tự động fallback về rule-based nếu AI call fails
2. Mỗi region có danh sách items riêng với priority scores
3. Donation locations được filter theo region_id
4. AI suggestions match với items có sẵn trong database

