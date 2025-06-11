import express from 'express';
import { addContestQuestion, getContestQuestions } from '../../controllers/SupabaseDB/contestQuestion.controllers.js';

const router=express.Router();

router.post('/questions',addContestQuestion);
router.get('/questions', getContestQuestions);

export default router;