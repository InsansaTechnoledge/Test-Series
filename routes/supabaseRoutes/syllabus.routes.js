import express from 'express';
import { createSyllabus, getSyllabus ,updateSyllabus,deleteSyllabus} from '../../controllers/SupabaseDB/syllabus.controllers';

router= express.Router();

router.post('/',createSyllabus);
router.get('/',getSyllabus);
router.post('/:id',updateSyllabus);
router.delete('/:id',deleteSyllabus);


export default router;