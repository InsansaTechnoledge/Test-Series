// import express from 'express';
// import { checkAuth, instituteLogin, Logout, organizationLogin, studentLogin, UserLogin } from '../../../controllers/FirstDB/auth.cotrollers.js';
// import { authenticateUserMiddleware ,authenticateOrganizationMiddleware, authenticateStudentMiddleware, authenticateInstituteMiddleware } from '../../../middleware/passport.middleware.js';
// import { isLoggedInMiddleware } from '../../../middleware/isLoggedIn.middleware.js';
// import { validateSessionMiddleware } from '../../../middleware/validateSessionMiddleware.middleware.js';
// const router = express.Router();

// router.post('/user-login',authenticateUserMiddleware, UserLogin);
// // router.post('/org-login',authenticateOrganizationMiddleware,organizationLogin);
// router.post('/institute-login',authenticateInstituteMiddleware,instituteLogin);
// router.post('/student-login',authenticateStudentMiddleware,studentLogin);

// router.get('/check-auth',isLoggedInMiddleware ,validateSessionMiddleware,checkAuth);
// router.post('/logout',isLoggedInMiddleware,validateSessionMiddleware,Logout);

// export default router;

import express from 'express';
import passport from '../../../utils/PassportAuth/Passport.js';
import { Organization } from '../../../models/FirstDB/organization.model.js';
import User from '../../../models/FirstDB/user.model.js';
import { APIError } from '../../../utils/ResponseAndError/ApiError.utils.js';
import { APIResponse } from '../../../utils/ResponseAndError/ApiResponse.utils.js';
import { destroyOtherSessionsForUser } from '../../../utils/sessionCleanup.js';

import {
  checkAuth,
  // REMOVE the old controller usage for instituteLogin; we inline it safely below
  // instituteLogin,
  Logout,
  organizationLogin,
  studentLogin,
  UserLogin,
} from '../../../controllers/FirstDB/auth.cotrollers.js';

import {
  authenticateUserMiddleware,
  // authenticateOrganizationMiddleware,
  authenticateStudentMiddleware,
  // authenticateInstituteMiddleware, // not needed with custom callback
} from '../../../middleware/passport.middleware.js';

import { isLoggedInMiddleware } from '../../../middleware/isLoggedIn.middleware.js';
import { validateSessionMiddleware } from '../../../middleware/validateSessionMiddleware.middleware.js';

const router = express.Router();

/**
 * USER login (kept as-is). Note: make sure your UserLogin controller
 * no longer destroys sessions inline; let the cleanup happen in this pattern.
 */
router.post('/user-login', authenticateUserMiddleware, UserLogin);

/**
 * SAFE institute login (handles org + user) with:
 *  - session fixation protection (regenerate)
 *  - req.logIn to persist passport
 *  - session save (flush to store)
 *  - destroy OTHER sessions for same user (exclude current sid)
 *  - update lastLogin + sessionId in DB
 */
router.post('/institute-login', (req, res, next) => {
  passport.authenticate('institute-local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return new APIError(401, [info?.message || 'Invalid credentials']).send(res);
    }

    const rememberMe = !!req.body.rememberMe;

    // 1) rotate session id to prevent fixation
    req.session.regenerate(err => {
      if (err) return next(err);

      // 2) establish login (sets req.session.passport)
      req.logIn(user, async err => {
        if (err) return next(err);

        // 3) cookie lifetime
        req.session.cookie.maxAge = rememberMe
          ? 7 * 24 * 60 * 60 * 1000  // 7 days
          : 24 * 60 * 60 * 1000;     // 1 day

        try {
          // 4) persist session to store before any cleanup
          await new Promise((resolve, reject) => {
            req.session.save(e => (e ? reject(e) : resolve()));
          });

          const currentSid = req.sessionID;
          const userId = (user._id || user.id).toString();
          const role = user.role;

          // 5) destroy other sessions for this user (exclude current)
          try {
            await destroyOtherSessionsForUser(userId, currentSid);
          } catch (e) {
            console.warn('Session cleanup warning:', e.message);
          }

          // 6) update DB with lastLogin & current sessionId
          const lastLogin = new Date();
          if (role === 'organization') {
            await Organization.findByIdAndUpdate(userId, { lastLogin, sessionId: currentSid });
          } else if (role === 'user') {
            await User.findByIdAndUpdate(userId, { lastLogin, sessionId: currentSid });
          }

          // 7) respond in your standard shape
          return new APIResponse(
            200,
            { user: { id: userId, role } },
            'User logged in successfully!!'
          ).send(res);

        } catch (e) {
          return next(e);
        }
      });
    });
  })(req, res, next);
});

/**
 * Student login (kept as-is). As with user login, ensure the controller
 * does NOT directly destroy sessions; follow the same pattern if needed.
 */
router.post('/student-login', authenticateStudentMiddleware, studentLogin);

// Protected routes
router.get('/check-auth', isLoggedInMiddleware, validateSessionMiddleware, checkAuth);
router.post('/logout',     isLoggedInMiddleware, validateSessionMiddleware, Logout);

export default router;
