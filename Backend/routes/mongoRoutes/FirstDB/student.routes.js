import express from 'express'
import { bulkCreateStudents, changeStudentBatch, createOneStudent, deleteStudent, getAllStudentOfBatch, getAllStudents, updateStudent, updateStudentBatch, uploadProfileImage, uploadStudentExcel } from '../../../controllers/FirstDB/student.controllers.js'
import { upload } from '../../../middleware/uploadLogoAndProfile.moddleware.js'
import { fileUpload } from '../../../middleware/uploadExcel.middleware.js'
import { checkLimitAccess } from '../../../middleware/checkLimitAccess.middleware.js'
import { roleRouteGuard } from '../../../middleware/roleRouteGuard.middleware.js'

const router = express.Router()

router.post('/add-student', roleRouteGuard,checkLimitAccess,createOneStudent)
router.post('/bulk-add', roleRouteGuard,checkLimitAccess,bulkCreateStudents)
router.post('/upload-excel',roleRouteGuard,fileUpload.single('file'), uploadStudentExcel)//upload excel, had to check limit access
router.get('/all-student' , getAllStudents)
router.post('/:id/upload-profile-photo' ,roleRouteGuard, upload.single('profilePic'), uploadProfileImage)
router.patch('/update/:id', roleRouteGuard,updateStudent)
router.delete('/delete/:ids', roleRouteGuard,deleteStudent)
router.patch('/change-batch/:id', roleRouteGuard,changeStudentBatch)
router.get('/get-all-student-batch/:id' , getAllStudentOfBatch)
router.patch('/update-batch', roleRouteGuard,updateStudentBatch)

export default router

