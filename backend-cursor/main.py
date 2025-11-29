from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import database
from models import (
    RegionResponse,
    ProductResponse,
    DonationLocationResponse,
    DonationRequest,
    DonationResponse
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


@app.get("/api/products", response_model=List[ProductResponse])
async def get_products(db: Session = Depends(database.get_db)):
    """Get all products"""
    products = db.query(database.Product).all()
    return products


@app.post("/api/donation-locations", response_model=DonationResponse)
async def get_donation_locations(
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
    
    return DonationResponse(locations=locations)


@app.get("/")
async def root():
    return {"message": "Relief Coordination API", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}

