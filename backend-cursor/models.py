from pydantic import BaseModel
from typing import List, Optional


class RegionResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    
    class Config:
        from_attributes = True


class ProductResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    
    class Config:
        from_attributes = True


class DonationLocationResponse(BaseModel):
    id: int
    region_id: int
    name: str
    address: str
    phone: Optional[str] = None
    email: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    opening_hours: Optional[str] = None
    
    class Config:
        from_attributes = True


class DonationRequest(BaseModel):
    region_ids: List[int] = []
    product_ids: List[int] = []


class DonationResponse(BaseModel):
    locations: List[DonationLocationResponse]

