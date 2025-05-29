import express from 'express';
import { uploadVideoMiddleware } from '../../middleware/uploadVideo.middleware.js';
import { uploadVideo } from '../../controllers/SupabaseDB/video.controllers.js';

const router = express.Router();

router.post('/upload', uploadVideoMiddleware.single('video'), uploadVideo);

export default router;