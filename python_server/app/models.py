from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, TIMESTAMP, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Patient(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    age = Column(Integer, nullable=False)
    sex = Column(String(10), nullable=False)
    bloodPressure = Column(Integer, nullable=False)
    cholesterol = Column(Integer, nullable=False)
    glucose = Column(Integer, nullable=False)
    bmi = Column(Float, nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    predictions = relationship("Prediction", back_populates="patient")
    blockchain_records = relationship("BlockchainRecord", back_populates="patient")

class Prediction(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    diabetes_prob = Column(Float, nullable=False)
    diabetes_risk = Column(String(50), nullable=False)
    cvd_prob = Column(Float, nullable=False)
    cvd_risk = Column(String(50), nullable=False)
    ckd_prob = Column(Float, nullable=False)
    ckd_risk = Column(String(50), nullable=False)
    recommendations = Column(JSON)
    patient_summary = Column(Text)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    # New fields for accuracy and confidence
    accuracy_conclusion = Column(Text)
    confidence_level = Column(Float)

    patient = relationship("Patient", back_populates="predictions")

class BlockchainRecord(Base):
    __tablename__ = "blockchain_records"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    report = Column(Text, nullable=False)
    report_hash = Column(String(255), nullable=False)
    blockchain_tx_hash = Column(String(255), nullable=False)
    blockchain_block_number = Column(Integer, nullable=False)
    verification_status = Column(String(50), default="pending")
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)

    patient = relationship("Patient", back_populates="blockchain_records")
    logs = relationship("VerificationLog", back_populates="record")

class VerificationLog(Base):
    __tablename__ = "verification_logs"
    id = Column(Integer, primary_key=True, index=True)
    record_id = Column(Integer, ForeignKey("blockchain_records.id"), nullable=False)
    status = Column(String(255), nullable=False)
    checked_at = Column(TIMESTAMP, default=datetime.utcnow)

    record = relationship("BlockchainRecord", back_populates="logs")

class WhatsAppMessage(Base):
    __tablename__ = "whatsapp_messages"
    id = Column(Integer, primary_key=True, index=True)
    from_number = Column(String(50))
    to_number = Column(String(50))
    message_body = Column(Text)
    direction = Column(String(10)) # 'inbound' or 'outbound'
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
