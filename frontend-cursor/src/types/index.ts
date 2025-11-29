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

