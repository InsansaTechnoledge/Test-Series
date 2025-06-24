import express from 'express';
import { registerUser, updateUser,changePassword,forgotPassword,getUser, getUsersFromBatch ,deleteUser} from '../../../controllers/FirstDB/user.controllers.js';
import { checkLimitAccess } from '../../../middleware/checkLimitAccess.middleware.js';

const router = express.Router();

router.post('/create',checkLimitAccess, registerUser);
router.patch('/update',updateUser);
router.patch('/changePassword', changePassword);
router.patch('/forgotPassword', forgotPassword);
router.delete("/delete/:userId", deleteUser)
router.get('/getUser/',getUser);
router.get('/batch/:id', getUsersFromBatch);



export default router