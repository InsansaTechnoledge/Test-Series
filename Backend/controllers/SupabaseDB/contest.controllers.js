import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js";
import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js";
// import { createContestQuery, deleteContest, fetchContest } from "../../utils/SqlQueries/contest.queries.js";
import { createContestQuery, enrollStudentToContestQuery, fetchContest, deleteContest } from "../../utils/SqlQueries/contest.queries.js";

export const createContest = async (req, res) => {
    const payload = req.body;
    try {
        const orgId = req.user?.role === 'organization' ? req.user._id : (req.user.organizationId._id || req.user.organizationId);
        if (!orgId) {
            return new APIError(400, ['Missing organization ID in auth context']).send(res);
        }

        payload.organization_id = orgId;
        payload.created_at = new Date().toISOString();
        payload.updated_at = new Date().toISOString();

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
        const batchId = req.query.batchId;
        const userId = req.user.role === 'student' ? req.user._id : null;
        const organizationId = req.user?._id || req.user?.organizationId;


        if (!organizationId) {
            console.log("orgId not found", req.user);
            return new APIError(400, 'OrgId not found, try after login again').send(res);
        }

        const data = await fetchContest(organizationId, batchId, userId);

        if (!data || data.length === 0) {
            return new APIResponse(400, [], 'No contests found').send(res);
        }

        return new APIResponse(200, data, 'Contest fetching successful').send(res);
    } catch (e) {
        console.error("Error Fetching Contest:", e.message, e.stack);
        return new APIError(500, ['There was an error in fetching contest details', e.message]).send(res);
    }
};

export const DeleteContest = async (req, res) => {
    try {

        const id = req.params.id

        const deleteData = await deleteContest(id)

        if (!deleteData) return new APIError(400, "could not delete contest").send(res);

        return new APIResponse(200, 'contest deleted successfully').send(res);

    } catch (e) {
        return new APIError(500, 'something went wrong while deleting contest').send(res);
    };
}

export const enrollStudentToContest = async (req, res) => {
    const { contestId } = req.body;

    if (!contestId) {
        return new APIError(400, 'Contest ID and User ID are required').send(res);
    }

    try {
        // Assuming you have a function to enroll the student to the contest
        const result = await enrollStudentToContestQuery(contestId, req.user._id);

        if (result.error) {
            throw new Error(result.error.message);
        }

        return new APIResponse(200, result, 'Successfully enrolled in contest').send(res);
    } catch (error) {
        console.error("Error enrolling student to contest:", error);
        return new APIError(500, ['Failed to enroll in contest', error.message]).send(res);
    }
}

export const getenrolledContest = async (req, res) => {
    const userId = req.user._id;

    if (!userId) {
        return new APIError(400, 'User ID is required').send(res);
    }

    try {
        const contests = await fetchContest((req.user.organizationId._id || req.user.organizationId), null, userId);

        if (!contests || contests.length === 0) {
            return new APIError(404, 'No enrolled contests found').send(res);
        }

        return new APIResponse(200, contests, 'Enrolled contests fetched successfully').send(res);
    } catch (error) {
        console.error("Error fetching enrolled contests:", error);
        return new APIError(500, ['Failed to fetch enrolled contests', error.message]).send(res);
    }
}
