import express from 'express';
import { checkAuth, organizationLogin, organizationLogout, studentLogin, studentLogout, UserLogin, UserLogout } from '../../../controllers/FirstDB/auth.cotrollers.js';
import { authenticateUserMiddleware ,authenticateOrganizationMiddleware, authenticateStudentMiddleware } from '../../../middleware/passport.middleware.js';
import { isLoggedInMiddleware } from '../../../middleware/isLoggedIn.middleware.js';
const router = express.Router();

router.post('/user-login',authenticateUserMiddleware, UserLogin);
router.post('/user-logout',UserLogout);
router.post('/org-login',authenticateOrganizationMiddleware,organizationLogin);
router.post('/org-logout',organizationLogout);
router.post('student-login',authenticateStudentMiddleware,studentLogin);
router.post('student-logout',studentLogout);
router.get('/check-auth',isLoggedInMiddleware,checkAuth);

export default router;