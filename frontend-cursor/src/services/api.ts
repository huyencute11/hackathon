import axios from 'axios';
import type {
  Region,
  RegionDetail,
  SuggestionResponse,
  Product,
  DonationRequest,
  DonationResponse,
  AIDonationRequest,
  AIDonationResponse,
} from '../types';
import {
  mockSuggestions,
  getMockSuggestion,
  getMockRegions,
  getMockProducts,
  getMockDonationLocations,
} from '../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true'; // Default to false - use real API

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`[API] Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('[API] Response error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

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
  getSuggestions: async (
    regionId: number,
    userLatitude?: number,
    userLongitude?: number
  ): Promise<SuggestionResponse> => {
    if (USE_MOCK_DATA) {
      await delay(600); // Simulate ML processing delay
      const mock = getMockSuggestion(regionId);
      if (mock) {
        return mock;
      }
      throw new Error('Region not found');
    }
    
    // Build query params
    const params: Record<string, string> = {};
    if (userLatitude !== undefined && userLongitude !== undefined) {
      params.user_latitude = userLatitude.toString();
      params.user_longitude = userLongitude.toString();
    }
    
    const response = await api.get<SuggestionResponse>(`/regions/${regionId}/suggestions`, { params });
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

  // AI-powered donation suggestion (NEW!)
  submitAIDonation: async (request: AIDonationRequest): Promise<AIDonationResponse> => {
    console.log('[API] AI Donation Request:', request);
    const response = await api.post<AIDonationResponse>('/donations/ai', request);
    console.log('[API] AI Response received:', response.data);
    return response.data;
  },
};

export default apiService;

