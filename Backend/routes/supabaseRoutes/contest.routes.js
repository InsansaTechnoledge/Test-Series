import express from 'express';
import { fetchCodingQuestion, fetchCodingQuestions, runContestCode, testContestQuestion } from '../../controllers/SupabaseDB/contestQuestion.controllers.js';
import { createContest, enrollStudentToContest, FetchContest, getenrolledContest, DeleteContest, addContestQuestion } from '../../controllers/SupabaseDB/contest.controllers.js';
import { checkLimitAccess } from '../../middleware/checkLimitAccess.middleware.js';
import { roleRouteGuard } from '../../middleware/roleRouteGuard.middleware.js';

const router=express.Router();

router.post('/questions',addContestQuestion);
// router.get('/questions', getContestQuestions);
router.post('/test',testContestQuestion);
router.post('/run', runContestCode);
router.post('/create',roleRouteGuard,checkLimitAccess,createContest);
router.get('/', FetchContest)
router.delete('/:id' , roleRouteGuard,DeleteContest)
router.post('/enroll', enrollStudentToContest);
router.get('/enroll',getenrolledContest);
// 
router.get('/coding-questions',fetchCodingQuestions);
router.get('/coding-question/:id', fetchCodingQuestion);

export default router;