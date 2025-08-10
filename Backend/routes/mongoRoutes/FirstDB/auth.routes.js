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

// routes/FirstDB/auth.routes.js
import express from 'express';
import passport from '../../../utils/PassportAuth/Passport.js';
import { Organization } from '../../../models/FirstDB/organization.model.js';
import User from '../../../models/FirstDB/user.model.js';
import Student from '../../../models/FirstDB/student.model.js';
import { APIError } from '../../../utils/ResponseAndError/ApiError.utils.js';
import { APIResponse } from '../../../utils/ResponseAndError/ApiResponse.utils.js';
import { isLoggedInMiddleware } from '../../../middleware/isLoggedIn.middleware.js';
import { validateSessionMiddleware } from '../../../middleware/validateSessionMiddleware.middleware.js';
import { sessionStore } from '../../../config/express.config.js';

const router = express.Router();

// helper: set cookie age
const setMaxAge = (req, rememberMe) => {
  req.session.cookie.maxAge = rememberMe
    ? 7 * 24 * 60 * 60 * 1000 // 7 days
    : 24 * 60 * 60 * 1000;    // 1 day
};

// generic safe login wrapper
function safeLogin(strategy, updateFn) {
  return (req, res, next) => {
    passport.authenticate(strategy, (err, entity, info) => {
      if (err) return next(err);
      if (!entity) {
        return new APIError(401, [info?.message || 'Invalid credentials']).send(res);
      }

      const rememberMe = !!req.body.rememberMe;
      const lastLogin = new Date();

      // 1) rotate SID (fixation protection)
      req.session.regenerate(err => {
        if (err) return next(err);

        // 2) establish login (writes passport into session)
        req.logIn(entity, async err => {
          if (err) return next(err);

          // 3) cookie lifetime
          setMaxAge(req, rememberMe);

          try {
            // 4) persist session to store
            await new Promise((resolve, reject) => {
              req.session.save(e => (e ? reject(e) : resolve()));
            });

            const currentSid = req.sessionID;

            // 5) allow strategy-specific DB update & prev-session cleanup
            await updateFn({ entity, currentSid, lastLogin });

            // 6) respond
            const id = String(entity._id || entity.id);
            return new APIResponse(
              200,
              { user: { id, role: entity.role } },
              'User logged in successfully!!'
            ).send(res);

          } catch (e) {
            return next(e);
          }
        });
      });
    })(req, res, next);
  };
}

// destroy a single previous sid safely (no store internals needed)
function destroyPrevSid(prevSid, currentSid) {
  if (!prevSid || prevSid === currentSid) return;
  try {
    sessionStore.destroy(prevSid, (e) => {
      if (e) console.warn('Prev session destroy error:', e.message);
      else   console.log('🔒 Destroyed previous session', prevSid);
    });
  } catch (e) {
    console.warn('Prev session destroy threw:', e.message);
  }
}

/**
 * INSTITUTE login (handles org + user via your "institute-local" strategy)
 */
router.post(
  '/institute-login',
  safeLogin('institute-local', async ({ entity, currentSid, lastLogin }) => {
    const role = entity.role;
    const id = String(entity._id || entity.id);

    if (role === 'organization') {
      const prev = await Organization.findById(id).select('sessionId');
      await Organization.findByIdAndUpdate(id, { lastLogin, sessionId: currentSid });
      destroyPrevSid(prev?.sessionId, currentSid);
    } else if (role === 'user') {
      const prev = await User.findById(id).select('sessionId');
      await User.findByIdAndUpdate(id, { lastLogin, sessionId: currentSid });
      destroyPrevSid(prev?.sessionId, currentSid);
    }
  })
);

/**
 * USER login (direct user-local)
 * If you prefer to keep your old controller, you can remove this block
 * and mount that instead — but make sure it NO LONGER destroys sessions inline.
 */
router.post(
  '/user-login',
  safeLogin('user-local', async ({ entity, currentSid, lastLogin }) => {
    const id = String(entity._id || entity.id);
    const prev = await User.findById(id).select('sessionId');
    await User.findByIdAndUpdate(id, { lastLogin, sessionId: currentSid });
    destroyPrevSid(prev?.sessionId, currentSid);
  })
);

/**
 * STUDENT login (student-local)
 */
router.post(
  '/student-login',
  safeLogin('student-local', async ({ entity, currentSid, lastLogin }) => {
    const id = String(entity._id || entity.id);
    const prev = await Student.findById(id).select('sessionId');
    await Student.findByIdAndUpdate(id, { lastLogin, sessionId: currentSid });
    destroyPrevSid(prev?.sessionId, currentSid);
  })
);

// Protected routes
router.get('/check-auth', isLoggedInMiddleware, validateSessionMiddleware, (req, res) =>
  new APIResponse(200, { user: req.user }, 'session found').send(res)
);

router.post('/logout', isLoggedInMiddleware, validateSessionMiddleware, async (req, res) => {
  try {
    const id = req.user?._id;
    const role = req.user?.role;

    if (id && role) {
      if      (role === 'user')         await User.findByIdAndUpdate(id, { sessionId: null });
      else if (role === 'organization') await Organization.findByIdAndUpdate(id, { sessionId: null });
      else if (role === 'student')      await Student.findByIdAndUpdate(id, { sessionId: null });
    }

    await new Promise((resolve, reject) => req.logout(err => err ? reject(err) : resolve()));
    await new Promise((resolve, reject) => req.session.destroy(err => err ? reject(err) : resolve()));
    res.clearCookie('connect.sid');

    return new APIResponse(200, null, 'User logged out successfully!!').send(res);
  } catch (err) {
    return new APIError(err?.status || 500, ['Logout failed', err.message || '']).send(res);
  }
});

export default router;
