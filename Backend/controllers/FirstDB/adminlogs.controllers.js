import Student from "../../models/FirstDB/student.model.js"
import User from "../../models/FirstDB/user.model.js"
import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js";
import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js";

export const getActiveUsers = async (req, res) => {

    const orgId = req.user?._id
    try{
        const [users, students] = await Promise.all([
            User.find({organizationId : orgId}, 'email name sessionId updatedAt profilePhoto '),
            Student.find({organizationId : orgId} , 'email name sessionId updatedAt batch profilePhoto')
        ])

        const now = Date.now();

        const formatUser = (user, role) => ({
            id: user._id,
            name: user.name,
            email: user.email,
            lastLogin: user.updatedAt,
            online: !!user.sessionId,
            role,
            profilePhoto: user.profilePhoto || '' ,
            batch: user.batch || []
        });

        const result = [
            ...users.map(user => formatUser(user , 'user')),
            ...students.map(user => formatUser(user, 'student'))
        ]

        return new APIResponse(200 , result , 'logs fetched successfully').send(res);
    } catch (e) {
        return new APIError(500 , ['something went wrong' , e.message]).send(res);
    }
}