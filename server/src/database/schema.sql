CREATE DATABASE IF NOT EXISTS healthchain;

USE healthchain;

CREATE TABLE IF NOT EXISTS patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    sex VARCHAR(10) NOT NULL,
    bloodPressure INT NOT NULL,
    cholesterol INT NOT NULL,
    glucose INT NOT NULL,
    bmi FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS predictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    diabetes_prob FLOAT NOT NULL,
    diabetes_risk VARCHAR(50) NOT NULL,
    cvd_prob FLOAT NOT NULL,
    cvd_risk VARCHAR(50) NOT NULL,
    ckd_prob FLOAT NOT NULL,
    ckd_risk VARCHAR(50) NOT NULL,
    recommendations JSON,
    patient_summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

CREATE TABLE IF NOT EXISTS blockchain_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    report TEXT NOT NULL,
    report_hash VARCHAR(255) NOT NULL,
    blockchain_tx_hash VARCHAR(255) NOT NULL,
    blockchain_block_number INT NOT NULL,
    verification_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

CREATE TABLE IF NOT EXISTS verification_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    record_id INT NOT NULL,
    status VARCHAR(255) NOT NULL,
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (record_id) REFERENCES blockchain_records(id)
);

CREATE TABLE IF NOT EXISTS whatsapp_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    from_number VARCHAR(50),
    to_number VARCHAR(50),
    message_body TEXT,
    direction VARCHAR(10), -- 'inbound' or 'outbound'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
