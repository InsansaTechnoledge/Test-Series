import express from 'express';
import { fileUpload } from '../../middleware/uploadExcel.middleware.js';
import { uploadByType, uploadMixedExcel, uploadFromJSON } from '../../controllers/SupabaseDB/questionUploader.controllers.js';

const router = express.Router();

router.post('/upload-by-type', fileUpload.single('file'), uploadByType);
router.post('/upload-mixed', fileUpload.single('file'), uploadMixedExcel);
router.post('/upload-json', uploadFromJSON);

export default router;