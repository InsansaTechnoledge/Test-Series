import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js";
import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js";
import { Organization } from "../../models/FirstDB/organization.model.js";
import User from "../../models/FirstDB/user.model.js";
import Student from "../../models/FirstDB/student.model.js";

export const UserLogin = async (req, res) => {
    try {
        const lastLogin = new Date();

        const rememberMe = req.body.rememberMe;

        if (rememberMe) {
            req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7; // 7 days
        }
        else {
            req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 1;
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { lastLogin: lastLogin },
            { new: true }
        );

        return new APIResponse(200, ["User logged in successfully!!"], user).send(res);

    } catch (err) {
        console.log(err);
new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while user login", err.message || ""]).send(res);

    }
};

export const UserLogout = async (req, res) => {
    try {
        req.logout(function (err) {
            if (err) {
                return new APIError(500, ["Something went wrong while loging out user", err.message]).send(res);
            }

            req.session.destroy((err) => {
                if (err) {
                    return new APIError(500, ["Something went wrong while loging out user", err.message]).send(res);
                }

                res.clearCookie('connect.sid');
                return new APIResponse(200, ["User logged out successfully!!"]).send(res);
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

        if (rememberMe) {
            req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7; // 7 days
        }
        else {
            req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 1;
        }

        const organization = await Organization.findByIdAndUpdate(
            req.user._id,
            { lastLogin: lastLogin },
            { new: true }
        );

        organizationObject = organization.toObject();
        delete organizationObject.password;

        return new APIResponse(200, ["Organization logged in successfully!!"], organizationObject).send(res);

    } catch (err) {
        console.log(err);
        new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while organization login", err.message || ""]).send(res);
    }
};

export const organizationLogout = async (req, res) => {
    try {
        req.logout(function (err) {
            if (err) {
                return new APIError(500, ["Something went wrong while loging out organization", err.message]).send(res);
            }

            req.session.destroy((err) => {
                if (err) {
                    return new APIError(500, ["Something went wrong while loging out organization", err.message]).send(res);
                }

                res.clearCookie('connect.sid');
                return new APIResponse(200, ["Organization logged out successfully!!"]).send(res);
            });

        });
    } catch (err) {
        console.log(err);
        new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while organization logout", err.message || ""]).send(res);
    }
}; 

export const studentLogin = async (req, res) => {
    try {
        const lastLogin = new Date();

        const rememberMe = req.body.rememberMe;

        if (rememberMe) {
            req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7; // 7 days
        }
        else {
            req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 1;
        }

        const student = await Student.findByIdAndUpdate(
            req.user._id,
            { lastLogin: lastLogin },
            { new: true }
        );

        studentObject = student.toObject();
        delete studentObject.password;

        return new APIResponse(200, ["Student logged in successfully!!"], studentObject).send(res);

    } catch (err) {
        console.log(err);
        new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while student login", err.message || ""]).send(res);
    }
};

export const studentLogout = async (req, res) => {
    try {
        req.logout(function (err) {
            if (err) {
                return new APIError(500, ["Something went wrong while loging out student", err.message]).send(res);
            }

            req.session.destroy((err) => {
                if (err) {
                    return new APIError(500, ["Something went wrong while loging out student", err.message]).send(res);
                }

                res.clearCookie('connect.sid');
                return new APIResponse(200, ["Student logged out successfully!!"]).send(res);
            });

        });
    } catch (err) {
        console.log(err);
        new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while student logout", err.message || ""]).send(res);
    }
};

export const checkAuth = async (req, res) => {
  return new APIResponse(200, { user: req.user }, 'session found').send(res);
};