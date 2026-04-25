from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import uvicorn
import os
from dotenv import load_dotenv

from app import models, database
from app.services import prediction_service, record_service

load_dotenv()

# Initialize Database
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="HealthChain-AI Python Backend")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root
@app.get("/")
def read_root():
    return {"message": "HealthChain-AI Python API is running"}

# Predictions
@app.post("/api/predictions")
async def create_prediction(patient_data: dict, db: Session = Depends(database.get_db)):
    try:
        result = await prediction_service.create_prediction(db, patient_data)
        # Attempt to create blockchain record
        try:
            await record_service.create_record(db, result['id'], str(result))
        except Exception as e:
            print(f"Blockchain record creation failed: {e}")
            
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/predictions")
def get_predictions(db: Session = Depends(database.get_db)):
    return db.query(models.Prediction).all()

# Records
@app.get("/api/records")
async def get_records(db: Session = Depends(database.get_db)):
    records = await record_service.get_records(db)
    # Convert to list of dicts for JSON serialization (SQLAlchemy objects need mapping)
    return [
        {
            "id": r.id,
            "patient_id": r.patient_id,
            "report": r.report,
            "report_hash": r.report_hash,
            "blockchain_tx_hash": r.blockchain_tx_hash,
            "blockchain_block_number": r.blockchain_block_number,
            "verification_status": r.verification_status,
            "created_at": r.created_at
        } for r in records
    ]

@app.post("/api/records/verify")
async def verify_record(data: dict, db: Session = Depends(database.get_db)):
    record_id = data.get("recordId")
    if not record_id:
        raise HTTPException(status_code=400, detail="recordId is required")
    
    result = await record_service.verify_record(db, record_id)
    if not result:
        raise HTTPException(status_code=404, detail="Record not found")
    return result

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5002))
    uvicorn.run(app, host="0.0.0.0", port=port)
