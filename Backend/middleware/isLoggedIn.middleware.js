import { APIError } from '../utils/ResponseAndError/ApiError.utils.js';

// export const isLoggedInMiddleware = async (req, res, next) => {
//   console.log('Session ID:', req.sessionID);
//   console.log('Session data:', req.session);
//   console.log('User from req.user:', req.user);
//   console.log('Is authenticated:', req.isAuthenticated ? req.isAuthenticated() : 'no isAuthenticated method');
  
//   if (req.user) {
//     next();
//   } else {
//     console.log('No user found in session');
//     return new APIError(400, ['session expired , please login again']).send(res);
//   }
// };

export const isLoggedInMiddleware = async (req, res, next) => {
  console.log('🛂 Middleware: Checking authentication...');
  console.log('➡️ Session ID:', req.sessionID);
  console.log('➡️ Session data:', req.session);
  console.log('➡️ req.user:', req.user);
  console.log('➡️ isAuthenticated:', typeof req.isAuthenticated === 'function' ? req.isAuthenticated() : 'N/A');

  try {
    if (req.isAuthenticated && req.isAuthenticated()) {
      return next();
    }

    console.warn('❌ No user found in session or not authenticated');
    return new APIError(401, ['Session expired or invalid. Please log in again.']).send(res);
  } catch (error) {
    console.error('❌ Error in isLoggedInMiddleware:', {
      message: error.message,
      stack: error.stack,
    });

    return new APIError(500, [
      'Internal server error while checking session.',
      error.message
    ]).send(res);
  }
};


export const isOrganizationAuthenticated = async (req, res, next) => {
  if (req.isAuthenticated() && req.user?.role === 'organization') return next();

  return new APIError(401, ['Not authorized as organization']).send(res);
}

export const isStudentAuthenticated = async (req, res, next) => {
  if (req.isAuthenticated() && req.user?.role === 'student') return next();

  return new APIError(401, ['Not authorized as student']).send(res);
}

export const isUserAuthenticated = async (req, res, next) => {
  if (req.isAuthenticated() && req.user?.role === 'user') return next();

  return new APIError(401, ['Not authorized as user']).send(res);
}

export const isOrgAndUserAndStudentAuthenticated = async (req, res, next) => {

  req.mergedQuery = { ...req.query };

  if (req.isAuthenticated() && (req.user?.role === 'user' || req.user?.role === 'student')) {
    if (req.user?.role === 'user') {
      if (!req.query.id && req.user?.batch) {
        req.mergedQuery.id = Array.isArray(req.user.batch) ? req.user.batch : [req.user.batch];

      }
    } else{
      if (!req.query.id && req.user?.batch.currentBatch) {
        req.mergedQuery.id = Array.isArray(req.user?.batch.currentBatch)
          ? req.user.batch.currentBatch
          : [req.user.batch.currentBatch];
      }
    }

    if (!req.mergedQuery.organization_id && req.user?.organizationId) {
      req.mergedQuery.organization_id = req.user.organizationId._id || req.user.organizationId;
    }

    return next();
  }

  if (req.isAuthenticated() && req.user?.role === 'organization') {
    req.mergedQuery.organization_id = req.user?._id;
    return next();
  }

  return new APIError(401, ['Not authorized as user or organization']).send(res);
};

export const isUserAndOrgAuthenticated = async (req, res, next) => {

  if (req.isAuthenticated() && (req.user?.role === 'user' || req.user?.role === 'organization')) return next();

  return new APIError(401, ['Not authorized as user or organization']).send(res);
}