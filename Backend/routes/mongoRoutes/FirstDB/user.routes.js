import express from 'express';
import { registerUser, updateUser,changePassword,forgotPassword,getUser, getUsersFromBatch ,deleteUser} from '../../../controllers/FirstDB/user.controllers.js';
import { isUserAndOrgAuthenticated } from '../../../middleware/isLoggedIn.middleware.js';
const router = express.Router();

router.post('/create', registerUser);
router.patch('/update',updateUser);
router.patch('/changePassword', changePassword);
router.patch('/forgotPassword', forgotPassword);router.delete('/delete/:id', deleteUser);
router.get('/getUser/', isUserAndOrgAuthenticated,getUser);
router.get('/batch/:id', getUsersFromBatch);



export default router