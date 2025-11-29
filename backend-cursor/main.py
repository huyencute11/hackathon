from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import database
from models import (
    RegionResponse,
    RegionDetailResponse,
    ProductResponse,
    DonationLocationResponse,
    DonationRequest,
    DonationResponse,
    SuggestionResponse,
    TagResponse,
    ItemResponse,
    RegionItemResponse,
    ProviderResponse,
    ProviderRegionResponse,
)

app = FastAPI(title="Relief Coordination API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    database.init_db()


@app.get("/api/regions", response_model=List[RegionResponse])
async def get_regions(db: Session = Depends(database.get_db)):
    """Get all regions"""
    regions = db.query(database.Region).all()
    return regions


@app.get("/api/regions/suggestions", response_model=List[SuggestionResponse])
async def get_all_regions_with_suggestions(db: Session = Depends(database.get_db)):
    """Get all regions with suggestions"""
    regions = db.query(database.Region).all()
    
    # Return all regions with empty suggestions (can be enhanced later)
    return [
        SuggestionResponse(
            region=RegionDetailResponse(
                id=region.id,
                name=region.name,
                description=region.description,
                tags=[],
                items=[],
                providers=[]
            ),
            suggested_items=[],
            recommended_providers=[]
        )
        for region in regions
    ]


@app.get("/api/regions/{region_id}", response_model=RegionDetailResponse)
async def get_region_detail(region_id: int, db: Session = Depends(database.get_db)):
    """Get region detail with tags, items, and providers"""
    region = db.query(database.Region).filter(database.Region.id == region_id).first()
    if not region:
        raise HTTPException(status_code=404, detail="Region not found")
    
    # Mock data for tags, items, and providers (since we don't have these tables yet)
    return RegionDetailResponse(
        id=region.id,
        name=region.name,
        description=region.description,
        tags=[],
        items=[],
        providers=[]
    )


@app.get("/api/regions/{region_id}/suggestions", response_model=SuggestionResponse)
async def get_region_suggestions(region_id: int, db: Session = Depends(database.get_db)):
    """Get suggestions for a specific region"""
    region = db.query(database.Region).filter(database.Region.id == region_id).first()
    if not region:
        raise HTTPException(status_code=404, detail="Region not found")
    
    # Mock suggestion data
    return SuggestionResponse(
        region=RegionDetailResponse(
            id=region.id,
            name=region.name,
            description=region.description,
            tags=[],
            items=[],
            providers=[]
        ),
        suggested_items=[],
        recommended_providers=[]
    )


@app.get("/api/products", response_model=List[ProductResponse])
async def get_products(db: Session = Depends(database.get_db)):
    """Get all products"""
    products = db.query(database.Product).all()
    return products


@app.post("/api/donations", response_model=DonationResponse)
async def submit_donation(
    request: DonationRequest,
    db: Session = Depends(database.get_db)
):
    """
    Get donation locations based on selected regions and products.
    If region_ids or product_ids are empty, return all locations.
    """
    query = db.query(database.DonationLocation)
    
    # Filter by regions if provided
    if request.region_ids:
        query = query.filter(database.DonationLocation.region_id.in_(request.region_ids))
    
    # If no filters, return all locations
    locations = query.all()
    
    # Convert to response format (without region_id)
    location_responses = [
        DonationLocationResponse(
            id=loc.id,
            name=loc.name,
            address=loc.address,
            phone=loc.phone,
            email=loc.email,
            opening_hours=loc.opening_hours,
            distance=None,
            notes=None
        )
        for loc in locations
    ]
    
    return DonationResponse(locations=location_responses)


@app.get("/")
async def root():
    return {"message": "Relief Coordination API", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}

