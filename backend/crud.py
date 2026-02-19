from sqlalchemy.orm import Session
from models import Customer, ServiceProvider, Booking
from schemas import CustomerCreate, ProviderCreate, ProviderUpdate, BookingCreate
from datetime import date

# Customer CRUD
def create_customer(db: Session, customer: CustomerCreate):
    db_customer = Customer(
        name=customer.name,
        email=customer.email,
        phone=customer.phone,
        address=customer.address
    )
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

def get_customer_by_id(db: Session, customer_id: int):
    return db.query(Customer).filter(Customer.id == customer_id).first()

def get_customers(db: Session, skip: int = 0, limit: int = 100, name: str = None):
    query = db.query(Customer)
    if name:
        query = query.filter(Customer.name.ilike(f"%{name}%"))
    return query.offset(skip).limit(limit).all()

def delete_customer(db: Session, customer_id: int):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if customer:
        db.delete(customer)
        db.commit()
    return customer

def update_customer(db: Session, customer_id: int, customer_data: CustomerCreate):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        return None

    customer.name = customer_data.name
    customer.email = customer_data.email
    customer.phone = customer_data.phone
    customer.address = customer_data.address

    db.commit()
    db.refresh(customer)
    return customer

# Service Provider CRUD
def get_providers(db: Session, skip: int = 0, limit: int = 100, 
                  service_type: str = None, min_rating: float = None, 
                  max_rate: float = None, available: bool = None):
    query = db.query(ServiceProvider)
    if service_type:
        query = query.filter(ServiceProvider.service_type == service_type)
    if min_rating:
        query = query.filter(ServiceProvider.rating >= min_rating)
    if max_rate:
        query = query.filter(ServiceProvider.hourly_rate <= max_rate)
    if available is not None:
        query = query.filter(ServiceProvider.is_available == available)
    return query.offset(skip).limit(limit).all()

def get_provider_by_id(db: Session, provider_id: int):
    return db.query(ServiceProvider).filter(ServiceProvider.id == provider_id).first()

def create_provider(db: Session, provider: ProviderCreate):
    db_provider = ServiceProvider(**provider.dict())
    db.add(db_provider)
    db.commit()
    db.refresh(db_provider)
    return db_provider

def update_provider(db: Session, provider_id: int, provider: ProviderUpdate):
    db_provider = db.query(ServiceProvider).filter(ServiceProvider.id == provider_id).first()
    if db_provider:
        update_data = provider.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_provider, key, value)
        db.commit()
        db.refresh(db_provider)
    return db_provider

def delete_provider(db: Session, provider_id: int):
    db_provider = db.query(ServiceProvider).filter(ServiceProvider.id == provider_id).first()
    if db_provider:
        db.delete(db_provider)
        db.commit()
    return db_provider

# Booking CRUD
def get_bookings(db: Session, skip: int = 0, limit: int = 100,
                 customer_id: int = None, provider_id: int = None,
                 service_date: date = None, status: str = None):
    query = db.query(Booking)
    if customer_id:
        query = query.filter(Booking.customer_id == customer_id)
    if provider_id:
        query = query.filter(Booking.provider_id == provider_id)
    if service_date:
        query = query.filter(Booking.service_date == service_date)
    if status:
        query = query.filter(Booking.status == status)
    return query.offset(skip).limit(limit).all()

def get_booking_by_id(db: Session, booking_id: int):
    return db.query(Booking).filter(Booking.id == booking_id).first()

def create_booking(db: Session, booking: BookingCreate):
    provider = get_provider_by_id(db, booking.provider_id)
    total_cost = 0.0
    if provider and provider.hourly_rate:
        total_cost = provider.hourly_rate * booking.duration_hours
    
    db_booking = Booking(**booking.dict(), total_cost=total_cost)
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

def update_booking_status(db: Session, booking_id: int, status: str):
    db_booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if db_booking:
        db_booking.status = status
        db.commit()
        db.refresh(db_booking)
    return db_booking


def cancel_booking(db: Session, booking_id: int):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if booking:
        booking.status = "Cancelled"
        db.commit()
        db.refresh(booking)
    return booking
