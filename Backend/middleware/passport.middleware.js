import passport from 'passport';
import { APIError } from "../utils/ResponseAndError/ApiError.utils.js";

export const authenticateUserMiddleware = async (req, res, next) => {
    passport.authenticate('user-local', (err, user, info) => {
      // console.log(info);
      if (err) return new APIError(400, [err.message]).send(res);
  
      if (!user) {
        return new APIError(400, [info?.message || 'user not found']).send(res);
      }
  
      req.logIn(user, e => {
        if (e) return new APIError(500, [e.message]).send(res);
        return next();
      });
    })(req, res, next);
  };

  export const authenticateOrganizationMiddleware = async (req, res, next) => {
    passport.authenticate('org-local', (err, user, info) => {
      // console.log(info);
      if (err) return new APIError(400, [err.message]).send(res);
  
      if (!user) {
        return new APIError(400, [info?.message || 'organization not found']).send(res);
      }
  
      req.logIn(user, e => {
        if (e) return new APIError(500, [e.message]).send(res);
        return next();
      });
    })(req, res, next);
  }

    export const authenticateInstituteMiddleware = async (req, res, next) => {
    passport.authenticate('institute-local', (err, user, info) => {
      // console.log(info);
      if (err) return new APIError(400, [err.message]).send(res);
  
      if (!user) {
        return new APIError(400, [info?.message || 'organization not found']).send(res);
      }
  
      req.logIn(user, e => {
        if (e) return new APIError(500, [e.message]).send(res);
        return next();
      });
    })(req, res, next);
  }

    export const authenticateStudentMiddleware = async (req, res, next) => {
        passport.authenticate('student-local', (err, user, info) => {
        // console.log(info);
        if (err) return new APIError(400, [err.message]).send(res);
    
        if (!user) {
            return new APIError(400, [info?.message || 'student not found']).send(res);
        }
    
        req.logIn(user, e => {
            if (e) return new APIError(500, [e.message]).send(res);
            return next();
        });
        })(req, res, next);
    }
