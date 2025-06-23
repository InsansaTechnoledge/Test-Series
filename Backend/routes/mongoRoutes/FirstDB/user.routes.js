import express from 'express';
import { registerUser, updateUser,changePassword,forgotPassword,getUser, getUsersFromBatch ,deleteUser} from '../../../controllers/FirstDB/user.controllers.js';

const router = express.Router();

router.post('/create', registerUser);
router.patch('/update',updateUser);
router.patch('/changePassword', changePassword);
router.patch('/forgotPassword', forgotPassword);
router.delete("/delete/:userId", deleteUser)
router.get('/getUser/',getUser);
router.get('/batch/:id', getUsersFromBatch);



export default router