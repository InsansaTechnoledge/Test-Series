import express from 'express'
import { bulkCreateStudents, changeStudentBatch, createOneStudent, deleteStudent, getAllStudentOfBatch, getAllStudents, updateStudent, uploadProfileImage, uploadStudentExcel } from '../../../controllers/FirstDB/student.controllers.js'
import { upload } from '../../../middleware/uploadLogoAndProfile.moddleware.js'
import { fileUpload } from '../../../middleware/uploadExcel.middleware.js'

const router = express.Router()

router.get('/add-student', createOneStudent)
router.post('/bulk-add', bulkCreateStudents)
router.post('/upload-excel', fileUpload.single('file'), uploadStudentExcel)
router.get('/all-student' , getAllStudents)
router.post('/:id/upload-profile-photo' , upload.single('profilePic'), uploadProfileImage)
router.patch('/update/:id', updateStudent)
router.delete('/delete/:ids', deleteStudent)
router.patch('/change-batch/:id', changeStudentBatch)
router.get('/get-all-student-batch/:id' , getAllStudentOfBatch)

export default router

