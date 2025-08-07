import { Organization } from '../models/FirstDB/organization.model.js';
import Student from '../models/FirstDB/student.model.js';
import User from '../models/FirstDB/user.model.js';
import { APIError } from '../utils/ResponseAndError/ApiError.utils.js';

export const validateSessionMiddleware = async (req, res, next) => {
  try {
    // Skip validation for unauthenticated sessions (e.g., before login)
    if (!req.isAuthenticated?.() || !req.user) return next();

    const modelMap = {
      user: User,
      organization: Organization,
      student: Student,
    };

    const role = req.user.role;
    const Model = modelMap[role];

    if (!Model) return next(); // unknown role, skip

    const dbUser = await Model.findById(req.user._id).select('sessionId');
    
    if (!dbUser || dbUser.sessionId !== req.sessionID) {
        console.warn(`❌ Session mismatch for ${role} ${req.user._id}: Invalidating session`);
      
        // ✅ First logout (calls passport logic which may use session)
        if (typeof req.logout === 'function') {
          try {
            await new Promise((resolve, reject) => {
              req.logout(err => {
                if (err) return reject(err);
                resolve();
              });
            });
          } catch (err) {
            console.error("Error during logout:", err);
          }
        }
      
        // ✅ Then destroy session
        if (req.session) {
          req.session.destroy(err => {
            if (err) console.error("Session destroy error:", err);
          });
        }
      
        // ✅ Clear cookie
        res.clearCookie('connect.sid');
      
        return new APIError(401, ['You have been logged out due to login from another device']).send(res);
      }
      

    return next();
  } catch (err) {
    console.error('❌ Error in validateSessionMiddleware:', err);
    return new APIError(500, ['Internal session check error']).send(res);
  }
};
