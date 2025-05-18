from sqlalchemy.orm import Session
from . import models, schemas, auth
from datetime import datetime

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_bill(db: Session, bill_id: int):
    return db.query(models.Bill).filter(models.Bill.id == bill_id).first()

def get_user_bills(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Bill).filter(
        models.Bill.user_id == user_id
    ).offset(skip).limit(limit).all()

def create_bill(db: Session, bill: schemas.BillCreate, user_id: int):
    db_bill = models.Bill(**bill.dict(), user_id=user_id)
    db.add(db_bill)
    db.commit()
    db.refresh(db_bill)
    return db_bill

def update_bill_status(db: Session, bill_id: int, status: models.BillStatus):
    db_bill = get_bill(db, bill_id)
    if db_bill:
        db_bill.status = status
        db.commit()
        db.refresh(db_bill)
    return db_bill

def delete_bill(db: Session, bill_id: int):
    db_bill = get_bill(db, bill_id)
    if db_bill:
        db.delete(db_bill)
        db.commit()
    return db_bill 