import express from 'express'
import { createFeature, deleteFeature, fetchAllFeatures, ToggleActiveOrInactive, updateFeature } from '../../../controllers/FirstDB/feature.controllers.js'

const router = express.Router()

router.post('/add-feature' , createFeature)
router.get('/all-feature', fetchAllFeatures)
router.patch('/active-inactive/:id' , ToggleActiveOrInactive)
router.patch('/update/:id' , updateFeature)
router.delete('/delete/:id' , deleteFeature)

export default router