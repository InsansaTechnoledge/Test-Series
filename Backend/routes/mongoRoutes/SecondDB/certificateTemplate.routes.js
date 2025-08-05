import { createTemplate, getAllTemplates } from "../../../controllers/SecondDB/certificateTemplate.controller.js";
import { getCloudinaryUploader } from "../../../middleware/uploadLogoAndProfile.moddleware.js";
import express from 'express'

const router = express.Router();
const templateUpload = getCloudinaryUploader('Certificate_Templates');


router.post('/templates', templateUpload.single('image'), createTemplate);
router.get('/templates' , getAllTemplates);

export default router;