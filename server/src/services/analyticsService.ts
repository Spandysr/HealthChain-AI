import { pool } from '../database/db';

export const analyticsService = {
    getSummary: async (): Promise<any> => {
        const [[patientCount]]: any = await pool.query('SELECT COUNT(*) as count FROM patients');
        const [[predictionCount]]: any = await pool.query('SELECT COUNT(*) as count FROM predictions');
        const [[recordCount]]: any = await pool.query('SELECT COUNT(*) as count FROM blockchain_records');
        const [[verifiedRecords]]: any = await pool.query('SELECT COUNT(*) as count FROM blockchain_records WHERE verification_status = "verified"');

        const [riskDistribution]: any = await pool.query(`
            SELECT risk, COUNT(*) as count FROM (
                SELECT diabetes_risk as risk FROM predictions
                UNION ALL
                SELECT cvd_risk as risk FROM predictions
                UNION ALL
                SELECT ckd_risk as risk FROM predictions
            ) as risks
            GROUP BY risk
        `);

        return {
            totalPatients: patientCount.count,
            totalPredictions: predictionCount.count,
            totalRecords: recordCount.count,
            verifiedRecords: verifiedRecords.count,
            riskDistribution: riskDistribution.reduce((acc: any, row: any) => {
                acc[row.risk] = row.count;
                return acc;
            }, {})
        };
    }
};
