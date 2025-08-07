import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js";
import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js";
import { Organization } from "../../models/FirstDB/organization.model.js";
import User from "../../models/FirstDB/user.model.js";
import Student from "../../models/FirstDB/student.model.js";
import { sessionStore } from "../../config/express.config.js";

export const UserLogin = async (req, res) => {
    try {
      const lastLogin = new Date();
      const rememberMe = req.body.rememberMe;
  
      if (rememberMe) {
        req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7; // 7 days
      } else {
        req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 1;
      }
  
      const sessionId = req.sessionID;
  
      // Fetch previous session ID
      const existingUser = await User.findById(req.user._id);
  
      // Destroy previous session if different
      if (existingUser.sessionId && existingUser.sessionId !== sessionId) {
        sessionStore.destroy(existingUser.sessionId, (err) => {
          if (err) console.error("Error destroying old session:", err);
          else console.log("Previous session destroyed successfully.");
        });
      }
  
      // Update user sessionId and lastLogin
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { lastLogin, sessionId },
        { new: true }
      );
  
      return new APIResponse(200, { user: { ...user.toObject(), role: 'user' } }, "User logged in successfully!!").send(res);
    } catch (err) {
      console.log(err);
      new APIError(err?.status || 500, ["Something went wrong while user login", err.message || ""]).send(res);
    }
  };
  

export const Logout = async (req, res) => {
    try {
        req.logout(function (err) {
            if (err) return new APIError(500, ["Logout error", err.message]).send(res);
          
            // Clear sessionId in DB
            if (req.user?.role === 'user') {
              User.findByIdAndUpdate(req.user._id, { sessionId: null }).exec();
            } else if (req.user?.role === 'organization') {
              Organization.findByIdAndUpdate(req.user._id, { sessionId: null }).exec();
            } else if (req.user?.role === 'student') {
              Student.findByIdAndUpdate(req.user._id, { sessionId: null }).exec();
            }
          
            req.session.destroy((err) => {
              if (err) return new APIError(500, ["Session destroy error", err.message]).send(res);
          
              res.clearCookie('connect.sid');
              return new APIResponse(200, null, "User logged out successfully!!").send(res);
            });
          });
          
    } catch (err) {
        console.log(err);
        new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while user logout", err.message || ""]).send(res);
    }
};

//authorization through role 
// export const authorizeRoles = (...allowedRoles) => {
//     return (req, res, next) => {
//         if (!req.user || !allowedRoles.includes(req.user.role)) {
//             return new APIError(403, ["Access denied: insufficient permissions"]).send(res);
//         }
//         next();
//     };
// };

export const organizationLogin = async (req, res) => {
    try {
      const lastLogin = new Date();
      const rememberMe = req.body.rememberMe;
  
      // Set session cookie expiration
      req.session.cookie.maxAge = rememberMe
        ? 1000 * 60 * 60 * 24 * 7 // 7 days
        : 1000 * 60 * 60 * 24 * 1; // 1 day
  
      const sessionId = req.sessionID;
  
      // Fetch existing organization (to get any old session)
      const existingOrg = await Organization.findById(req.user._id);
  
      // Destroy previous session if it exists and is different
      if (existingOrg.sessionId && existingOrg.sessionId !== sessionId) {
        sessionStore.destroy(existingOrg.sessionId, (err) => {
          if (err) {
            console.error("Error destroying previous session:", err);
          } else {
            console.log("Previous session destroyed successfully.");
          }
        });
      }
  
      // Update organization sessionId and lastLogin
      const organization = await Organization.findByIdAndUpdate(
        req.user._id,
        { lastLogin, sessionId },
        { new: true }
      );
  
      return new APIResponse(
        200,
        { user: { ...organization.toObject(), role: "organization" } },
        "Organization logged in successfully!!"
      ).send(res);
    } catch (err) {
      console.log(err);
      new APIError(
        err?.response?.status || err?.status || 500,
        ["Something went wrong while organization login", err.message || ""]
      ).send(res);
    }
  };
  
  export const instituteLogin = async (req, res) => {
    try {
      const lastLogin = new Date();
      const rememberMe = req.body.rememberMe;
  
      req.session.cookie.maxAge = rememberMe
        ? 1000 * 60 * 60 * 24 * 7 // 7 days
        : 1000 * 60 * 60 * 24 * 1; // 1 day
  
      const sessionId = req.sessionID;
  
      let role;
      let institute;
  
      if (req.user.role === 'user') {
        const existingUser = await User.findById(req.user._id);
  
        // Destroy previous session if exists and different
        if (existingUser.sessionId && existingUser.sessionId !== sessionId) {
          sessionStore.destroy(existingUser.sessionId, (err) => {
            if (err) console.error('Error destroying old session:', err);
            else console.log('Previous user session destroyed.');
          });
        }
  
        institute = await User.findByIdAndUpdate(
          req.user._id,
          { lastLogin, sessionId },
          { new: true }
        );
        role = 'user';
  
      } else if (req.user.role === 'organization') {
        const existingOrg = await Organization.findById(req.user._id);
  
        // Destroy previous session if exists and different
        if (existingOrg.sessionId && existingOrg.sessionId !== sessionId) {
          sessionStore.destroy(existingOrg.sessionId, (err) => {
            if (err) console.error('Error destroying old session:', err);
            else console.log('Previous org session destroyed.');
          });
        }
  
        institute = await Organization.findByIdAndUpdate(
          req.user._id,
          { lastLogin, sessionId },
          { new: true }
        );
        role = 'organization';
      }
  
      return new APIResponse(
        200,
        { user: { ...institute.toObject(), role } },
        'User logged in successfully!!'
      ).send(res);
  
    } catch (err) {
      console.log(err);
      new APIError(
        err?.response?.status || err?.status || 500,
        ['Something went wrong while institute login', err.message || '']
      ).send(res);
    }
  };
  

  export const studentLogin = async (req, res) => {
    try {
      const lastLogin = new Date();
      const rememberMe = req.body.rememberMe;
  
      req.session.cookie.maxAge = rememberMe
        ? 1000 * 60 * 60 * 24 * 7 // 7 days
        : 1000 * 60 * 60 * 24 * 1; // 1 day
  
      const sessionId = req.sessionID;
  
      // Fetch the current student record to get previous sessionId
      const existingStudent = await Student.findById(req.user._id);
  
      // Destroy previous session if exists and different
      if (existingStudent.sessionId && existingStudent.sessionId !== sessionId) {
        sessionStore.destroy(existingStudent.sessionId, (err) => {
          if (err) console.error('Error destroying old student session:', err);
          else console.log('Previous student session destroyed.');
        });
      }
  
      // Update student with last login and new sessionId
      const student = await Student.findByIdAndUpdate(
        req.user._id,
        { lastLogin, sessionId },
        { new: true }
      );
  
      return new APIResponse(
        200,
        { user: { ...student.toObject(), role: 'student' } },
        'Student logged in successfully!!'
      ).send(res);
  
    } catch (err) {
      console.log(err);
      new APIError(
        err?.response?.status || err?.status || 500,
        ['Something went wrong while student login', err.message || '']
      ).send(res);
    }
  };
  

export const checkAuth = async (req, res) => {
    console.log('CheckAuth - User:', req.user);
    console.log('CheckAuth - Session:', req.session);
    
    return new APIResponse(200, { user: req.user }, 'session found').send(res);
  };