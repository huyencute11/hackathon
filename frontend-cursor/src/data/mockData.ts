import type {
  SuggestionResponse,
  Region,
  Tag,
  Item,
  Provider,
  Product,
  DonationLocation,
  DonationRequest,
  DonationResponse,
} from '../types';

// Mock Tags
const mockTags: Tag[] = [
  { id: 1, name: 'Nước sạch', category: 'essential' },
  { id: 2, name: 'Thuốc men', category: 'medical' },
  { id: 3, name: 'Thực phẩm', category: 'food' },
  { id: 4, name: 'Quần áo', category: 'clothing' },
  { id: 5, name: 'Chỗ ở', category: 'shelter' },
  { id: 6, name: 'Vật dụng y tế', category: 'medical' },
  { id: 7, name: 'Đèn pin', category: 'tools' },
  { id: 8, name: 'Pin', category: 'tools' },
];

// Mock Items
const mockItems: Item[] = [
  { id: 1, name: 'Nước đóng chai 500ml', description: 'Nước uống đóng chai', category: 'water' },
  { id: 2, name: 'Gạo', description: 'Gạo trắng', category: 'food' },
  { id: 3, name: 'Mì tôm', description: 'Mì ăn liền', category: 'food' },
  { id: 4, name: 'Thuốc giảm đau', description: 'Paracetamol 500mg', category: 'medicine' },
  { id: 5, name: 'Băng gạc', description: 'Băng gạc y tế', category: 'medical_supplies' },
  { id: 6, name: 'Áo khoác', description: 'Áo khoác ấm', category: 'clothing' },
  { id: 7, name: 'Chăn', description: 'Chăn ấm', category: 'clothing' },
  { id: 8, name: 'Đèn pin LED', description: 'Đèn pin sạc', category: 'tools' },
  { id: 9, name: 'Pin AA', description: 'Pin tiểu', category: 'tools' },
  { id: 10, name: 'Lều bạt', description: 'Lều trú ẩn', category: 'shelter' },
  { id: 11, name: 'Nước sạch 20L', description: 'Thùng nước lớn', category: 'water' },
  { id: 12, name: 'Thuốc kháng sinh', description: 'Amoxicillin', category: 'medicine' },
];

// Mock Providers
const mockProviders: Provider[] = [
  { id: 1, name: 'Kho cứu trợ Hà Nội', location: 'Hà Nội', capacity: 10000 },
  { id: 2, name: 'Kho cứu trợ TP.HCM', location: 'TP. Hồ Chí Minh', capacity: 15000 },
  { id: 3, name: 'Kho cứu trợ Đà Nẵng', location: 'Đà Nẵng', capacity: 8000 },
  { id: 4, name: 'Kho cứu trợ Cần Thơ', location: 'Cần Thơ', capacity: 6000 },
  { id: 5, name: 'Kho cứu trợ Huế', location: 'Huế', capacity: 5000 },
];

// Mock Regions
const mockRegions: Region[] = [
  {
    id: 1,
    name: 'Khu vực Bắc Giang',
    description: 'Khu vực bị ảnh hưởng bởi lũ lụt, cần hỗ trợ khẩn cấp về nước sạch và thực phẩm',
  },
  {
    id: 2,
    name: 'Khu vực Quảng Nam',
    description: 'Khu vực ven biển bị ảnh hưởng bão, cần hỗ trợ chỗ ở và vật dụng y tế',
  },
  {
    id: 3,
    name: 'Khu vực Đồng Tháp',
    description: 'Khu vực đồng bằng sông Cửu Long, cần hỗ trợ nước sạch và thuốc men',
  },
  {
    id: 4,
    name: 'Khu vực Lào Cai',
    description: 'Khu vực miền núi, cần hỗ trợ quần áo ấm và thực phẩm',
  },
  {
    id: 5,
    name: 'Khu vực Phú Yên',
    description: 'Khu vực bị ảnh hưởng thiên tai, cần hỗ trợ toàn diện',
  },
];

// Mock data for suggestions
export const mockSuggestions: SuggestionResponse[] = [
  {
    region: {
      ...mockRegions[0],
      tags: [mockTags[0], mockTags[2], mockTags[6]],
      items: [],
      providers: [],
    },
    suggested_items: [
      { region_id: 1, item_id: 1, priority_score: 0.95, item: mockItems[0] },
      { region_id: 1, item_id: 11, priority_score: 0.90, item: mockItems[10] },
      { region_id: 1, item_id: 2, priority_score: 0.85, item: mockItems[1] },
      { region_id: 1, item_id: 3, priority_score: 0.80, item: mockItems[2] },
      { region_id: 1, item_id: 4, priority_score: 0.70, item: mockItems[3] },
      { region_id: 1, item_id: 8, priority_score: 0.65, item: mockItems[8] },
    ],
    recommended_providers: [
      {
        provider_id: 1,
        region_id: 1,
        distance: 50,
        shipping_estimate: '2-3 giờ',
        provider: mockProviders[0],
      },
      {
        provider_id: 2,
        region_id: 1,
        distance: 1200,
        shipping_estimate: '1-2 ngày',
        provider: mockProviders[1],
      },
    ],
  },
  {
    region: {
      ...mockRegions[1],
      tags: [mockTags[5], mockTags[4], mockTags[2]],
      items: [],
      providers: [],
    },
    suggested_items: [
      { region_id: 2, item_id: 10, priority_score: 0.92, item: mockItems[9] },
      { region_id: 2, item_id: 5, priority_score: 0.88, item: mockItems[4] },
      { region_id: 2, item_id: 12, priority_score: 0.85, item: mockItems[11] },
      { region_id: 2, item_id: 2, priority_score: 0.75, item: mockItems[1] },
      { region_id: 2, item_id: 7, priority_score: 0.70, item: mockItems[6] },
      { region_id: 2, item_id: 1, priority_score: 0.65, item: mockItems[0] },
    ],
    recommended_providers: [
      {
        provider_id: 3,
        region_id: 2,
        distance: 80,
        shipping_estimate: '3-4 giờ',
        provider: mockProviders[2],
      },
      {
        provider_id: 5,
        region_id: 2,
        distance: 150,
        shipping_estimate: '4-5 giờ',
        provider: mockProviders[4],
      },
    ],
  },
  {
    region: {
      ...mockRegions[2],
      tags: [mockTags[0], mockTags[1], mockTags[2]],
      items: [],
      providers: [],
    },
    suggested_items: [
      { region_id: 3, item_id: 11, priority_score: 0.93, item: mockItems[10] },
      { region_id: 3, item_id: 4, priority_score: 0.87, item: mockItems[3] },
      { region_id: 3, item_id: 12, priority_score: 0.82, item: mockItems[11] },
      { region_id: 3, item_id: 2, priority_score: 0.78, item: mockItems[1] },
      { region_id: 3, item_id: 3, priority_score: 0.72, item: mockItems[2] },
      { region_id: 3, item_id: 5, priority_score: 0.68, item: mockItems[4] },
    ],
    recommended_providers: [
      {
        provider_id: 4,
        region_id: 3,
        distance: 30,
        shipping_estimate: '1-2 giờ',
        provider: mockProviders[3],
      },
      {
        provider_id: 2,
        region_id: 3,
        distance: 200,
        shipping_estimate: '5-6 giờ',
        provider: mockProviders[1],
      },
    ],
  },
  {
    region: {
      ...mockRegions[3],
      tags: [mockTags[3], mockTags[2], mockTags[7]],
      items: [],
      providers: [],
    },
    suggested_items: [
      { region_id: 4, item_id: 6, priority_score: 0.91, item: mockItems[5] },
      { region_id: 4, item_id: 7, priority_score: 0.89, item: mockItems[6] },
      { region_id: 4, item_id: 2, priority_score: 0.83, item: mockItems[1] },
      { region_id: 4, item_id: 3, priority_score: 0.79, item: mockItems[2] },
      { region_id: 4, item_id: 8, priority_score: 0.74, item: mockItems[7] },
      { region_id: 4, item_id: 9, priority_score: 0.69, item: mockItems[8] },
    ],
    recommended_providers: [
      {
        provider_id: 1,
        region_id: 4,
        distance: 300,
        shipping_estimate: '6-8 giờ',
        provider: mockProviders[0],
      },
      {
        provider_id: 3,
        region_id: 4,
        distance: 500,
        shipping_estimate: '10-12 giờ',
        provider: mockProviders[2],
      },
    ],
  },
  {
    region: {
      ...mockRegions[4],
      tags: [mockTags[0], mockTags[1], mockTags[2], mockTags[4], mockTags[5]],
      items: [],
      providers: [],
    },
    suggested_items: [
      { region_id: 5, item_id: 1, priority_score: 0.94, item: mockItems[0] },
      { region_id: 5, item_id: 2, priority_score: 0.90, item: mockItems[1] },
      { region_id: 5, item_id: 4, priority_score: 0.86, item: mockItems[3] },
      { region_id: 5, item_id: 10, priority_score: 0.81, item: mockItems[9] },
      { region_id: 5, item_id: 5, priority_score: 0.77, item: mockItems[4] },
      { region_id: 5, item_id: 7, priority_score: 0.73, item: mockItems[6] },
      { region_id: 5, item_id: 8, priority_score: 0.68, item: mockItems[7] },
    ],
    recommended_providers: [
      {
        provider_id: 3,
        region_id: 5,
        distance: 120,
        shipping_estimate: '4-5 giờ',
        provider: mockProviders[2],
      },
      {
        provider_id: 2,
        region_id: 5,
        distance: 400,
        shipping_estimate: '8-10 giờ',
        provider: mockProviders[1],
      },
    ],
  },
];

// Helper function to get mock suggestion by region ID
export const getMockSuggestion = (regionId: number): SuggestionResponse | undefined => {
  return mockSuggestions.find((s) => s.region.id === regionId);
};

// Helper function to get all mock regions
export const getMockRegions = (): Region[] => {
  return mockRegions;
};

// Mock Products (same as Items but as Product type)
export const getMockProducts = (): Product[] => {
  return mockItems.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    category: item.category,
  }));
};

// Mock Donation Locations
const mockDonationLocations: DonationLocation[] = [
  {
    id: 1,
    name: 'Điểm quyên góp Hà Nội',
    address: '123 Đường Láng, Đống Đa, Hà Nội',
    phone: '024-1234-5678',
    email: 'hanoi@relief.org',
    opening_hours: '8:00 - 18:00 hàng ngày',
    distance: 5,
    notes: 'Nhận quyên góp tất cả các loại hàng hóa',
  },
  {
    id: 2,
    name: 'Điểm quyên góp TP.HCM',
    address: '456 Nguyễn Huệ, Quận 1, TP.HCM',
    phone: '028-9876-5432',
    email: 'hcm@relief.org',
    opening_hours: '7:00 - 19:00 hàng ngày',
    distance: 10,
    notes: 'Ưu tiên nhận thực phẩm và nước sạch',
  },
  {
    id: 3,
    name: 'Điểm quyên góp Đà Nẵng',
    address: '789 Lê Duẩn, Hải Châu, Đà Nẵng',
    phone: '0236-5555-6666',
    email: 'danang@relief.org',
    opening_hours: '8:00 - 17:00 hàng ngày',
    distance: 15,
    notes: 'Nhận quyên góp quần áo và vật dụng y tế',
  },
  {
    id: 4,
    name: 'Điểm quyên góp Cần Thơ',
    address: '321 Nguyễn Văn Cừ, Ninh Kiều, Cần Thơ',
    phone: '0292-3333-4444',
    email: 'cantho@relief.org',
    opening_hours: '7:30 - 18:30 hàng ngày',
    distance: 8,
    notes: 'Nhận tất cả loại quyên góp',
  },
  {
    id: 5,
    name: 'Điểm quyên góp Huế',
    address: '654 Trần Hưng Đạo, Phú Hội, Huế',
    phone: '0234-7777-8888',
    email: 'hue@relief.org',
    opening_hours: '8:00 - 17:00 hàng ngày',
    distance: 12,
    notes: 'Nhận quyên góp 24/7',
  },
];

export const getMockDonationLocations = (
  request: DonationRequest
): DonationResponse => {
  // Mock logic: return locations based on selected regions/products
  // If no selection, return all locations
  if (request.region_ids.length === 0 && request.product_ids.length === 0) {
    return { locations: mockDonationLocations };
  }

  // Filter locations based on selected regions (mock logic)
  // In real implementation, this would be handled by backend
  const filteredLocations = mockDonationLocations.filter((location) => {
    // Simple mock: if region_ids include 1-2, show locations 1-2
    // if region_ids include 3-5, show locations 3-5
    if (request.region_ids.length > 0) {
      if (request.region_ids.includes(1) || request.region_ids.includes(2)) {
        return location.id === 1 || location.id === 2;
      }
      if (request.region_ids.includes(3) || request.region_ids.includes(4) || request.region_ids.includes(5)) {
        return location.id === 3 || location.id === 4 || location.id === 5;
      }
    }
    return true;
  });

  return { locations: filteredLocations.length > 0 ? filteredLocations : mockDonationLocations };
};

