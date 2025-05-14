import express from 'express';
import { addResult, deleteResult, fetchAllResultsForExam, fetchDetailedResultById, fetchStudentResults, updateResult } from '../../../controllers/SecondDB/result.controllers.js';

const router = express.Router();

router.post('/', addResult);
router.patch('/', updateResult);
router.get('/', fetchStudentResults);
router.get('/exam/:id', fetchAllResultsForExam);
router.get('/:id', fetchDetailedResultById);
router.delete('/:id', deleteResult);

export default router;