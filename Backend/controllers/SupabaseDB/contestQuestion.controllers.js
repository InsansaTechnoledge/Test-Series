import { APIError } from "../../utils/ResponseAndError/ApiError.utils";

export const addContestQuestion = async (req, res) => {
    try{
        const {contestId,questionData}=req.body;
        if(!contestId || !questionData){
            return new APIError(400, ["Contest ID and question data are required"]).send(res);
        }

        questionData.organization_id = req.user?.role=== 'organization' ? req.user._id : req.user.organizationId;
        questionData.created_at=new Date();

        

    }catch(error){
        console.log("❌ Error adding contest question:", error);
        return new APIError(500, ["Failed to add contest question", error.message]).send(res);
    }
};