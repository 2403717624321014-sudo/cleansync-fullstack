from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date, time

class CustomerBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerResponse(CustomerBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class ProviderBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    service_type: Optional[str] = None
    hourly_rate: Optional[float] = None
    is_available: Optional[bool] = True
    rating: Optional[float] = 5.0

class ProviderCreate(ProviderBase):
    pass

class ProviderUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    service_type: Optional[str] = None
    hourly_rate: Optional[float] = None
    is_available: Optional[bool] = None
    rating: Optional[float] = None

class ProviderResponse(ProviderBase):
    id: int
    rating: float

    class Config:
        from_attributes = True

class BookingBase(BaseModel):
    customer_id: int
    provider_id: int
    service_date: date
    service_time: time
    duration_hours: int = 2
    special_instructions: Optional[str] = None

class BookingCreate(BookingBase):
    pass

class BookingResponse(BookingBase):
    id: int
    total_cost: Optional[float]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
