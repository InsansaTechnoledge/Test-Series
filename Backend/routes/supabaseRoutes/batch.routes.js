import express from 'express'
import { createOrgBatch, deleteOrgBatch, getOrgBatches, updateOrgBatch} from '../../controllers/SupabaseDB/batch.controllers.js'
import { isOrganizationAuthenticated,isOrgAndUserAndStudentAuthenticated, isUserAndOrgAuthenticated } from '../../middleware/isLoggedIn.middleware.js';

const router = express.Router()

router.post('/create-batch' , isUserAndOrgAuthenticated,createOrgBatch)
router.get('/get-batch',isOrgAndUserAndStudentAuthenticated ,getOrgBatches);
router.patch('/update-batch/:id' , updateOrgBatch)
router.delete('/delete-batch/:id' , isOrganizationAuthenticated,deleteOrgBatch)

export default router 