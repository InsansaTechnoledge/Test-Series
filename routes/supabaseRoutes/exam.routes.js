import express from "express";
import { addExam, deleteExamById, fetchExamBasedOnCondition, updateExamById } from "../../controllers/SupabaseDB/exam.controllers.js";

const router = express.Router();

router.get('/', fetchExamBasedOnCondition);
router.post('/', addExam);
router.patch('/:id', updateExamById);
router.delete('/:id', deleteExamById);

export default router;