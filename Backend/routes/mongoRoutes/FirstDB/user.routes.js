import express from 'express';
import { registerUser, updateUser,changePassword,forgotPassword,getUser, getUsersFromBatch ,deleteUser} from '../../../controllers/FirstDB/user.controllers.js';
import { checkLimitAccess } from '../../../middleware/checkLimitAccess.middleware.js';
import { roleRouteGuard } from '../../../middleware/roleRouteGuard.middleware.js';

const router = express.Router();

router.post('/create',roleRouteGuard,checkLimitAccess, registerUser);
router.patch('/update',roleRouteGuard,updateUser);
router.patch('/changePassword', roleRouteGuard,changePassword);
router.patch('/forgotPassword', roleRouteGuard,forgotPassword);
router.delete("/delete/:userId", roleRouteGuard,deleteUser)
router.get('/getUser/',getUser);
router.get('/batch/:id', getUsersFromBatch);



export default router