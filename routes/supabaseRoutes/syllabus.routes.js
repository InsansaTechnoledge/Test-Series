import express from 'express';
import { AddSyllabus, getSyllabusData ,updateSyllabusData,deleteSyllabusData} from '../../controllers/SupabaseDB/syllabus.controllers.js';

const router= express.Router();

router.post('/',AddSyllabus);
router.get('/',getSyllabusData);
router.post('/:id',updateSyllabusData);
router.delete('/:id',deleteSyllabusData);


export default router;