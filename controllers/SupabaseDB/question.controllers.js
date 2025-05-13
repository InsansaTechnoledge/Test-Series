import { APIError } from "../../utils/ResponseAndError/ApiError.utils";
import {fetchQuestionsByExam , deleteQuestion , deleteQuestionsBulk} from '../../SqlQueries/questions.queries.js'

export const updateQuestion = async (req, res) => {
    try{

    }
    catch(err){
        console.log(err);
        return new APIError(500, ["Something went wrong while updating question", err.message]).send(res);
    }
}


export const getAllQuestionsByExam = async (req, res) => {
    const { examId } = req.params;
  
    try {
      const data = await fetchQuestionsByExam(examId);
      res.status(200).json(data);
    } catch (e) {
      res.status(500).json({ message: e.message });
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
  
      res.status(200).json({ message: "Deleted successfully", deleted });
  
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
};