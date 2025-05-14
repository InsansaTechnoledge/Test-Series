import { fetchQuestionsSelectively, updateQuestion ,deleteQuestion, deleteQuestionsBulk} from "../../utils/SqlQueries/questions.queries.js";
import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js";
import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js";

export const updateQuestionById = async (req, res) => {
    try {
        const { id } = req.params;
        const question = req.body;

        const updatedQuestions = await updateQuestion(question, id);

        return new APIResponse(200, updatedQuestions, "Question updated successfully!");

    }
    catch (err) {
        console.log(err);
        new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while updating the questions", err.message || ""]).send(res);

    }
}


export const getAllQuestionsSelectively = async (req, res) => {
    const condition = req.query;

    try {
        const data = await fetchQuestionsSelectively(condition);
        return new APIResponse(200, data, "Questions fetched successfully!").send(res);
    } catch (e) {
        new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while updating the questions", err.message || ""]).send(res);

    }
};

export const deleteQuestions = async (req, res) => {
    const { ids } = req.body;

    try {
        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ message: "ids must be an array of question IDs" });
        }

        const deleted = ids.length === 1
            ? await deleteQuestion(ids[0])
            : await deleteQuestionsBulk(ids);

        return new APIResponse(200, deleted, "Deleted successfully").send(res);

    } catch (e) {
        res.status(500).json({ message: e.message });
        new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while deleting the questions", err.message || ""]).send(res);

    }
};