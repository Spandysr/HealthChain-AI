import google.generativeai as genai
import os
import json
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from . import models

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash')

def simulate_prediction(data):
    # Fallback mock logic
    diabetes_score = (data['glucose'] / 200) + (data['bmi'] / 40) - (data['age'] / 100)
    cvd_score = (data['bloodPressure'] / 180) + (data['cholesterol'] / 300) - (data['age'] / 100)
    ckd_score = (data['bloodPressure'] / 180) + (data['glucose'] / 200) - (data['age'] / 100)

    def get_risk(score):
        if score < 0.3: return 'Low'
        if score < 0.6: return 'Medium'
        if score < 0.8: return 'High'
        return 'Critical'

    return {
        "diabetes": {"probability": max(0, min(1, diabetes_score)), "risk": get_risk(diabetes_score)},
        "cardiovascularDisease": {"probability": max(0, min(1, cvd_score)), "risk": get_risk(cvd_score)},
        "chronicKidneyDisease": {"probability": max(0, min(1, ckd_score)), "risk": get_risk(ckd_score)},
        "recommendations": {
            "nextActions": "Consult with a primary care physician for a detailed check-up.",
            "dietaryAdvice": "Consider a balanced diet low in processed sugars and saturated fats.",
            "doctorVisit": "A doctor's visit is recommended within the next month."
        },
        "patientSummary": "Based on simulated logic, moderate risk factors are detected.",
        "accuracy_conclusion": "Simulated analysis based on statistical averages.",
        "confidence_level": 0.75
    }

async def create_prediction(db: Session, patient_data: dict):
    prompt = f"""
    Analyze the following patient health parameters for risk of Diabetes, Cardiovascular Disease (CVD), and Chronic Kidney Disease (CKD):
    Patient Name: {patient_data['name']}
    Age: {patient_data['age']}
    Sex: {patient_data['sex']}
    Blood Pressure: {patient_data['bloodPressure']} mmHg
    Cholesterol: {patient_data['cholesterol']} mg/dL
    Glucose: {patient_data['glucose']} mg/dL
    BMI: {patient_data['bmi']}

    Provide a JSON response ONLY with the following structure:
    {{
        "diabetes": {{"probability": float (0-1), "risk": "Low" | "Medium" | "High" | "Critical"}},
        "cardiovascularDisease": {{"probability": float (0-1), "risk": "Low" | "Medium" | "High" | "Critical"}},
        "chronicKidneyDisease": {{"probability": float (0-1), "risk": "Low" | "Medium" | "High" | "Critical"}},
        "recommendations": {{
            "nextActions": "string",
            "dietaryAdvice": "string",
            "doctorVisit": "string"
        }},
        "patientSummary": "detailed text summary",
        "accuracy_conclusion": "detailed conclusion about the accuracy of this prediction",
        "confidence_level": float (0-1)
    }}
    """
    
    try:
        response = model.generate_content(prompt)
        res_text = response.text
        if "```json" in res_text:
            res_text = res_text.split("```json")[1].split("```")[0].strip()
        elif "```" in res_text:
            res_text = res_text.split("```")[1].split("```")[0].strip()
        prediction = json.loads(res_text)
    except Exception as e:
        print(f"Gemini API Error: {e}")
        prediction = simulate_prediction(patient_data)

    # 1. Handle Patient
    db_patient = db.query(models.Patient).filter(models.Patient.name == patient_data['name'], models.Patient.age == patient_data['age']).first()
    if not db_patient:
        db_patient = models.Patient(**patient_data)
        db.add(db_patient)
        db.commit()
        db.refresh(db_patient)

    # 2. Store Prediction
    db_prediction = models.Prediction(
        patient_id=db_patient.id,
        diabetes_prob=prediction['diabetes']['probability'],
        diabetes_risk=prediction['diabetes']['risk'],
        cvd_prob=prediction['cardiovascularDisease']['probability'],
        cvd_risk=prediction['cardiovascularDisease']['risk'],
        ckd_prob=prediction['chronicKidneyDisease']['probability'],
        ckd_risk=prediction['chronicKidneyDisease']['risk'],
        recommendations=prediction['recommendations'],
        patient_summary=prediction['patientSummary'],
        accuracy_conclusion=prediction['accuracy_conclusion'],
        confidence_level=prediction['confidence_level']
    )
    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)

    return {
        "id": db_prediction.id,
        **prediction
    }
