import hashlib
from sqlalchemy.orm import Session
from . import models, blockchain_service
import json

async def create_record(db: Session, patient_id: int, report: str):
    report_hash = hashlib.sha256(report.encode()).hexdigest()
    
    tx_hash = "unavailable"
    block_num = 0
    
    try:
        chain_result = await blockchain_service.store_record_hash(report_hash)
        tx_hash = chain_result['transactionHash']
        block_num = chain_result['blockNumber']
    except Exception as e:
        print(f"Blockchain Error: {e}")

    db_record = models.BlockchainRecord(
        patient_id=patient_id,
        report=report,
        report_hash=report_hash,
        blockchain_tx_hash=tx_hash,
        blockchain_block_number=block_num,
        verification_status="pending"
    )
    
    db.add(db_record)
    db.commit()
    db.refresh(db_record)
    
    # Log initial creation
    log = models.VerificationLog(record_id=db_record.id, status="Created")
    db.add(log)
    db.commit()
    
    return db_record

async def get_records(db: Session):
    return db.query(models.BlockchainRecord).order_by(models.BlockchainRecord.created_at.desc()).all()

async def verify_record(db: Session, record_id: int):
    record = db.query(models.BlockchainRecord).filter(models.BlockchainRecord.id == record_id).first()
    if not record:
        return None
        
    is_verified = await blockchain_service.verify_record_hash(record.report_hash, record.blockchain_tx_hash)
    status = "verified" if is_verified else "failed"
    
    record.verification_status = status
    db.commit()
    
    log = models.VerificationLog(record_id=record.id, status=f"Verification {status}")
    db.add(log)
    db.commit()
    
    return {"recordId": record_id, "verification_status": status, "isVerified": is_verified}
