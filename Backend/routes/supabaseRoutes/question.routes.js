import express from 'express'
import { deleteQuestions, getAllQuestionsSelectively, updateQuestionById } from '../../controllers/SupabaseDB/question.controllers.js';

const router = express.Router();

router.patch('/:id', updateQuestionById);
router.get('/', getAllQuestionsSelectively);
router.delete('/', deleteQuestions);

export default router;