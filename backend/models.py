from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean, ForeignKey, Date, Time
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(20))
    address = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    bookings = relationship("Booking", back_populates="customer")

class ServiceProvider(Base):
    __tablename__ = "service_providers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(20))
    service_type = Column(String(50))
    hourly_rate = Column(Float)
    is_available = Column(Boolean, default=True)
    rating = Column(Float, default=5.0)

    bookings = relationship("Booking", back_populates="provider")

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)
    provider_id = Column(Integer, ForeignKey("service_providers.id"), nullable=False)
    service_date = Column(Date, nullable=False)
    service_time = Column(Time, nullable=False)
    duration_hours = Column(Integer, default=2)
    total_cost = Column(Float)
    status = Column(String(20), default="Pending")
    special_instructions = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    customer = relationship("Customer", back_populates="customer") # Typo fix: back_populates="bookings" refers to the attribute on Booking side? No, relationship on Customer side is 'bookings'.
    # On Customer model: bookings = relationship("Booking", back_populates="customer")
    # On Booking model: customer = relationship("Customer", back_populates="bookings")
    
    # Wait, let's double check sqlalchemy semantics.
    # Customer.bookings -> list of Booking
    # Booking.customer -> single Customer
    
    customer = relationship("Customer", back_populates="bookings")
    provider = relationship("ServiceProvider", back_populates="bookings")
