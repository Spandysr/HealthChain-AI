import { Request, Response } from 'express';
import { recordService } from '../services/recordService';

export const createRecord = async (req: Request, res: Response) => {
    try {
        const { patientId, report } = req.body;
        const result = await recordService.createRecord(patientId, report);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error creating record', error });
    }
};

export const getRecords = async (req: Request, res: Response) => {
    try {
        const records = await recordService.getRecords();
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json({ message: 'Error getting records', error });
    }
};

export const getRecordById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const record = await recordService.getRecordById(parseInt(id));
        if (record) {
            res.status(200).json(record);
        } else {
            res.status(404).json({ message: 'Record not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error getting record', error });
    }
};

export const verifyRecord = async (req: Request, res: Response) => {
    try {
        const { recordId } = req.body;
        const result = await recordService.verifyRecord(recordId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error verifying record', error });
    }
};
