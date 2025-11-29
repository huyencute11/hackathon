# Frontend - Relief Coordination System

Frontend ứng dụng React + TypeScript + Tailwind CSS + Ant Design cho hệ thống cứu trợ.

## Công nghệ sử dụng

- **React 18** - UI Framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS
- **Ant Design** - UI Component Library
- **React Router** - Routing
- **Axios** - HTTP client
- **react-i18next** - Internationalization (i18n) - Hỗ trợ tiếng Việt và tiếng Anh

## Cài đặt

```bash
npm install
```

## Chạy development server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

## Build production

```bash
npm run build
```

## Cấu trúc thư mục

```
src/
├── components/       # React components
│   ├── Dashboard.tsx
│   ├── RegionCard.tsx
│   ├── ItemList.tsx
│   └── ProviderList.tsx
├── pages/           # Page components
│   └── RegionDetail.tsx
├── services/         # API services
│   └── api.ts
├── data/            # Mock data
│   └── mockData.ts
├── i18n/            # Internationalization
│   ├── config.ts
│   └── locales/
│       ├── en.json
│       └── vi.json
├── types/           # TypeScript types
│   └── index.ts
├── App.tsx          # Main App component
├── App.css          # Global styles
└── main.tsx         # Entry point
```

## API Endpoints

Frontend kỳ vọng backend API có các endpoints sau:

- `GET /api/regions` - Lấy danh sách tất cả khu vực
- `GET /api/regions/:id` - Lấy chi tiết một khu vực
- `GET /api/regions/:id/suggestions` - Lấy gợi ý sản phẩm cho khu vực
- `GET /api/regions/suggestions` - Lấy tất cả khu vực với gợi ý

## Tính năng

- ✅ Dashboard hiển thị tất cả khu vực cần cứu trợ
- ✅ Tìm kiếm khu vực
- ✅ Hiển thị nhu cầu và sản phẩm ưu tiên cho từng khu vực
- ✅ Trang chi tiết khu vực với gợi ý AI/ML
- ✅ Danh sách nhà cung cấp phù hợp
- ✅ UI hiện đại, responsive
- ✅ **Mock data sẵn có** - Có thể chạy ngay không cần backend
- ✅ **Đa ngôn ngữ (i18n)** - Hỗ trợ tiếng Việt và tiếng Anh với language switcher

## Mock Data

Ứng dụng đã có sẵn mock data với 5 khu vực mẫu, có thể chạy ngay mà không cần backend:

- Khu vực Bắc Giang - Cần nước sạch và thực phẩm
- Khu vực Quảng Nam - Cần chỗ ở và vật dụng y tế
- Khu vực Đồng Tháp - Cần nước sạch và thuốc men
- Khu vực Lào Cai - Cần quần áo ấm và thực phẩm
- Khu vực Phú Yên - Cần hỗ trợ toàn diện

Mock data bao gồm:
- Tags (nhu cầu): Nước sạch, Thuốc men, Thực phẩm, Quần áo, Chỗ ở, Vật dụng y tế, Đèn pin, Pin
- Items (sản phẩm): 12 loại sản phẩm với priority scores
- Providers: 5 kho cứu trợ ở các tỉnh thành

## Environment Variables

Tạo file `.env` để cấu hình:

```
VITE_API_URL=http://localhost:8000
VITE_USE_MOCK_DATA=true  # Set false để dùng API thật
```

**Mặc định**: Ứng dụng sử dụng mock data (`VITE_USE_MOCK_DATA=true`). Để kết nối với backend thật, set `VITE_USE_MOCK_DATA=false`.

## Internationalization (i18n)

Ứng dụng hỗ trợ đa ngôn ngữ với **react-i18next**:

- 🇻🇳 **Tiếng Việt** (mặc định)
- 🇬🇧 **English**

### Tính năng:
- Language switcher ở header dashboard
- Tự động phát hiện ngôn ngữ từ browser/localStorage
- Lưu lựa chọn ngôn ngữ vào localStorage
- Ant Design locale tự động thay đổi theo ngôn ngữ

### Thêm ngôn ngữ mới:
1. Tạo file translation mới trong `src/i18n/locales/` (ví dụ: `fr.json`)
2. Thêm vào `src/i18n/config.ts`
3. Thêm option vào `LanguageSwitcher` component

