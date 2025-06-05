import express from "express";
import { addExam, deleteExamById, fetchExamBasedOnCondition, updateExamById , goLiveExamById , getUpcomingExams, fetchExamsWithoutQuestions} from "../../controllers/SupabaseDB/exam.controllers.js";

const router = express.Router();

router.get('/', fetchExamBasedOnCondition);
router.post('/', addExam);
router.get('/upcoming', getUpcomingExams);
router.get('/pending-no-questions' , fetchExamsWithoutQuestions)
router.patch('/:id', updateExamById);
router.delete('/:id', deleteExamById);
router.put('/:id/go-live', goLiveExamById);

export default router;