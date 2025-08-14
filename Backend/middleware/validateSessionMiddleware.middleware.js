import { Organization } from '../models/FirstDB/organization.model.js';
import Student from '../models/FirstDB/student.model.js';
import User from '../models/FirstDB/user.model.js';
import { APIError } from '../utils/ResponseAndError/ApiError.utils.js';

export const validateSessionMiddleware = async (req, res, next) => {
  try {
    // If not authenticated, just pass—let the route guard handle 401
    if (!req.isAuthenticated?.() || !req.user) return next();

    const modelMap = { user: User, organization: Organization, student: Student };
    const Model = modelMap[req.user.role];
    if (!Model) return next();

    const dbUser = await Model.findById(req.user._id).select('sessionId');
    if (!dbUser || dbUser.sessionId !== req.sessionID) {
      // don't destroy here—just 401 and let client re-login
      return new APIError(401, ['You have been logged out due to login from another device']).send(res);
    }

    next();
  } catch (err) {
    console.error('❌ Error in validateSessionMiddleware:', err);
    return new APIError(500, ['Internal session check error']).send(res);
  }
};

