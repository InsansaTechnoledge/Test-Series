import { APIError } from '../utils/ResponseAndError/ApiError.utils.js';

export const isLoggedInMiddleware = async (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return new APIError(400, ['session expired , please login again']).send(
      res
    );
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
      if (!req.query.id && req.user?.batchId) {
        req.mergedQuery.id = Array.isArray(req.user?.batchId)
          ? req.user.batchId
          : [req.user.batchId];
      }
    }

    if (!req.mergedQuery.organization_id && req.user?.organizationId) {
      req.mergedQuery.organization_id = req.user.organizationId;
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
  console.log(req.user);
  if (req.isAuthenticated() && (req.user?.role === 'user' || req.user?.role === 'organization')) return next();

  return new APIError(401, ['Not authorized as user or organization']).send(res);
}