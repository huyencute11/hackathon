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
    
    result = []
    for region in regions:
        # Get tags for this region
        region_tags = db.query(database.Tag).join(
            database.RegionTag, database.Tag.id == database.RegionTag.tag_id
        ).filter(database.RegionTag.region_id == region.id).all()
        
        # Get items with priority scores
        region_items_query = db.query(
            database.RegionItem, database.Item
        ).join(
            database.Item, database.RegionItem.item_id == database.Item.id
        ).filter(database.RegionItem.region_id == region.id).all()
        
        region_items = [
            RegionItemResponse(
                region_id=ri.region_id,
                item_id=ri.item_id,
                priority_score=ri.priority_score,
                item=ItemResponse(
                    id=item.id,
                    name=item.name,
                    description=item.description,
                    category=item.category
                )
            )
            for ri, item in region_items_query
        ]
        
        # Get providers for this region
        provider_regions_query = db.query(
            database.ProviderRegion, database.Provider
        ).join(
            database.Provider, database.ProviderRegion.provider_id == database.Provider.id
        ).filter(database.ProviderRegion.region_id == region.id).all()
        
        providers = [
            ProviderRegionResponse(
                provider_id=pr.provider_id,
                region_id=pr.region_id,
                distance=pr.distance,
                shipping_estimate=pr.shipping_estimate,
                provider=ProviderResponse(
                    id=p.id,
                    name=p.name,
                    location=p.location,
                    capacity=p.capacity
                )
            )
            for pr, p in provider_regions_query
        ]
        
        # Convert tags
        tags = [
            TagResponse(id=tag.id, name=tag.name, category=tag.category)
            for tag in region_tags
        ]
        
        result.append(
            SuggestionResponse(
                region=RegionDetailResponse(
                    id=region.id,
                    name=region.name,
                    description=region.description,
                    tags=tags,
                    items=region_items,
                    providers=providers
                ),
                suggested_items=region_items,
                recommended_providers=providers
            )
        )
    
    return result


@app.get("/api/regions/{region_id}", response_model=RegionDetailResponse)
async def get_region_detail(region_id: int, db: Session = Depends(database.get_db)):
    """Get region detail with tags, items, and providers"""
    region = db.query(database.Region).filter(database.Region.id == region_id).first()
    if not region:
        raise HTTPException(status_code=404, detail="Region not found")
    
    # Get tags for this region
    region_tags = db.query(database.Tag).join(
        database.RegionTag, database.Tag.id == database.RegionTag.tag_id
    ).filter(database.RegionTag.region_id == region.id).all()
    
    # Get items with priority scores
    region_items_query = db.query(
        database.RegionItem, database.Item
    ).join(
        database.Item, database.RegionItem.item_id == database.Item.id
    ).filter(database.RegionItem.region_id == region.id).all()
    
    region_items = [
        RegionItemResponse(
            region_id=ri.region_id,
            item_id=ri.item_id,
            priority_score=ri.priority_score,
            item=ItemResponse(
                id=item.id,
                name=item.name,
                description=item.description,
                category=item.category
            )
        )
        for ri, item in region_items_query
    ]
    
    # Get providers for this region
    provider_regions_query = db.query(
        database.ProviderRegion, database.Provider
    ).join(
        database.Provider, database.ProviderRegion.provider_id == database.Provider.id
    ).filter(database.ProviderRegion.region_id == region.id).all()
    
    providers = [
        ProviderRegionResponse(
            provider_id=pr.provider_id,
            region_id=pr.region_id,
            distance=pr.distance,
            shipping_estimate=pr.shipping_estimate,
            provider=ProviderResponse(
                id=p.id,
                name=p.name,
                location=p.location,
                capacity=p.capacity
            )
        )
        for pr, p in provider_regions_query
    ]
    
    # Convert tags
    tags = [
        TagResponse(id=tag.id, name=tag.name, category=tag.category)
        for tag in region_tags
    ]
    
    return RegionDetailResponse(
        id=region.id,
        name=region.name,
        description=region.description,
        tags=tags,
        items=region_items,
        providers=providers
    )


@app.get("/api/regions/{region_id}/suggestions", response_model=SuggestionResponse)
async def get_region_suggestions(region_id: int, db: Session = Depends(database.get_db)):
    """Get suggestions for a specific region"""
    region = db.query(database.Region).filter(database.Region.id == region_id).first()
    if not region:
        raise HTTPException(status_code=404, detail="Region not found")
    
    # Get region detail (reuse the logic)
    region_detail = await get_region_detail(region_id, db)
    
    return SuggestionResponse(
        region=region_detail,
        suggested_items=region_detail.items,
        recommended_providers=region_detail.providers
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

