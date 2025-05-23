import { calculateResult } from "../../../TestSeries/features/Test/utils/resultCalculator.js";
import Result from "../../models/SecondDB/result.model.js";
import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js";
import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js";
import { fetchExamNameById } from "../../utils/SqlQueries/exam.queries.js";
import { fetchQuestionsSelectively } from "../../utils/SqlQueries/questions.queries.js";

export const addResult = async (req, res) => {
    try {
        const resultData = req.body;
        console.log(resultData);
        const result = await Result.create(resultData);

        await updateRanksForExam(resultData.examId);
        return new APIResponse(200, result, "Result added successfully!").send(res);
    }
    catch (err) {
        console.log(err);
        return new APIError(err?.response?.status || 500, ["Something went wrong while adding result", err.message]).send(res);
    }
}

export const updateResult = async (req, res) => {
    try {
        const { id } = req.params;
        const resultData = req.body;
        const result = await Result.findByIdAndUpdate(id, resultData);
        return new APIResponse(200, result, "Result Updated").send(res);

    }
    catch (err) {
        console.log(err);
        return new APIError(err?.response?.status || 500, ["Something went wrong while updating result", err.message]).send(res);
    }
}

export const fetchStudentResults = async (req, res) => {
    try {
      const studentId = req.user._id;
  
      if (!studentId) {
        return new APIError(400, ["Invalid student ID or session expired"]).send(res);
      }
  
      let studentResults = await Result.find(
        { studentId },
        { examId: 1, marks: 1, rank: 1, status: 1, createdAt: 1, updatedAt: 1, resultDate: 1 }
      );
      
      if (!studentResults || studentResults.length === 0) {
        return new APIResponse(400, ["No results yet"]).send(res);
      }
  
      const completeResults = await Promise.all(
        studentResults.map(async (result) => {
          try {
            const examName = await fetchExamNameById(result.examId);
            return {
              ...result._doc, 
              examName,
            };
          } catch (e) {
            return {
              ...result._doc,
              examName: "Unknown Exam",
            };
          }
        })
      );
  
      return new APIResponse(200, completeResults, "Results fetched").send(res);
  
    } catch (err) {
      console.log(err);
      return new APIError(
        err?.response?.status || 500,
        ["Something went wrong while fetching student result", err.message]
      ).send(res);
    }
  };

export const fetchDetailedResultById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return new APIError(400, ["Invalid id for fetching result"]).send(res);
        }

        const result = await Result.findById(id);

        if (!result) {
            new APIError(404, ["Result not found"]).send(res);
        }

        return new APIResponse(200, "Result fetched successfully!").send(res);
    }
    catch (err) {
        console.log(err);
        return new APIError(err?.response?.status || 500, ["Something went wrong while fetching result", err.message]).send(res);
    }
}

// export const fetchAllResultsForExam = async (req, res) => {
//     try{

//         const { id } = req.params;
//         if (!id) {
//             return new APIError(400, ["Invalid exam id for fetching result"]).send(res);
//         }

//         const results = await Result.find({examId: id})
//         .select("marks rank status studentId")
//         .populate('studentId', 'name studentId');

//         if(!results || results.length==0){
//             return new APIResponse(404, ["Results for exam not found"]).send(res);
//         }

//         return new APIResponse(200, "Results fetched successfully!").send(res);
//     }
//     catch(err){
//         console.log(err);
//         return new APIError(err?.response?.status || 500, ["Something went wrong while fetching result", err.message]).send(res);
//     }

// }

export const fetchAllResultsForExam = async (req, res) => {
    try {
      const studentId = req.user._id;
      const { examId } = req.params;
  
      const result = await Result.findOne({ studentId, examId });
  
      if (!result) {
        return new APIError(404, ["Result not found"]).send(res);
      }
  
      // ✅ Fetch questions from Supabase
      const questions = await fetchQuestionsSelectively({ exam_id: examId });
  
      // ✅ Fetch exam name
      const { name: examName } = await fetchExamNameById(examId);
  
      // ✅ Return result + questions + exam name
      return new APIResponse(
        200,
        {
          ...result._doc,
          examName,
          questions,
        },
        "Result and questions fetched"
      ).send(res);
    } catch (err) {
      console.error("Error in fetchAllResultsForExam:", err);
      return new APIError(500, ["Failed to fetch result and questions", err.message]).send(res);
    }
  };

export const deleteResult = async (req,res) => {
    try{
        const {id} = req.params;
        if(!id){
            return new APIError(400, ["Result ID not found"]).send(res);
        }

        const result = findByIdAndDelete(id);

        if(!result){
            return new APIError(404, ["Result not found or result already deleted"]).send(res);
        }

        return new APIResponse(200, result, "Result deleted successfully").send(res);
    }
    catch(err){
        console.log(err);
        return new APIError(err?.response?.status || 500, ["Something went wrong while deleting result", err.message]).send(res);    
    }
}


// To calculate rank in particular exam
export const updateRanksForExam = async (examId) => {
  try {
    const results = await Result.find({ examId }).sort({ marks: -1 });

    let currentRank = 1;
    let lastMarks = null;

    const bulkOps = [];

    for (let i = 0; i < results.length; i++) {
      const result = results[i];

      // Update rank only when marks change (dense ranking)
      if (lastMarks !== null && result.marks !== lastMarks) {
        currentRank = i + 1;
      }

      if (!result.rank || result.rank !== currentRank) {
        bulkOps.push({
          updateOne: {
            filter: { _id: result._id },
            update: { $set: { rank: currentRank } }
          }
        });
      }

      lastMarks = result.marks;
    }

    if (bulkOps.length > 0) {
      await Result.bulkWrite(bulkOps);
      console.log(`Ranks updated for exam ${examId}`);
    } else {
      console.log(`No rank changes needed for exam ${examId}`);
    }
  } catch (err) {
    console.error(`Failed to update ranks for exam ${examId}:`, err);
    throw err;
  }
};