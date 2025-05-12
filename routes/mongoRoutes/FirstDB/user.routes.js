import express from 'express';
import { registerUser, updateUser,changePassword,forgotPassword,getUser } from '../../../controllers/FirstDB/user.controllers.js';
const router = express.Router();

router.post('/create', registerUser);
router.patch('/update',updateUser);
router.patch('/changePassword', changePassword);
router.patch('/forgotPassword', forgotPassword);
router.get('/getUser', getUser);



export default router