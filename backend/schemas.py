from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from .models import BillStatus

class BillBase(BaseModel):
    title: str
    description: Optional[str] = None
    amount: float
    due_date: datetime
    category: str

class BillCreate(BillBase):
    pass

class Bill(BillBase):
    id: int
    status: BillStatus
    created_at: datetime
    user_id: int

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None 