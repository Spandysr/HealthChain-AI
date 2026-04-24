import { Router } from 'express';
import { createRecord, getRecords, getRecordById, verifyRecord } from '../controllers/recordController';

const router = Router();

router.post('/', createRecord);
router.get('/', getRecords);
router.get('/:id', getRecordById);
router.post('/verify', verifyRecord);

export default router;
