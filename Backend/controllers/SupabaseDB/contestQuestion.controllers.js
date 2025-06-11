import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js";
import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js";
import { saveContestQuestion } from "../../utils/SqlQueries/contestQuestion.queries.js";

export const addContestQuestion = async (req, res) => {
    try{
        console.log(req.body);
        const questionData=req.body;
        console.log(questionData)
        if(!questionData.contest_id){
            return new APIError(400, ["Contest ID and question data are required"]).send(res);
        }
        questionData.created_at=new Date();

        const contestQuestion = await saveContestQuestion(questionData);
        
        return new APIResponse(200, contestQuestion, "Contest question added successfully!").send(res);



    }catch(error){
        console.log("❌ Error adding contest question:", error);
        return new APIError(500, ["Failed to add contest question", error.message]).send(res);
    }
};