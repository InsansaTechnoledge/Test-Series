import express from 'express';
import { createContest, enrollStudentToContest, FetchContest, getenrolledContest, DeleteContest, addContestQuestion, toggleLiveContest, submitContest, getleaderBoard } from '../../controllers/SupabaseDB/contest.controllers.js';
import { fetchCodingQuestion, fetchCodingQuestions, getContestQuestions, runContestCode, testContestQuestion } from '../../controllers/SupabaseDB/contestQuestion.controllers.js';
import { checkLimitAccess } from '../../middleware/checkLimitAccess.middleware.js';
import { roleRouteGuard } from '../../middleware/roleRouteGuard.middleware.js';

const router=express.Router();

router.post('/questions',addContestQuestion);
router.get('/questions', getContestQuestions);
router.post('/test',testContestQuestion);
router.post('/run', runContestCode);
router.post('/create',roleRouteGuard,checkLimitAccess,createContest);
router.get('/', FetchContest)
router.post('/enroll', enrollStudentToContest);
router.get('/enroll',getenrolledContest);
router.get('/coding-questions',fetchCodingQuestions);
router.delete('/:id' , roleRouteGuard,DeleteContest)
router.patch('/toggle-contest/:contestId', toggleLiveContest);
router.get('/coding-question/:id', fetchCodingQuestion);
router.post('/submit',submitContest);
router.get('/leader-board',getleaderBoard);


export default router;