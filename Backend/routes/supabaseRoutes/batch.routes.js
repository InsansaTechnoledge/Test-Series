import express from 'express'
import { createOrgBatch, deleteOrgBatch, FetchYoutubeVideos, getOrgBatches, updateOrgBatch , handleDeleteVideo} from '../../controllers/SupabaseDB/batch.controllers.js'
import { isOrganizationAuthenticated,isOrgAndUserAndStudentAuthenticated, isUserAndOrgAuthenticated } from '../../middleware/isLoggedIn.middleware.js';

const router = express.Router()

router.post('/create-batch' , isUserAndOrgAuthenticated,createOrgBatch)
router.get('/get-batch',isOrgAndUserAndStudentAuthenticated ,getOrgBatches);
router.get('/video/:batchId' , FetchYoutubeVideos)
router.post('/delete-video', handleDeleteVideo);
router.patch('/update-batch/:id' , updateOrgBatch)
router.delete('/delete-batch/:id' , isOrganizationAuthenticated,deleteOrgBatch)

export default router 