import express from "express";
import { addExam, deleteExamById, fetchExamBasedOnCondition, updateExamById , goLiveExamById , getUpcomingExams, fetchExamsWithoutQuestions, fetchAnalyticsExamAndBatch} from "../../controllers/SupabaseDB/exam.controllers.js";
import { checkLimitAccess } from "../../middleware/checkLimitAccess.middleware.js";

const router = express.Router();

router.get('/', fetchExamBasedOnCondition);
router.post('/', checkLimitAccess,addExam);
router.get('/upcoming', getUpcomingExams);
router.get('/pending-no-questions' , fetchExamsWithoutQuestions)
router.patch('/:id', updateExamById);
router.delete('/:id', deleteExamById);
router.patch('/:id/go-live', goLiveExamById);
router.get('/analytics', fetchAnalyticsExamAndBatch);

export default router;