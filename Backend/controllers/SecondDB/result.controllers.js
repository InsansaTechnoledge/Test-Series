import { calculateResult } from "../../../TestSeries/features/Test/utils/resultCalculator.js";
import Result from "../../models/SecondDB/result.model.js";
import Student from "../../models/FirstDB/student.model.js";
import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js";
import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js";
import { fetchExamNameById, fetchExamNames } from "../../utils/SqlQueries/exam.queries.js";
import { fetchQuestionsSelectively } from "../../utils/SqlQueries/questions.queries.js";

export const addResult = async (req, res) => {
    try {
        const resultData = req.body;
        console.log(resultData);
        const result = await Result.create(resultData);

        // await updateRanksForExam(resultData.examId);
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
        { studentId }
      );
      
      if (!studentResults || studentResults.length === 0) {
        return new APIResponse(400, ["No results yet"]).send(res);
      }

      const examData=await fetchExamNames(req.user.batch?.currentBatch);

      const examMap={};
      (examData || []).forEach(exam => {
        examMap[exam.id] = exam.name;
      });
      console.log("Exam Map:", examMap);

      const completeResults = studentResults.map(result => {
        console.log("Result:", result);
        const examName = examMap[result.examId.toString()] || "Unknown Exam";
        return {
          ...result._doc,
          examName,
        };
      });

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
      const forAllStudents = req.query.forAllStudents === 'true';

  if(forAllStudents){
    // const results = await Result.find({ examId }).populate('studentId', 'name studentId');
    const results = await Result.find({ examId }).populate({
      path: 'studentId',
      model: Student, 
      select: 'name studentId'
    });

    if (!results || results.length === 0) {
      return new APIError(404, ["Results for exam not found"]).send(res);
    }
    const questions= await fetchQuestionsSelectively({ exam_id: examId });

    return new APIResponse(
      200,
      {
        results: results.map(result => ({
          ...result._doc,
          studentName: result.studentId.name,
          studentId: result.studentId.studentId
        })),
        questions
      },
      "Results and questions fetched successfully!"
    ).send(res);
    

  }
  else{
      const result = await Result.findOne({ studentId, examId });
  
      if (!result) {
        return new APIError(404, ["Result not found"]).send(res);
      }
  
      // ✅ Fetch questions from Supabase
      const questions = await fetchQuestionsSelectively({ exam_id: examId });

      console.log("Questions fetched:", questions);
  
      // ✅ Return result + questions + exam name
      return new APIResponse(
        200,
        {
          ...result._doc,
          questions,
        },
        "Result and questions fetched"
      ).send(res);
    }
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

export const fetchAllStudentResultByExamId = async (req, res) => {
  try {
    const examId = req.params.examId;

    if (!examId) {
      return new APIError(400, 'ExamId is required').send(res);
    }

    // Fetch results from ConnTwo
    const results = await Result.find({ examId: examId });

    if (!results || results.length === 0) {
      return new APIResponse(200, [], 'No results found for this exam').send(res);
    }

    // Extract unique student IDs
    const studentIds = [...new Set(results.map(result => result.studentId))];

    // Fetch student data from ConnOne
    const students = await Student.find({ 
      _id: { $in: studentIds } 
    }).select('_id name email'); // Select only needed fields

    // Create a map for quick student lookup
    const studentMap = new Map();
    students.forEach(student => {
      studentMap.set(student._id.toString(), student);
    });

    // Group results by studentId and keep only the best score for each student
    const bestResultsMap = new Map();
    
    results.forEach(result => {
      const studentId = result.studentId.toString();
      const currentScore = result.score || 0;
      
      if (!bestResultsMap.has(studentId) || 
          currentScore > (bestResultsMap.get(studentId).score || 0)) {
        bestResultsMap.set(studentId, result);
      }
    });

    // Convert map to array and combine with student information
    const enrichedResults = Array.from(bestResultsMap.values()).map(result => {
      const student = studentMap.get(result.studentId.toString());
      return {
        _id: result._id,
        examId: result.examId,
        studentId: result.studentId,
        studentName: student ? student.name : 'Unknown Student',
        studentEmail: student ? student.email : null,
        score: result.score,
        totalQuestions: result.totalQuestions,
        correctAnswers: result.correctAnswers,
        wrongAnswers: result.wrongAnswers,
        submittedAt: result.submittedAt,
        // Include any other fields from your Result model
        ...result.toObject()
      };
    });

    // Sort by score in descending order for leaderboard
    enrichedResults.sort((a, b) => (b.score || 0) - (a.score || 0));

    return new APIResponse(200, enrichedResults, 'Fetched student data successfully').send(res);

  } catch (e) {
    console.error('Error fetching leaderboard data:', e);
    return new APIError(500, ['Something went wrong while fetching leaderboard data', e.message]).send(res);
  }
}

