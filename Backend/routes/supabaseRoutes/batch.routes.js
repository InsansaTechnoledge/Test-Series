import express from 'express'
import { createOrgBatch, deleteOrgBatch, getOrgBatches, updateOrgBatch } from '../../controllers/SupabaseDB/batch.controllers.js'

const router = express.Router()

router.post('/make-batch' , createOrgBatch)
router.get('/get-batch', getOrgBatches);
router.patch('/update-batch/:id' , updateOrgBatch)
router.delete('delete-batch/:id' , deleteOrgBatch)

export default router 