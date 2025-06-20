import User from "../../models/FirstDB/user.model.js";
import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js";
import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js";

export const registerUser = async (req, res) => {
    try {
        //when we get register one default email will send to user with id and password
        const userData = req.body;

        let batchArray = req.body['batch[]'] || req.body.batch;
        if (!Array.isArray(batchArray)) {
            batchArray = batchArray ? batchArray.split(",") : [];
        }

        userData.batch = batchArray;

        userData.createdBy = {
            id: req.user._id || req.user.id,
            model: req.user.role === "organization" ? "Organization" : "User"
        };
        userData.updatedBy = {
            id: req.user._id || req.user.id,
            model: req.user.role === "organization" ? "Organization" : "User"
        };
        userData.organizationId = req.user.role === "organization" ? req.user._id : (req.user.organizationId ? req.user.organizationId._id || req.user.organizationId : null);

        const user = await User.create(userData);

        return new APIResponse(200, user, "User registered successfully!!",).send(res);

    } catch (err) {
        console.log(err);
        new APIError(err?.response?.status || err?.status || 500, ["Something went wrong", err.message || ""]).send(res);
    }

};

export const updateUser = async (req, res) => {
    const { userId, Data } = req.body;
  
    if (!userId) {
      return new APIError(400, ["UserId is required!!"]).send(res);
    }
  
    if (!Data) {
      return new APIError(400, ["Data is required!!"]).send(res);
    }
  
    try {
      // If Data.batch is a stringified JSON, parse it
      if (Data.batch && typeof Data.batch === "string") {
        Data.batch = JSON.parse(Data.batch);
      }
  
      // Add updatedBy information
      Data.updatedBy = {
        id: req.user._id || req.user.id,
        model: req.user.role === "organization" ? "Organization" : "User"
      };
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: Data },
        { new: true }
      );
  
      if (!updatedUser) {
        return new APIError(404, ["User not found"]).send(res);
      }
  
      return new APIResponse(200, updatedUser, "User updated successfully!").send(res);
  
    } catch (err) {
      console.error(err);
      return new APIError(500, [
        "Something went wrong while updating user",
        err.message || ""
      ]).send(res);
    }
  };
  

// export const updateUsersFunction = async (userIds, Data, requestedUser) => {

//     Data.updatedBy = {
//         id: requestedUser._id || requestedUser.id,
//         model: requestedUser.role === "organization" ? "Organization" : "User"
//     };
//     const user = await User.updateMany(
//         { _id: { $in: userIds } },
//          { $addToSet: { batch: { $each: Data } } },
//          {$set: Data},
//     );
//     if (!user) {
//         return new Error(404, ["User not found"]);
//     }
// }

export const updateUsersFunction = async (userIds, Data, requestedUser) => {
    Data.updatedBy = {
        id: requestedUser._id || requestedUser.id,
        model: requestedUser.role === "organization" ? "Organization" : "User"
    };

    const updateOps = {
        $set: { ...Data },
    };
//if data  faculties has to add the batch to array
    if (Data.batchAdd) {
        updateOps.$addToSet = {
            batch: { $each: Array.isArray(Data.batchAdd) ? Data.batchAdd : [Data.batchAdd] }
        };

        delete updateOps.$set.batch;
    }
//if faculty has to remove the batch from array
    if (Data.batchRemove) {
        updateOps.$pull = {
            batch: { $in: Array.isArray(Data.batchRemove) ? Data.batchRemove : [Data.batchRemove] }
        };
    }

    const result = await User.updateMany(
        { _id: { $in: userIds } },
        updateOps
    );

    if (result.matchedCount === 0) {
        throw new Error("User(s) not found");
    }

    return result;
};


export const changePassword = async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;

    try {

        const user = await User.findById(userId).select('+password');
        if (!user) {
            return new APIError(404, ["User not found!!"]).send(res);
        };
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return new APIError(401, ["Old password is incorrect!!"]).send(res);
        };
        if (newPassword === oldPassword) {
            return new APIError(400, ["New password should not be same as old password!!"]).send(res);
        };
        user.password = newPassword;
        await user.save();
        return new APIResponse(200, user, "Password updated successfully!!").send(res);
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
        const user = await User.findByIdAndUpdate(userId, {
            $set: password
        },
            { new: true }
        );
        new APIResponse(200, user, "Password updated successfully!!").send(res);

    } catch (err) {
        console.log(err);
        new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while updating the password", err.message || ""]).send(res);
    }

};

export const deleteUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findByIdAndDelete(userId);
        new APIResponse(200, user, "User deleted successfully!!").send(res);
    } catch (err) {
        console.log(err);
        new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while deleting the user", err.message || ""]).send(res);
    }
};

//for the profile page
export const getUser = async (req, res) => {
    const { userId } = req.query;
    try {

        const orgId = req.user.role === "organization" ? req.user._id :  (
            req.user.organizationId ? req.user.organizationId._id || req.user.organizationId : null
        );
        let user;
        if (userId)
            user = await User.findOne({ _id: userId }).lean();
        else {
            if (req.user.role === 'student') {

                user = await User.find({
                    organizationId: orgId,
                    batch: { $in: Array.isArray(req.user.batch.currentBatch) ? req.user.batch.currentBatch : [req.user.batch.currentBatch] }
                }).lean();

            } else{

                user = await User.find({ organizationId: orgId }).lean();
                console.log("user", user);
            }
        }

        if (!user) {
            return new APIError(404, ["User not found!!"]).send(res);
        };

        return new APIResponse(200, user, "User fetched successfully!!").send(res);
    }
    catch (err) {
        console.log(err);
        new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while fetching the user", err.message || ""]).send(res);
    }
};

export const getUsersFromBatch = async (req, res) => {
    try {

        const { id } = req.params;
        if (!id) {
            return new APIError(400, ["Invalid batch id"]).send(res);
        }

        const users = await User.find({
            batch: {
                $in: id
            }
        })
            .select('-batch');

        if (users.length === 0) {
            return new APIError(404, ["Users not found"]).send(res);
        }

        return new APIResponse(200, users, "Users for batch fetched").send(res);
    }
    catch (err) {
        console.log(err);
        return new APIError(err.response.status || 500, ["Something went wrong while fetching users!!", err.response.message]).send(res);

    }
}