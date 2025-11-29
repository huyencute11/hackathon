import type { SuggestionResponse, Region, Tag, Item, RegionItem, Provider, ProviderRegion } from '../types';

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

