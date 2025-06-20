import express from 'express';
import { addContestQuestion, getContestQuestions, runContestCode, testContestQuestion } from '../../controllers/SupabaseDB/contestQuestion.controllers.js';
// import { createContest, DeleteContest, FetchContest } from '../../controllers/SupabaseDB/contest.controllers.js';
import { createContest, enrollStudentToContest, FetchContest, getenrolledContest, DeleteContest } from '../../controllers/SupabaseDB/contest.controllers.js';

const router=express.Router();

router.post('/questions',addContestQuestion);
router.get('/questions', getContestQuestions);
router.post('/test',testContestQuestion);
router.post('/run', runContestCode);
router.post('/create',createContest);
router.get('/', FetchContest)
router.delete('/:id' , DeleteContest)
router.post('/enroll', enrollStudentToContest);
router.get('/enroll',getenrolledContest);

export default router;