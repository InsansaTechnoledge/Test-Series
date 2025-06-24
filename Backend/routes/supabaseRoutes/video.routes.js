import express from 'express';
import { uploadVideoMiddleware } from '../../middleware/uploadVideo.middleware.js';
import { uploadVideo,callback, register } from '../../controllers/SupabaseDB/video.controllers.js';
import { checkLimitAccess } from '../../middleware/checkLimitAccess.middleware.js';


const router = express.Router();

router.post('/upload', checkLimitAccess,uploadVideoMiddleware.single('video'), uploadVideo);
router.post('/register',register);
router.get('/callback', callback);

export default router;