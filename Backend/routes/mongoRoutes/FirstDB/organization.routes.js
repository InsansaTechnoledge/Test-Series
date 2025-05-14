import express from 'express'
import { CreateOrganization, deleteOrganization, getAllOrganization, getOrganizationById, updateOrganization } from '../../../controllers/FirstDB/organization.controllers.js'
import { upload } from '../../../middleware/uploadLogoAndProfile.moddleware.js'

const router = express.Router()

router.post('/add-organization' ,upload.single('logo'),  CreateOrganization)
router.get('/all-organization', getAllOrganization)
router.get('/detail/:id' , getOrganizationById )
router.patch('/update/:id' , updateOrganization)
router.delete('/delete/:id' , deleteOrganization)

export default router