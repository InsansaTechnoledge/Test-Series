import express from 'express';
import { checkAuth, instituteLogin, Logout, organizationLogin, studentLogin, UserLogin } from '../../../controllers/FirstDB/auth.cotrollers.js';
import { authenticateUserMiddleware ,authenticateOrganizationMiddleware, authenticateStudentMiddleware, authenticateInstituteMiddleware } from '../../../middleware/passport.middleware.js';
import { isLoggedInMiddleware } from '../../../middleware/isLoggedIn.middleware.js';
const router = express.Router();

router.post('/user-login',authenticateUserMiddleware, UserLogin);
router.post('/logout',Logout);
// router.post('/org-login',authenticateOrganizationMiddleware,organizationLogin);
router.post('/institute-login',authenticateInstituteMiddleware,instituteLogin);
router.post('/student-login',authenticateStudentMiddleware,studentLogin);
router.get('/check-auth',isLoggedInMiddleware,checkAuth);

export default router;