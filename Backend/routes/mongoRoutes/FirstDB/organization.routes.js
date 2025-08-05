import express from 'express'
import { CreateOrganization, deleteOrganization, getAllOrganization, getOrganizationById, updateOrganization } from '../../../controllers/FirstDB/organization.controllers.js'
import { getCloudinaryUploader } from '../../../middleware/uploadLogoAndProfile.moddleware.js'

const router = express.Router()

const profileUpload = getCloudinaryUploader('Profile_pics');


router.post('/add-organization' ,profileUpload.single('logoUrl'),  CreateOrganization)
router.get('/all-organization', getAllOrganization)
router.get('/detail/:id' , getOrganizationById )
router.patch('/update/:id' , updateOrganization)
router.delete('/delete/:id' , deleteOrganization)

export default router