import { pool } from '../database/db';
import { blockchainService } from './blockchainService';
import crypto from 'crypto';

const fallbackRecords: any[] = [
    {
        id: 1,
        patient_id: 2042,
        patient_name: 'Hema',
        report: 'Type 2 diabetes risk profile with elevated glucose and BMI.',
        report_hash: 'a8f7f9ec4a70da2f2f9a5e31f5ff93a1985fbbf2a4dce8a5d7d6f6c44bf29110',
        blockchain_tx_hash: '0x0f3f7f8a7ae5c67b6deeaec6464e705f6f8d7c2b5a3c9e1f9d0b6a11ce321001',
        blockchain_block_number: 130421,
        verification_status: 'verified',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 2,
        patient_id: 2056,
        patient_name: 'Ravi Kumar',
        report: 'Cardiovascular screening report with high cholesterol and blood pressure.',
        report_hash: '6c4ef985053ea4f4a9d55d6d68a8176208b2be634af8cf8f0f2d39f6d8fcb511',
        blockchain_tx_hash: '0x2b18edca4f1a71ab9c4e9f3c60b2f8846fc8aab229dea7145472ef7a08bd2202',
        blockchain_block_number: 130423,
        verification_status: 'pending',
        created_at: new Date(Date.now() - 90 * 60 * 1000).toISOString()
    },
    {
        id: 3,
        patient_id: 2073,
        patient_name: 'Madhu',
        report: 'Kidney function trend with glucose variability and blood pressure correlation.',
        report_hash: '4d29e32ab5ca50f0cbf5c5f1146f1d11d484f9aaf8042f8d5f07a4d85e63b9aa',
        blockchain_tx_hash: '0x8fe4a0ad17dcb246e91b78bd6c2f82444b72cdfed8f29db3ceab43e2997de303',
        blockchain_block_number: 130426,
        verification_status: 'verified',
        created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    }
];
let fallbackRecordId = fallbackRecords.length + 1;

export const getFallbackRecordsSnapshot = () => {
    return [...fallbackRecords];
};

export const recordService = {
    createRecord: async (patientId: number, report: string, patientName?: string): Promise<any> => {
        const reportHash = crypto.createHash('sha256').update(report).digest('hex');
        let transactionHash = 'unavailable';
        let blockNumber = 0;
        const createdAt = new Date();

        try {
            const chainResult = await blockchainService.storeRecordHash(reportHash);
            transactionHash = chainResult.transactionHash;
            blockNumber = chainResult.blockNumber;
        } catch (error) {
            console.error('Blockchain storage unavailable, using fallback record metadata.', error);
        }

        const record = {
            patient_id: patientId,
            report: report,
            report_hash: reportHash,
            blockchain_tx_hash: transactionHash,
            blockchain_block_number: blockNumber,
            verification_status: 'pending',
            created_at: createdAt.toISOString()
        };

        try {
            const dbRecord = {
                patient_id: record.patient_id,
                report: record.report,
                report_hash: record.report_hash,
                blockchain_tx_hash: record.blockchain_tx_hash,
                blockchain_block_number: record.blockchain_block_number,
                verification_status: record.verification_status
            };
            const [result]: any = await pool.query('INSERT INTO blockchain_records SET ?', [dbRecord]);
            await pool.query('INSERT INTO verification_logs SET ?', [{ record_id: result.insertId, status: 'Created' }]);
            return {
                id: result.insertId,
                ...record,
                patient_name: patientName ?? `Patient ${patientId}`
            };
        } catch (error) {
            console.error('Database unavailable, storing record in-memory.', error);
            const fallbackRecord = {
                id: fallbackRecordId++,
                ...record,
                patient_name: patientName ?? `Patient ${patientId}`
            };
            fallbackRecords.unshift(fallbackRecord);
            return fallbackRecord;
        }
    },

    getRecords: async (): Promise<any> => {
        try {
            const [rows] = await pool.query(`
                SELECT br.*, p.name as patient_name
                FROM blockchain_records br
                LEFT JOIN patients p ON p.id = br.patient_id
                ORDER BY br.created_at DESC
            `);
            return rows;
        } catch (error) {
            console.error('Database unavailable, returning in-memory records.', error);
            return fallbackRecords;
        }
    },

    getRecordById: async (id: number): Promise<any> => {
        try {
            const [rows]: any = await pool.query(`
                SELECT br.*, p.name as patient_name
                FROM blockchain_records br
                LEFT JOIN patients p ON p.id = br.patient_id
                WHERE br.id = ?
            `, [id]);
            return rows[0];
        } catch (error) {
            console.error('Database unavailable, returning in-memory record by id.', error);
            return fallbackRecords.find(record => record.id === id);
        }
    },

    verifyRecord: async (recordId: number): Promise<any> => {
        try {
            const [rows]: any = await pool.query('SELECT report_hash, blockchain_tx_hash FROM blockchain_records WHERE id = ?', [recordId]);
            if (rows.length === 0) {
                throw new Error('Record not found');
            }
            const record = rows[0];

            const isVerified = await blockchainService.verifyRecordHash(record.report_hash, record.blockchain_tx_hash);
            const verification_status = isVerified ? 'verified' : 'failed';

            await pool.query('UPDATE blockchain_records SET verification_status = ? WHERE id = ?', [verification_status, recordId]);
            await pool.query('INSERT INTO verification_logs SET ?', [{ record_id: recordId, status: `Verification ${verification_status}` }]);

            return { recordId, verification_status, isVerified };
        } catch (error) {
            console.error('Fallback verification mode enabled.', error);
            const record = fallbackRecords.find(entry => entry.id === recordId);
            if (!record) {
                throw new Error('Record not found');
            }
            record.verification_status = 'pending';
            return { recordId, verification_status: record.verification_status, isVerified: false };
        }
    }
};
