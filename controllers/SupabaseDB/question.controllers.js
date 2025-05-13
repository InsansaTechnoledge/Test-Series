import { updateQuestion } from "../../SqlQueries/questions.queries";
import { APIError } from "../../utils/ResponseAndError/ApiError.utils";
import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils";

export const updateQuestionById = async (req, res) => {
    try{
        const {id} = req.params;
        const question = req.body;

        const updatedQuestions = await updateQuestion(question, id);

        return new APIResponse(200, updatedQuestions, "Question updated successfully!");
        
    }
    catch(err){
        console.log(err);
        return new APIError(500, ["Something went wrong while updating question", err.message]).send(res);
    }
}