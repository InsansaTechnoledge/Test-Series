import express from "express";
import { addExam, deleteExamById, fetchExamBasedOnCondition, updateExamById , goLiveExamById , getUpcomingExams, fetchExamsWithoutQuestions, fetchAnalyticsExamAndBatch, addCertificateToExam} from "../../controllers/SupabaseDB/exam.controllers.js";
import { checkLimitAccess } from "../../middleware/checkLimitAccess.middleware.js";
import { roleRouteGuard } from "../../middleware/roleRouteGuard.middleware.js";
import { uploadFromJSON } from "../../controllers/SupabaseDB/questionUploader.controllers.js";

const router = express.Router();

router.get('/', fetchExamBasedOnCondition);
router.post('/', roleRouteGuard,checkLimitAccess,addExam);
router.get('/upcoming', getUpcomingExams);
router.get('/pending-no-questions' , fetchExamsWithoutQuestions)
router.patch('/' , addCertificateToExam);
router.get('/analytics', fetchAnalyticsExamAndBatch);
router.post('/upload-json',roleRouteGuard,checkLimitAccess, uploadFromJSON);
router.patch('/:id', roleRouteGuard,updateExamById);
router.delete('/:id', roleRouteGuard,deleteExamById);
router.patch('/:id/go-live',roleRouteGuard,goLiveExamById);


export default router;