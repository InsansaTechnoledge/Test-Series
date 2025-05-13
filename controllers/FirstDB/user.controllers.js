import User from "../../models/FirstDB/user.model.js";
import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js";
import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js";

export const registerUser = async (req, res) => {
    try {
        //when we get register one default email will send to user with id and password
        const userData = req.body;
        const user = await User.create(userData);

        return new APIResponse(200, ["User registered successfully!!"], user).send(res);

    } catch (err) {
        console.log(err);
      new APIError(err?.response?.status || err?.status || 500, ["Something went wrong", err.message || ""]).send(res);
    }

};

export const updateUser = async (req, res) => {
    const { userId, Data } = req.body;
    try {
        const user = await User.findOneAndUpdate(
            { userId },
            { $set: Data },
            { new: true }
        );

        return new APIResponse(200, ["User updated successfully!!"], user).send(res);

    } catch (err) {
        console.log(err);
        new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while updating user", err.message || ""]).send(res);
    }

};

export const changePassword = async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;

    try {
        const user = await User.findOne({ userId }).select('+password');
        if (!user) {
            return new APIError(404, ["User not found!!"]).send(res);
        };
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return new APIError(401, ["Old password is incorrect!!"]).send(res);
        };
        user.password = newPassword;
        await user.save();
        return new APIResponse(200, ["Password updated successfully!!"]).send(res);
    } catch (err) {
        console.log(err);
        new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while updating password", err.message || ""]).send(res);

    }

};

//here after checking all middleware we are updating the password
//middleware is remaining
export const forgotPassword = async (req, res) => {
    const { userId, password } = req.body;
    try {
        const user = await findOneAndUpdate({ userId }, {
            password
        });
        new APIResponse(200, ["Password updated successfully!!"]).send(res);

    } catch (err) {
        console.log(err);
       new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while updating the password", err.message || ""]).send(res);
    }

};

export const deleteUser = async (req, res) => {
    const { userId } = req.body;
    try {
        const user = await User.findOneAndDelete({ userId });
        new APIResponse(200, ["User deleted successfully!!"]).send(res);
    } catch (err) {
        console.log(err);
        new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while deleting the user", err.message || ""]).send(res);
    }
};

//for the profile page
export const getUser = async (req, res) => {
    const { userId } = req.body;
    try {
        const user = await User.findOne({ userId }).lean();
        if (!user) {
            return new APIError(404, ["User not found!!"]).send(res);
        };
        
        return new APIResponse(200, ["User fetched successfully!!"], user).send(res);
    }
    catch (err) {
        console.log(err);
new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while fetching the user", err.message || ""]).send(res);
    }
 };

