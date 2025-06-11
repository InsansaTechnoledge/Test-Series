import express from 'express';
import { addContestQuestion, getContestQuestions, runContestCode, testContestQuestion } from '../../controllers/SupabaseDB/contestQuestion.controllers.js';

const router=express.Router();

router.post('/questions',addContestQuestion);
router.get('/questions', getContestQuestions);
router.post('/test',testContestQuestion);
router.post('/run', runContestCode);

export default router;