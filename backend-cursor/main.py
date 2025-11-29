from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import database
import os
import json
import re
import math
from groq import Groq
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
    AIDonationRequest,
    AIDonationResponse,
    SuggestedItemResponse,
)

app = FastAPI(title="Relief Coordination API", version="1.0.0")


# ============================================
# GEOLOCATION UTILS
# ============================================

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate distance between two GPS coordinates using Haversine formula.
    Returns distance in kilometers.
    """
    # Radius of Earth in kilometers
    R = 6371.0
    
    # Convert degrees to radians
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)
    
    # Differences
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    
    # Haversine formula
    a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    distance = R * c
    return round(distance, 2)


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


# Initialize Groq AI client (optional, will fallback to rule-based if no API key)
groq_client = None
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if GROQ_API_KEY:
    groq_client = Groq(api_key=GROQ_API_KEY)
    print("✅ Groq AI enabled")
else:
    print("ℹ️  Using rule-based suggestions (no AI API key)")


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
                    image_url=region.image_url,
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
async def get_region_detail(
    region_id: int, 
    user_latitude: Optional[float] = None,
    user_longitude: Optional[float] = None,
    db: Session = Depends(database.get_db)
):
    """Get region detail with tags, items, and providers (with optional user location for distance calculation)"""
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
    
    # Calculate distance from user to providers if user location is provided
    providers = []
    for pr, p in provider_regions_query:
        provider_distance = None
        if (user_latitude is not None and 
            user_longitude is not None and
            p.latitude is not None and 
            p.longitude is not None):
            provider_distance = calculate_distance(
                user_latitude, 
                user_longitude,
                p.latitude,
                p.longitude
            )
        
        providers.append(
            ProviderRegionResponse(
                provider_id=pr.provider_id,
                region_id=pr.region_id,
                distance=pr.distance,  # Original distance (from provider_regions table)
                shipping_estimate=pr.shipping_estimate,
                provider=ProviderResponse(
                    id=p.id,
                    name=p.name,
                    location=p.location,
                    capacity=p.capacity,
                    latitude=p.latitude,
                    longitude=p.longitude,
                    distance=provider_distance  # Distance from user
                )
            )
        )
    
    # Sort providers by distance from user if calculated
    if user_latitude is not None and user_longitude is not None:
        providers.sort(key=lambda x: x.provider.distance if x.provider.distance is not None else float('inf'))
    
    # Convert tags
    tags = [
        TagResponse(id=tag.id, name=tag.name, category=tag.category)
        for tag in region_tags
    ]
    
    return RegionDetailResponse(
        id=region.id,
        name=region.name,
        description=region.description,
        image_url=region.image_url,
        tags=tags,
        items=region_items,
        providers=providers
    )


@app.get("/api/regions/{region_id}/suggestions", response_model=SuggestionResponse)
async def get_region_suggestions(
    region_id: int,
    user_latitude: Optional[float] = None,
    user_longitude: Optional[float] = None,
    db: Session = Depends(database.get_db)
):
    """Get suggestions for a specific region (with optional user location for distance calculation)"""
    region = db.query(database.Region).filter(database.Region.id == region_id).first()
    if not region:
        raise HTTPException(status_code=404, detail="Region not found")
    
    # Get region detail (reuse the logic, now with user location)
    region_detail = await get_region_detail(region_id, user_latitude, user_longitude, db)
    
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


@app.post("/api/donations/ai", response_model=AIDonationResponse)
async def ai_donation_suggestion(
    request: AIDonationRequest,
    db: Session = Depends(database.get_db)
):
    """
    AI-powered donation suggestion endpoint.
    Takes region_id and optional item_ids, returns AI-suggested items and donation locations.
    """
    # Get region info
    region = db.query(database.Region).filter(database.Region.id == request.region_id).first()
    if not region:
        raise HTTPException(status_code=404, detail="Region not found")
    
    # Get region tags
    region_tags = db.query(database.Tag).join(
        database.RegionTag, database.Tag.id == database.RegionTag.tag_id
    ).filter(database.RegionTag.region_id == request.region_id).all()
    
    # Get all items for this region with priority scores
    region_items = db.query(database.RegionItem).filter(
        database.RegionItem.region_id == request.region_id
    ).all()
    
    # Get item details
    all_items = db.query(database.Item).all()
    item_map = {item.id: item for item in all_items}
    
    # Get user-selected items if any
    selected_items = []
    if request.item_ids:
        selected_items = [item_map.get(item_id) for item_id in request.item_ids if item_id in item_map]
    
    # Prepare context for AI
    context = {
        "region_name": region.name,
        "region_description": region.description,
        "tags": [{"name": tag.name, "category": tag.category} for tag in region_tags],
        "priority_items": [
            {
                "name": item_map[ri.item_id].name if ri.item_id in item_map else "Unknown",
                "priority": ri.priority_score,
                "category": item_map[ri.item_id].category if ri.item_id in item_map else "Unknown"
            }
            for ri in region_items
        ],
        "user_selected_items": [{"name": item.name, "category": item.category} for item in selected_items]
    }
    
    # Generate AI suggestions
    if groq_client:
        suggested_items = await generate_ai_suggestions(context, region_items, item_map)
        ai_message = await generate_ai_message(context, selected_items)
    else:
        # Fallback: rule-based suggestions
        suggested_items = generate_rule_based_suggestions(region_items, item_map)
        ai_message = f"Cảm ơn bạn đã muốn quyên góp cho {region.name}. Dưới đây là các món đồ được ưu tiên cao nhất."
    
    # Get donation locations for this region
    locations = db.query(database.DonationLocation).filter(
        database.DonationLocation.region_id == request.region_id
    ).all()
    
    # Calculate distance if user location is provided
    location_responses = []
    for loc in locations:
        distance = None
        if (request.user_latitude is not None and 
            request.user_longitude is not None and
            loc.latitude is not None and 
            loc.longitude is not None):
            distance = calculate_distance(
                request.user_latitude, 
                request.user_longitude,
                loc.latitude,
                loc.longitude
            )
        
        location_responses.append(
            DonationLocationResponse(
                id=loc.id,
                name=loc.name,
                address=loc.address,
                phone=loc.phone,
                email=loc.email,
                opening_hours=loc.opening_hours,
                latitude=loc.latitude,
                longitude=loc.longitude,
                distance=distance,
                notes=None
            )
        )
    
    # Sort by distance if calculated (closest first)
    if request.user_latitude is not None and request.user_longitude is not None:
        location_responses.sort(key=lambda x: x.distance if x.distance is not None else float('inf'))
    
    return AIDonationResponse(
        region_name=region.name,
        suggested_items=suggested_items,
        donation_locations=location_responses,
        ai_message=ai_message
    )


async def generate_ai_suggestions(context: dict, region_items: list, item_map: dict) -> List[SuggestedItemResponse]:
    """Generate AI-powered suggestions using Groq or Claude"""
    
    # Build detailed prompt with database data
    items_info = "\n".join([
        f"  - {item['name']} (Priority: {item['priority']*100:.0f}%, Category: {item['category']})"
        for item in context['priority_items']
    ])
    
    prompt = f"""Bạn là trợ lý AI phân tích dữ liệu cứu trợ thiên tai. Hãy đọc dữ liệu từ database và đưa ra gợi ý thông minh.

📊 DỮ LIỆU TỪ DATABASE:

Khu vực: {context['region_name']}
Mô tả: {context['region_description']}

Nhu cầu chính (từ tags):
{', '.join([f"{tag['name']} ({tag['category']})" for tag in context['tags']])}

Các món đồ có sẵn với mức độ ưu tiên:
{items_info}

Người dùng đã chọn: {', '.join([item['name'] for item in context['user_selected_items']]) if context['user_selected_items'] else 'Chưa chọn món nào'}

🎯 NHIỆM VỤ:
Dựa vào dữ liệu trên, phân tích và chọn 3-5 món đồ THIẾT YẾU NHẤT cần quyên góp cho khu vực này. 
Giải thích ngắn gọn (1 câu) tại sao món đó quan trọng dựa vào:
- Mức độ ưu tiên trong database
- Nhu cầu của khu vực  
- Tình hình thực tế

Trả về JSON format (chỉ JSON, không text khác):
[
  {{"item_name": "tên chính xác món đồ", "reason": "lý do cụ thể dựa trên data"}}
]
"""
    
    try:
        response_text = None
        
        # Use Groq AI
        if groq_client:
            completion = groq_client.chat.completions.create(
                model="llama-3.1-70b-versatile",
                messages=[
                    {
                        "role": "system", 
                        "content": "Bạn là AI phân tích dữ liệu cứu trợ. Trả về JSON format chính xác."
                    },
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1024,
            )
            response_text = completion.choices[0].message.content
            print(f"✅ Groq AI analyzed database and suggested items")
        
        if response_text:
            # Extract JSON from response
            json_match = re.search(r'\[.*\]', response_text, re.DOTALL)
            if json_match:
                ai_suggestions = json.loads(json_match.group())
                
                # Match AI suggestions with actual database items
                result = []
                for suggestion in ai_suggestions[:5]:
                    # Find matching item in database
                    for ri in region_items:
                        item = item_map.get(ri.item_id)
                        if item:
                            # Flexible matching
                            if (suggestion['item_name'].lower() in item.name.lower() or 
                                item.name.lower() in suggestion['item_name'].lower()):
                                result.append(SuggestedItemResponse(
                                    item=ItemResponse(
                                        id=item.id,
                                        name=item.name,
                                        description=item.description,
                                        category=item.category
                                    ),
                                    priority_score=ri.priority_score,
                                    reason=suggestion['reason']
                                ))
                                break
                
                if result:
                    return result
                    
    except Exception as e:
        print(f"❌ AI error: {e}")
    
    # Fallback to rule-based
    print("ℹ️  Falling back to rule-based suggestions")
    return generate_rule_based_suggestions(region_items, item_map)


async def generate_ai_message(context: dict, selected_items: list) -> str:
    """Generate personalized AI message"""
    if not groq_client:
        return f"Cảm ơn bạn đã muốn quyên góp cho {context['region_name']}!"
    
    prompt = f"""Viết tin nhắn ngắn (2-3 câu) cảm ơn người dùng quyên góp cho {context['region_name']}.

Nhu cầu: {', '.join([tag['name'] for tag in context['tags']])}
Người dùng chọn: {', '.join([item['name'] for item in context['user_selected_items']]) if context['user_selected_items'] else 'chưa chọn cụ thể'}

Viết tin nhắn ấm áp, động viên. Chỉ trả về tin nhắn, không giải thích thêm."""
    
    try:
        if groq_client:
            completion = groq_client.chat.completions.create(
                model="llama-3.1-70b-versatile",
                messages=[
                    {"role": "system", "content": "Bạn là trợ lý cứu trợ. Viết tin nhắn ngắn gọn, ấm áp."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.8,
                max_tokens=200,
            )
            return completion.choices[0].message.content.strip()
    except Exception as e:
        print(f"AI message error: {e}")
        
    return f"Cảm ơn bạn đã muốn quyên góp cho {context['region_name']}. Những món đồ bạn mang đến sẽ rất có ý nghĩa!"


def generate_rule_based_suggestions(region_items: list, item_map: dict) -> List[SuggestedItemResponse]:
    """Fallback rule-based suggestions when AI is not available"""
    sorted_items = sorted(region_items, key=lambda x: x.priority_score, reverse=True)[:5]
    
    reasons = {
        0.95: "Mức độ ưu tiên cao nhất - Cực kỳ cần thiết",
        0.90: "Mức độ ưu tiên rất cao - Rất cần thiết",
        0.85: "Mức độ ưu tiên cao - Cần thiết",
        0.80: "Mức độ quan trọng - Nên có",
        0.70: "Hỗ trợ tốt - Bổ sung tốt"
    }
    
    result = []
    for ri in sorted_items:
        item = item_map.get(ri.item_id)
        if item:
            # Find closest priority level
            reason = reasons.get(ri.priority_score, f"Độ ưu tiên: {ri.priority_score*100:.0f}%")
            result.append(SuggestedItemResponse(
                item=ItemResponse(
                    id=item.id,
                    name=item.name,
                    description=item.description,
                    category=item.category
                ),
                priority_score=ri.priority_score,
                reason=reason
            ))
    
    return result


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

