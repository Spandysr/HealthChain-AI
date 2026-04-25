import { pool } from '../database/db';
import { getFallbackRecordsSnapshot } from './recordService';
import { getFallbackPredictionsSnapshot } from './predictionService';

const normalizeRisk = (risk: string): 'Low' | 'Medium' | 'High' | 'Critical' => {
    if (risk === 'Moderate') {
        return 'Medium';
    }
    if (risk === 'Low' || risk === 'Medium' || risk === 'High' || risk === 'Critical') {
        return risk;
    }
    return 'Low';
};

const emptyRiskDistribution = () => ({
    Low: 0,
    Medium: 0,
    High: 0,
    Critical: 0,
});

export const analyticsService = {
    getSummary: async (): Promise<any> => {
        try {
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
        } catch (error) {
            console.error('Database unavailable, returning fallback analytics summary.', error);

            const fallbackRecords = getFallbackRecordsSnapshot();
            const fallbackPredictions = getFallbackPredictionsSnapshot();

            const riskDistribution = emptyRiskDistribution();
            fallbackPredictions.forEach((prediction: any) => {
                const risks = [
                    prediction?.diabetes?.risk,
                    prediction?.cardiovascularDisease?.risk,
                    prediction?.chronicKidneyDisease?.risk,
                ].filter(Boolean) as string[];

                risks.forEach((risk) => {
                    const normalized = normalizeRisk(risk);
                    riskDistribution[normalized] += 1;
                });
            });

            const uniquePatients = new Set(
                fallbackRecords.map((record: any) => record.patient_name || String(record.patient_id))
            );

            return {
                totalPatients: uniquePatients.size,
                totalPredictions: fallbackPredictions.length,
                totalRecords: fallbackRecords.length,
                verifiedRecords: fallbackRecords.filter((record: any) => record.verification_status === 'verified').length,
                riskDistribution
            };
        }
    }
};
