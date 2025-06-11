import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js";
import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js";
import { createContestQuery } from "../../utils/SqlQueries/contest.queries.js";

export const createContest = async(req, res) => {
    const {selectedBatches,...payload} = req.body;
    try {
        const orgId = req.user?.role === 'organization' ? req.user._id : req.user.organizationId ;
console.log("Creating contest with payload:", payload);
        if (!orgId) {
            return new APIError(400, ['Missing organization ID in auth context']).send(res);
        }

        payload.organization_id = orgId;
        payload.created_at=new Date().toISOString();



console.log("Creating contest with payload:", payload);
        const contest = await createContestQuery(payload);
        return new APIResponse(200, contest, "Contest created successfully").send(res);
    } catch (err) {
        console.error("❌ Error creating contest:", err);
        return new APIError(
            err?.status || 500,
            ["Something went wrong while creating contest", err?.message]
        ).send(res);
    }
};