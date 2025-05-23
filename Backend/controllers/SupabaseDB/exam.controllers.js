import { createExam, deleteExam, fetchSelective, updateExam , setExamLive, getExamOrganization , fetchNonLiveExams } from '../../utils/SqlQueries/exam.queries.js';
import {APIError} from '../../utils/ResponseAndError/ApiError.utils.js'
import {APIResponse} from '../../utils/ResponseAndError/ApiResponse.utils.js'

export const addExam = async (req, res) => {
    try {
      const examData = req.body;
  
      const examDataWithUpdateMetaData = {
        ...examData,
        total_marks: Number(examData.total_marks),
        duration: Number(examData.duration),
        updated_at: new Date(),
        updated_by: examData.organization_id
      };
  
      const exam = await createExam(examDataWithUpdateMetaData);
  
      return new APIResponse(200, exam, "Exam created successfully").send(res);
    } catch (err) {
      console.error("❌ Exam creation error:", err?.message || err, err?.stack || "");
      return new APIError(
        err?.status || 500,
        ["Something went wrong while creating exam", err?.message || JSON.stringify(err)]
      ).send(res);
    }
  };
  
  
export const updateExamById = async (req,res) => {
    try{
        const {id} = req.params;
        const examData = req.body;

        const examDataWithUpdateMetaData = {
            ...examData,
            updated_at: Date.now(),
            updated_by: req.user._id
        }
        const exam = await updateExam(examDataWithUpdateMetaData, id);

        return new APIResponse(200, exam, 'Exam Updated successfully').send(res);
    }
    catch(err){
        console.log(err);
        return new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while updating exam", err.message]).send(res);   
    }
}

export const fetchExamBasedOnCondition = async (req,res) => {
    try{
        const query = req.query;
        const exams = await fetchSelective(query);

        return new APIResponse(200, exams, "Exams fetched successfully!").send(res);
    }
    catch(err){
        console.log(err);
        return new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while fetching exam", err.message]).send(res);   
    }
}

export const deleteExamById = async (req,res) => {
    try{
        const {id} = req.params;
        const exam = await deleteExam(id);

        return new APIResponse(200, exam, "Deleted successfully").send(res);
    }
    catch(err){
        console.log(err);
        return new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while fetching exam", err.message]).send(res);  
    }
}


export const goLiveExamById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const orgId =
        req.user?.organizationId ||
        req.user?.orgId ||
        req.user?._id;
  
      if (!orgId) {
        return new APIError(400, ['Missing organization ID in auth context']).send(res);
      }
  
      const existingExam = await getExamOrganization(id);
  
      console.log("🟡 DB org ID:", existingExam.organization_id);
      console.log("🟢 Auth org ID:", orgId);


      if (String(existingExam.organization_id) !== String(orgId)) {
        return new APIError(403, ['Unauthorized: This exam does not belong to your organization']).send(res);
      }
      

      
  
      const exam = await setExamLive(id);
  
      return new APIResponse(200, exam, "Exam is now live").send(res);
    } catch (err) {
      console.error("❌ Error setting exam live:", err);
      return new APIError(
        err?.status || 500,
        ["Something went wrong while going live", err?.message]
      ).send(res);
    }
  };

  export const getUpcomingExams = async (req, res) => {
    try {
      const orgId = req.user?.organizationId || req.user?.orgId || req.user?._id;
  
      if (!orgId) {
        return new APIError(400, ['Missing organization ID']).send(res);
      }
  
      const exams = await fetchNonLiveExams(orgId);
  
      return new APIResponse(200, exams, "Upcoming exams fetched successfully").send(res);
    } catch (err) {
      console.error("❌ Error fetching upcoming exams:", err);
      return new APIError(
        err?.status || 500,
        ["Something went wrong while fetching upcoming exams", err?.message]
      ).send(res);
    }
  };