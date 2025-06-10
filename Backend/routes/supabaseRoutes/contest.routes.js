import express from 'express';
import { addContestQuestion } from '../../controllers/SupabaseDB/contestQuestion.controllers.js';

const router=express.Router();

router.post('/questions',addContestQuestion);

export default router;