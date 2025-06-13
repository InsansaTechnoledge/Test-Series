import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js";
import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js";
import { createContestQuery, fetchContest } from "../../utils/SqlQueries/contest.queries.js";

export const createContest = async(req, res) => {
    const payload = req.body;
    try {
        const orgId = req.user?.role === 'organization' ? req.user._id : req.user.organizationId ;
        if (!orgId) {
            return new APIError(400, ['Missing organization ID in auth context']).send(res);
        }

        payload.organization_id = orgId;
        payload.created_at=new Date().toISOString();
        payload.updated_at=new Date().toISOString();
        
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

export const FetchContest = async (req, res) => {
    try {
      const organizationId = req.user?._id || req.user?.organizationId;
  
      if (!organizationId) {
        console.log("orgId not found", req.user);
        return new APIError(400, 'OrgId not found, try after login again').send(res);
      }
  
      const data = await fetchContest(organizationId);
  
      if (!data || data.length === 0) {
        return new APIError(404, 'Contest details not found').send(res);
      }
  
      return new APIResponse(200, data, 'Contest fetching successful').send(res);
    } catch (e) {
      console.error("Error Fetching Contest:", e.message, e.stack);
      return new APIError(500, ['There was an error in fetching contest details', e.message]).send(res);
    }
  };