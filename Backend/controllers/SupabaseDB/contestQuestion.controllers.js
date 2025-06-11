import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js";
import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js";
import { fetchContestQuestions, saveContestQuestion } from "../../utils/SqlQueries/contestQuestion.queries.js";

export const addContestQuestion = async (req, res) => {
    try{
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

export const getContestQuestions = async (req, res) => {
    try {
        const { contest_id } = req.query;
        console.log("Fetching questions for contest ID:", contest_id);

        if (!contest_id) {
            return new APIError(400, ["Contest ID is required"]).send(res);
        }

        const questions = await fetchContestQuestions(contest_id);

        if (!questions || questions.length === 0) {
            return new APIResponse(404, [], "No questions found for this contest").send(res);
        }

        return new APIResponse(200, questions, "Contest questions retrieved successfully").send(res);
    } catch (error) {
        console.error("❌ Error retrieving contest questions:", error);
        return new APIError(500, ["Failed to retrieve contest questions", error.message]).send(res);
    }
}