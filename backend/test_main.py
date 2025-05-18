from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import pytest
from datetime import datetime, timedelta

from .main import app
from .database import Base, get_db
from . import models, schemas
from .auth import create_access_token

# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture
def test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def test_create_user(test_db):
    response = client.post(
        "/users/",
        json={
            "email": "test@example.com",
            "password": "testpassword",
            "full_name": "Test User"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["full_name"] == "Test User"
    assert "id" in data

def test_create_bill(test_db):
    # First create a user
    user_response = client.post(
        "/users/",
        json={
            "email": "test@example.com",
            "password": "testpassword",
            "full_name": "Test User"
        }
    )
    user_data = user_response.json()
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user_data["email"]},
        expires_delta=timedelta(minutes=15)
    )
    
    # Create a bill
    bill_data = {
        "title": "Test Bill",
        "description": "Test Description",
        "amount": 100.0,
        "due_date": (datetime.now() + timedelta(days=7)).isoformat(),
        "category": "Utilities"
    }
    
    response = client.post(
        "/bills/",
        json=bill_data,
        headers={"Authorization": f"Bearer {access_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == bill_data["title"]
    assert data["amount"] == bill_data["amount"]
    assert data["category"] == bill_data["category"]

def test_get_bills(test_db):
    # First create a user
    user_response = client.post(
        "/users/",
        json={
            "email": "test@example.com",
            "password": "testpassword",
            "full_name": "Test User"
        }
    )
    user_data = user_response.json()
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user_data["email"]},
        expires_delta=timedelta(minutes=15)
    )
    
    # Create a bill
    bill_data = {
        "title": "Test Bill",
        "description": "Test Description",
        "amount": 100.0,
        "due_date": (datetime.now() + timedelta(days=7)).isoformat(),
        "category": "Utilities"
    }
    
    client.post(
        "/bills/",
        json=bill_data,
        headers={"Authorization": f"Bearer {access_token}"}
    )
    
    # Get bills
    response = client.get(
        "/bills/",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["title"] == bill_data["title"] 