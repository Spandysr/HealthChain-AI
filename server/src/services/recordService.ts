import { pool } from '../database/db';
import { blockchainService } from './blockchainService';
import crypto from 'crypto';

export const recordService = {
    createRecord: async (patientId: number, report: string): Promise<any> => {
        const reportHash = crypto.createHash('sha256').update(report).digest('hex');
        
        const { transactionHash, blockNumber } = await blockchainService.storeRecordHash(reportHash);

        const record = {
            patient_id: patientId,
            report: report,
            report_hash: reportHash,
            blockchain_tx_hash: transactionHash,
            blockchain_block_number: blockNumber,
            verification_status: 'pending'
        };

        const [result]: any = await pool.query('INSERT INTO blockchain_records SET ?', [record]);
        
        // Log verification
        await pool.query('INSERT INTO verification_logs SET ?', [{ record_id: result.insertId, status: 'Created' }]);

        return { id: result.insertId, ...record };
    },

    getRecords: async (): Promise<any> => {
        const [rows] = await pool.query('SELECT * FROM blockchain_records');
        return rows;
    },

    getRecordById: async (id: number): Promise<any> => {
        const [rows]: any = await pool.query('SELECT * FROM blockchain_records WHERE id = ?', [id]);
        return rows[0];
    },

    verifyRecord: async (recordId: number): Promise<any> => {
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
    }
};
