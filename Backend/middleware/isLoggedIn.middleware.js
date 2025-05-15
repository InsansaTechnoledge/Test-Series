import {APIError} from '../utils/ResponseAndError/ApiError.utils.js';

export const isLoggedInMiddleware = async (req, res, next) => {
    if (req.user) {
      next();
    } else {
      return new APIError(400, ['session expired , please login again']).send(
        res
      );
    }
  };

  export const isOrganizationAuthenticated = async (req , res , next) => {
    if(req.isAuthenticated() && req.user?.role === 'organization') return next();
  
    return new APIError(401 , ['Not authorized as organization']).send(res);
  }

  export const isStudentAuthenticated = async (req , res , next) => {
    if(req.isAuthenticated() && req.user?.role === 'student') return next();
  
    return new APIError(401 , ['Not authorized as student']).send(res);
  }

  export const isUserAuthenticated = async (req , res , next) => {
    if(req.isAuthenticated() && req.user?.role === 'user') return next();
  
    return new APIError(401 , ['Not authorized as user']).send(res);
  }

  export const isOrgAndUserAuthenticated = async (req , res , next) => {
    if(req.isAuthenticated() && (req.user?.role === 'user' || req.user?.role === 'organization')) return next();
  
    return new APIError(401 , ['Not authorized as user or organization']).send(res);
  }