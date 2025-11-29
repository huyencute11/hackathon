from pydantic import BaseModel
from typing import List, Optional


class RegionResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    
    class Config:
        from_attributes = True


class TagResponse(BaseModel):
    id: int
    name: str
    category: str


class ItemResponse(BaseModel):
    id: int
    name: str
    description: str
    category: str


class RegionItemResponse(BaseModel):
    region_id: int
    item_id: int
    priority_score: float
    item: Optional[ItemResponse] = None


class ProviderResponse(BaseModel):
    id: int
    name: str
    location: str
    capacity: int
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    distance: Optional[float] = None  # Distance from user in km


class ProviderRegionResponse(BaseModel):
    provider_id: int
    region_id: int
    distance: float
    shipping_estimate: str
    provider: Optional[ProviderResponse] = None


class RegionDetailResponse(RegionResponse):
    tags: List[TagResponse] = []
    items: List[RegionItemResponse] = []
    providers: List[ProviderRegionResponse] = []


class SuggestionResponse(BaseModel):
    region: RegionDetailResponse
    suggested_items: List[RegionItemResponse] = []
    recommended_providers: List[ProviderRegionResponse] = []


class ProductResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    
    class Config:
        from_attributes = True


class DonationLocationResponse(BaseModel):
    id: int
    name: str
    address: str
    phone: Optional[str] = None
    email: Optional[str] = None
    opening_hours: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    distance: Optional[float] = None  # Distance from user in km
    notes: Optional[str] = None


class DonationRequest(BaseModel):
    region_ids: List[int] = []
    product_ids: List[int] = []


# New AI-powered donation request
class AIDonationRequest(BaseModel):
    region_id: int
    item_ids: List[int] = []
    user_latitude: Optional[float] = None
    user_longitude: Optional[float] = None  # Optional: items user wants to donate


class SuggestedItemResponse(BaseModel):
    item: ItemResponse
    priority_score: float
    reason: str  # AI-generated reason why this item is needed


class AIDonationResponse(BaseModel):
    region_name: str
    suggested_items: List[SuggestedItemResponse]
    donation_locations: List[DonationLocationResponse]
    ai_message: str  # AI-generated message about the donation


class DonationResponse(BaseModel):
    locations: List[DonationLocationResponse]

