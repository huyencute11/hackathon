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
    distance: Optional[float] = None
    notes: Optional[str] = None


class DonationRequest(BaseModel):
    region_ids: List[int] = []
    product_ids: List[int] = []


class DonationResponse(BaseModel):
    locations: List[DonationLocationResponse]

