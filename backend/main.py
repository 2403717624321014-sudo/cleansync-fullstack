from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, SessionLocal
import models
from schemas import (
    CustomerCreate, CustomerResponse,
    ProviderCreate, ProviderUpdate, ProviderResponse,
    BookingCreate, BookingResponse
)
from crud import (
    create_customer, get_customers, get_customer_by_id, delete_customer, update_customer,
    get_providers, get_provider_by_id, create_provider, update_provider, delete_provider,
    get_bookings, get_booking_by_id, create_booking, update_booking_status,
    cancel_booking as cancel_booking_crud
)


from typing import List, Optional
from datetime import date

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "CleanSync backend is running"}

# --- Customers ---

@app.post("/customers", response_model=CustomerResponse)
def add_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
    return create_customer(db, customer)

@app.get("/customers", response_model=List[CustomerResponse])
def list_customers(
    db: Session = Depends(get_db)
):
    return get_customers(db)

@app.get("/customers/search", response_model=List[CustomerResponse])
def search_customers_by_name(name: str, db: Session = Depends(get_db)):
    return get_customers(db, name=name)

@app.get("/customers/{customer_id}", response_model=CustomerResponse)
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = get_customer_by_id(db, customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

@app.put("/customers/{customer_id}", response_model=CustomerResponse)
def edit_customer(customer_id: int, customer: CustomerCreate, db: Session = Depends(get_db)):
    updated = update_customer(db, customer_id, customer)
    if not updated:
        raise HTTPException(status_code=404, detail="Customer not found")
    return updated

@app.delete("/customers/{customer_id}")
def remove_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = delete_customer(db, customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return {"message": "Customer deleted successfully"}

# --- Service Providers ---

@app.post("/providers", response_model=ProviderResponse)
def add_provider(provider: ProviderCreate, db: Session = Depends(get_db)):
    try:
        return create_provider(db, provider)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/providers", response_model=List[ProviderResponse])
def list_providers(
    service_type: Optional[str] = None,
    min_rating: Optional[float] = None,
    max_rate: Optional[float] = None,
    available: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    return get_providers(
        db,
        service_type=service_type,
        min_rating=min_rating,
        max_rate=max_rate,
        available=available
    )


@app.get("/providers/available", response_model=List[ProviderResponse])
def get_available_providers(db: Session = Depends(get_db)):
    return get_providers(db, available=True)

@app.get("/providers/type/{service_type}", response_model=List[ProviderResponse])
def get_providers_by_type(service_type: str, db: Session = Depends(get_db)):
    return get_providers(db, service_type=service_type)

@app.get("/providers/search", response_model=List[ProviderResponse])
def search_providers(
    min_rating: Optional[float] = None,
    max_rate: Optional[float] = None,
    db: Session = Depends(get_db)
):
    return get_providers(db, min_rating=min_rating, max_rate=max_rate)

@app.get("/providers/{provider_id}", response_model=ProviderResponse)
def get_provider(provider_id: int, db: Session = Depends(get_db)):
    provider = get_provider_by_id(db, provider_id)
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    return provider

@app.put("/providers/{provider_id}", response_model=ProviderResponse)
def edit_provider(provider_id: int, provider: ProviderUpdate, db: Session = Depends(get_db)):
    updated = update_provider(db, provider_id, provider)
    if not updated:
        raise HTTPException(status_code=404, detail="Provider not found")
    return updated

@app.delete("/providers/{provider_id}")
def remove_provider(provider_id: int, db: Session = Depends(get_db)):
    provider = delete_provider(db, provider_id)
    if not provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    return {"message": "Provider deleted successfully"}

# --- Bookings ---

@app.post("/bookings", response_model=BookingResponse)
def add_booking(booking: BookingCreate, db: Session = Depends(get_db)):
    return create_booking(db, booking)

@app.get("/bookings", response_model=List[BookingResponse])
def list_bookings(
    customer_id: Optional[int] = None,
    provider_id: Optional[int] = None,
    service_date: Optional[date] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    return get_bookings(db, customer_id=customer_id, provider_id=provider_id, service_date=service_date, status=status)

@app.get("/bookings/customer/{customer_id}", response_model=List[BookingResponse])
def get_customer_bookings(customer_id: int, db: Session = Depends(get_db)):
    return get_bookings(db, customer_id=customer_id)

@app.get("/bookings/provider/{provider_id}", response_model=List[BookingResponse])
def get_provider_bookings(provider_id: int, db: Session = Depends(get_db)):
    return get_bookings(db, provider_id=provider_id)

@app.get("/bookings/date/{service_date}", response_model=List[BookingResponse])
def get_bookings_by_date(service_date: date, db: Session = Depends(get_db)):
    return get_bookings(db, service_date=service_date)

@app.get("/bookings/status/{status}", response_model=List[BookingResponse])
def get_bookings_by_status(status: str, db: Session = Depends(get_db)):
    return get_bookings(db, status=status)

@app.get("/bookings/upcoming", response_model=List[BookingResponse])
def get_upcoming_bookings(db: Session = Depends(get_db)):
    # Simple logic: bookings from today onwards
    from datetime import date
    today = date.today()
    # This requires filtering by date >= today. 
    # Current crud.get_bookings checks equality. 
    # I'll do a quick client-side filter or update CRUD?
    # Updating CRUD is better but I didn't add >= logic there.
    # Let's just fetch all and filter in python for now, or update CRUD if easy.
    # Considering strict strict adherence to 'get_bookings' interface, I'll filter here for simplicity as I can't easily change CRUD in this same tool call safely without risking errors.
    # Actually, I can filter by date in python.
    all_bookings = get_bookings(db)
    return [b for b in all_bookings if b.service_date >= today]

@app.get("/bookings/all", response_model=List[BookingResponse])
def list_all_bookings(db: Session = Depends(get_db)):
    """Return all bookings (no filters)."""
    return get_bookings(db)

@app.get("/bookings/done", response_model=List[BookingResponse])
def list_done_bookings(db: Session = Depends(get_db)):
    """Return bookings whose status is 'Completed' (case-insensitive)."""
    all_bookings = get_bookings(db)
    return [b for b in all_bookings if getattr(b, "status", "").lower() == "completed"]

@app.get("/bookings/{booking_id}", response_model=BookingResponse)
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = get_booking_by_id(db, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking

@app.put("/bookings/{booking_id}", response_model=BookingResponse)
def update_booking_status_endpoint(booking_id: int, status: str = Query(..., description="New status"), db: Session = Depends(get_db)):
    updated = update_booking_status(db, booking_id, status)
    if not updated:
        raise HTTPException(status_code=404, detail="Booking not found")
    return updated

@app.put("/bookings/{booking_id}/cancel", response_model=BookingResponse)
def cancel_booking_endpoint(booking_id: int, db: Session = Depends(get_db)):
    booking = cancel_booking_crud(db, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return booking
