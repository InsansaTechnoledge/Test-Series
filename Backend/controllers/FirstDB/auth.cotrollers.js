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
      // ✅ Step 1: Capture the user ID and role BEFORE calling logout
      const userId = req.user?._id;
      const role = req.user?.role;
  
      if (!userId || !role) {
        return new APIError(400, ['Invalid user session']).send(res);
      }
  
      // ✅ Step 2: Set sessionId to null in DB
      if (role === 'user') {
        await User.findByIdAndUpdate(userId, { sessionId: null });
      } else if (role === 'organization') {
        await Organization.findByIdAndUpdate(userId, { sessionId: null });
      } else if (role === 'student') {
        await Student.findByIdAndUpdate(userId, { sessionId: null });
      }
  
      // ✅ Step 3: Logout using Passport
      await new Promise((resolve, reject) => {
        req.logout(err => {
          if (err) return reject(err);
          resolve();
        });
      });
  
      // ✅ Step 4: Destroy session
      await new Promise((resolve, reject) => {
        req.session.destroy(err => {
          if (err) return reject(err);
          resolve();
        });
      });
  
      // ✅ Step 5: Clear cookie
      res.clearCookie('connect.sid');
  
      // ✅ Step 6: Respond
      return new APIResponse(200, null, "User logged out successfully!!").send(res);
  
    } catch (err) {
      console.error("Logout Error:", err);
      return new APIError(err?.status || 500, [
        "Something went wrong while logging out",
        err.message || "",
      ]).send(res);
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