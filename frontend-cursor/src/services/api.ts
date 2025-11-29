import axios from 'axios';
import type {
  Region,
  RegionDetail,
  SuggestionResponse,
  Product,
  DonationRequest,
  DonationResponse,
} from '../types';
import {
  mockSuggestions,
  getMockSuggestion,
  getMockRegions,
  getMockProducts,
  getMockDonationLocations,
} from '../data/mockData';

// In production/Docker, use relative path (nginx will proxy)
// In development, use VITE_API_URL or default to localhost:8000
const getApiBaseUrl = () => {
  if (import.meta.env.PROD) {
    // Production: use relative path, nginx will proxy to backend
    return '/api';
  }
  // Development: use environment variable or default
  return import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:8000/api';
};

const API_BASE_URL = getApiBaseUrl();
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true' || false; // Default to false in production

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const apiService = {
  // Lấy danh sách tất cả các khu vực
  getRegions: async (): Promise<Region[]> => {
    if (USE_MOCK_DATA) {
      await delay(500); // Simulate network delay
      return getMockRegions();
    }
    const response = await api.get<Region[]>('/regions');
    return response.data;
  },

  // Lấy chi tiết một khu vực với nhu cầu và gợi ý
  getRegionDetail: async (regionId: number): Promise<RegionDetail> => {
    if (USE_MOCK_DATA) {
      await delay(500);
      const mock = getMockSuggestion(regionId);
      if (mock) {
        return {
          ...mock.region,
          tags: mock.region.tags || [],
          items: mock.suggested_items || [],
          providers: mock.recommended_providers || [],
        };
      }
      throw new Error('Region not found');
    }
    const response = await api.get<RegionDetail>(`/regions/${regionId}`);
    return response.data;
  },

  // Lấy gợi ý sản phẩm cho một khu vực (từ ML Engine)
  getSuggestions: async (regionId: number): Promise<SuggestionResponse> => {
    if (USE_MOCK_DATA) {
      await delay(600); // Simulate ML processing delay
      const mock = getMockSuggestion(regionId);
      if (mock) {
        return mock;
      }
      throw new Error('Region not found');
    }
    const response = await api.get<SuggestionResponse>(`/regions/${regionId}/suggestions`);
    return response.data;
  },

  // Lấy tất cả khu vực với gợi ý (cho dashboard)
  getAllRegionsWithSuggestions: async (): Promise<SuggestionResponse[]> => {
    if (USE_MOCK_DATA) {
      await delay(800); // Simulate processing delay
      return mockSuggestions;
    }
    const response = await api.get<SuggestionResponse[]>('/regions/suggestions');
    return response.data;
  },

  // Lấy danh sách sản phẩm
  getProducts: async (): Promise<Product[]> => {
    if (USE_MOCK_DATA) {
      await delay(500);
      return getMockProducts();
    }
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  // Gửi yêu cầu quyên góp
  submitDonation: async (request: DonationRequest): Promise<DonationResponse> => {
    if (USE_MOCK_DATA) {
      await delay(1000); // Simulate processing delay
      return getMockDonationLocations(request);
    }
    const response = await api.post<DonationResponse>('/donations', request);
    return response.data;
  },
};

export default apiService;

