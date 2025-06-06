import express from 'express';
import { AddSyllabus, getSyllabusData ,updateSyllabusData,deleteSyllabusData , fetchSyllabusById} from '../../controllers/SupabaseDB/syllabus.controllers.js';

const router= express.Router();

router.post('/',AddSyllabus);
router.get('/',getSyllabusData);
router.post('/:id',updateSyllabusData);
router.delete('/:id',deleteSyllabusData);
router.get('/:id' , fetchSyllabusById)


export default router;