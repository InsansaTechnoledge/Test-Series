import express from 'express'
import { bulkCreateStudents, changeStudentBatch, createOneStudent, deleteStudent, getAllStudents, updateStudent, uploadProfileImage, uploadStudentExcel } from '../../../controllers/FirstDB/student.controller.js'
import { uploadExcel } from '../../../middleware/uploadExcelForStudents.middleware.js'
import { upload } from '../../../middleware/uploadLogoAndProfile.moddleware.js'

const router = express.Router()

router.get('/add-student', createOneStudent)
router.post('/bulk-add', bulkCreateStudents)
router.post('/upload-excel', uploadExcel.single('file'), uploadStudentExcel)
router.get('/all-student' , getAllStudents)
router.post('/:id/upload-profile-photo' , upload.single('profilePic'), uploadProfileImage)
router.patch('/update/:id', updateStudent)
router.delete('/delete:id', deleteStudent)
router.patch('/change-batch/:id', changeStudentBatch)

export default router

