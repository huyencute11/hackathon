export interface Region {
  id: number;
  name: string;
  description: string;
}

export interface Tag {
  id: number;
  name: string;
  category: string;
}

export interface Item {
  id: number;
  name: string;
  description: string;
  category: string;
}

export interface RegionTag {
  region_id: number;
  tag_id: number;
  tag?: Tag;
}

export interface RegionItem {
  region_id: number;
  item_id: number;
  priority_score: number;
  item?: Item;
}

export interface Provider {
  id: number;
  name: string;
  location: string;
  capacity: number;
  latitude?: number;
  longitude?: number;
  distance?: number; // Distance from user in km
}

export interface ProviderRegion {
  provider_id: number;
  region_id: number;
  distance: number;
  shipping_estimate: string;
  provider?: Provider;
}

export interface RegionDetail extends Region {
  tags: Tag[];
  items: RegionItem[];
  providers: ProviderRegion[];
}

export interface SuggestionResponse {
  region: RegionDetail;
  suggested_items: RegionItem[];
  recommended_providers: ProviderRegion[];
}

export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
}

export interface DonationLocation {
  id: number;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  opening_hours?: string;
  latitude?: number;
  longitude?: number;
  distance?: number; // Distance from user in km
  notes?: string;
}

export interface DonationRequest {
  region_ids: number[];
  product_ids: number[];
}

export interface DonationResponse {
  locations: DonationLocation[];
}

// AI-powered donation types
export interface AIDonationRequest {
  region_id: number;
  item_ids?: number[];
  user_latitude?: number;
  user_longitude?: number;
}

export interface SuggestedItem {
  item: Item;
  priority_score: number;
  reason: string; // AI-generated reason
}

export interface AIDonationResponse {
  region_name: string;
  suggested_items: SuggestedItem[];
  donation_locations: DonationLocation[];
  ai_message: string; // AI-generated message
}

