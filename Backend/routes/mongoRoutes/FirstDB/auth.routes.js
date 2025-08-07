import express from 'express';
import { checkAuth, instituteLogin, Logout, organizationLogin, studentLogin, UserLogin } from '../../../controllers/FirstDB/auth.cotrollers.js';
import { authenticateUserMiddleware ,authenticateOrganizationMiddleware, authenticateStudentMiddleware, authenticateInstituteMiddleware } from '../../../middleware/passport.middleware.js';
import { isLoggedInMiddleware } from '../../../middleware/isLoggedIn.middleware.js';
import { validateSessionMiddleware } from '../../../middleware/validateSessionMiddleware.middleware.js';
const router = express.Router();

router.post('/user-login',validateSessionMiddleware,authenticateUserMiddleware, UserLogin);
router.post('/logout',Logout);
// router.post('/org-login',authenticateOrganizationMiddleware,organizationLogin);
router.post('/institute-login',validateSessionMiddleware,authenticateInstituteMiddleware,instituteLogin);
router.post('/student-login',validateSessionMiddleware,authenticateStudentMiddleware,studentLogin);
router.get('/check-auth',isLoggedInMiddleware,checkAuth);

export default router;