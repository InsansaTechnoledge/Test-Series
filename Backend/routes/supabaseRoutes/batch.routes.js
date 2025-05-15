import express from 'express'
import { createOrgBatch, deleteOrgBatch, getOrgBatches, updateOrgBatch} from '../../controllers/SupabaseDB/batch.controllers.js'
import { isOrganizationAuthenticated,isOrgAndUserAuthenticated } from '../../middleware/isLoggedIn.middleware.js';

const router = express.Router()

router.post('/create-batch' , isOrganizationAuthenticated,createOrgBatch)
router.get('/get-batch',isOrgAndUserAuthenticated ,getOrgBatches);
router.patch('/update-batch/:id' , updateOrgBatch)
router.delete('delete-batch/:id' , deleteOrgBatch)

export default router 