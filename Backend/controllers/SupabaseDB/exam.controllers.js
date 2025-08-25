import { createExam, deleteExam, fetchSelective, updateExam, setExamLive, fetchNonLiveExams, fetchExamsWithoutQuestionsQuery, fetchExamNameById, getExamCountForOrg, getAnalyticsFromBatchExam, addCertificate, addCertificateToContest, publishExamResultQuery } from '../../utils/SqlQueries/exam.queries.js';
import { APIError } from '../../utils/ResponseAndError/ApiError.utils.js'
import { APIResponse } from '../../utils/ResponseAndError/ApiResponse.utils.js'
import Result from '../../models/SecondDB/result.model.js';

export const addExam = async (req, res) => {
  try {
    const examData = req.body;

    // Ensure organization_id is present!
    if (!examData.organization_id) {
      examData.organization_id = req.user.role === 'organization' ? req.user._id : (req.user.organizationId._id || req.user.organizationId);
    }

    const examDataWithUpdateMetaData = {
      ...examData,
      total_marks: Number(examData.total_marks),
      duration: Number(examData.duration),
      updated_at: new Date(),
      updated_by: req.user._id,
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

export const updateExamById = async (req, res) => {
  try {
    const { id } = req.params;
    const examData = req.body;

    const examDataWithUpdateMetaData = {
      ...examData,
      total_marks: Number(examData.total_marks),
      duration: Number(examData.duration),
      updated_at: new Date(),
      updated_by: req.user._id
    }

    const exam = await updateExam(examDataWithUpdateMetaData, id);

    return new APIResponse(200, exam, 'Exam Updated successfully').send(res);
  }
  catch (err) {
    console.log(err);
    return new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while updating exam", err.message]).send(res);
  }
}

export const fetchExamBasedOnCondition = async (req, res) => {
  try {

    let baseQuery = {
      ...req.query,
      organization_id: req.user.role === 'organization' ? req.user._id : (req.user.organizationId._id || req.user.organizationId),
    };
    if (req.user.role === 'student') {
      baseQuery = {
        ...baseQuery,
        batch_id: req.user.batch.currentBatch, // Assuming student has a batchId field
      };
    }

    console.log("called")

    const exams = await fetchSelective(baseQuery);

    console.log("fv", exams)

    // If user is a student, mark attempted exams
    if (req.user.role === 'student') {
      const results = await Result.find({ studentId: req.user._id }, { examId: 1 });
      const attemptedExamIds = new Set(results.map(result => result.examId.toString()));
      const examList = exams.map(exam => ({
        ...exam,
        hasAttempted: attemptedExamIds.has(exam.id?.toString()),
      }));
      return new APIResponse(200, examList, "Exams fetched successfully!").send(res);
    }


    return new APIResponse(200, exams, "Exams fetched successfully!").send(res);
  } catch (err) {
    console.error("Error fetching exams:", err);
    return new APIError(err?.status || 500, ["Something went wrong while fetching exam", err.message]).send(res);
  }
};

export const deleteExamById = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await deleteExam(id, null);

    return new APIResponse(200, exam, "Deleted successfully").send(res);
  }
  catch (err) {
    console.log(err);
    return new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while fetching exam", err.message]).send(res);
  }
}

export const deleteExamByBatchId = async (batchId) => {
  const exams = await deleteExam(null, batchId);
  return exams;
}

export const goLiveExamById = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const orgId = req.user?.role === 'organization' ? req.user._id : (req.user.organizationId._id || req.user.organizationId) || req.user.orgId;

    if (!orgId) {
      return new APIError(400, ['Missing organization ID in auth context']).send(res);
    }

    const exam = await setExamLive(id, orgId, status);

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

// export const fetchExamsWithoutQuestions = async (req, res) => {
//   try {
//     const data = await fetchExamsWithoutQuestionsQuery();
//     return new APIResponse(200, data, "Exams without questions fetched successfully!").send(res);
//   } catch (err) {
//     console.error("Error fetching exams without questions:", err);
//     return new APIError(
//       err?.status || 500,
//       ["Something went wrong while fetching exams without questions", err.message]
//     ).send(res);
//   }
// };

export const fetchExamsWithoutQuestions = async (req, res) => {
  try {
    const orgId = req.user.role === 'organization' ? req.user._id : (req.user.organizationId._id || req.user.organizationId) || req.user.orgId;

    if (!orgId) {
      return new APIError(400, ['Organization ID not found']).send(res);
    }

    const examsWithoutQuestions = await fetchExamsWithoutQuestionsQuery(orgId);

    return new APIResponse(200, examsWithoutQuestions, "Exams without questions fetched successfully!").send(res);
  } catch (err) {
    console.error("❌ Error fetching exams without questions:", err);
    return new APIError(
      err?.status || 500,
      ["Something went wrong while fetching exams without questions", err.message]
    ).send(res);
  }
};

export const getTotalExamsForOrg = async (orgId) => {
  try {
    const exams = await getExamCountForOrg(orgId);
    return exams;
  } catch (err) {
    console.error("❌ Error fetching total exams for organization:", err);
    throw new APIError(
      err?.status || 500,
      ["Something went wrong while fetching total exams", err.message]
    );
  }
};

export const fetchAnalyticsExamAndBatch=async (req, res) => {
  try{

  const orgId = req.user.role === 'organization' ? req.user._id : (req.user.organizationId._id || req.user.organizationId);
  if (!orgId) {
    return new APIError(400, ['Organization ID not found']).send(res);
  }
  const data=await getAnalyticsFromBatchExam(orgId);
  if (!data || data.length === 0) {
    return new APIResponse(200, [], "No analytics data found for the organization").send(res);
  }

  console.log("Analytics data fetched successfully:", data);

  return new APIResponse(200, data, "Exam and batch analytics fetched successfully").send(res);

  }catch (err) {
  console.error("❌ Error fetching exam and batch analytics:", err);
  return new APIError(
    err?.status || 500,
    ["Something went wrong while fetching exam and batch analytics", err.message]
  ).send(res);
}

};

export const addCertificateToExam = async (req, res) => {
  try {

      const assignments = req.body;

      if(!Array.isArray(assignments) || assignments.length === 0) {
        return new APIError(500 , 'the data is not valid').send(res);
      }

      const results = [];
      const errors = [];

      for(const a of assignments) {
        const { id, certificate_template_mongo_id , type } = a;

        if (!id || !certificate_template_mongo_id || !type) {
          errors.push({ id, error: 'Missing required fields' });
          continue;
        }

        if (type === 'exam') {
          try {
            const data = await addCertificate(id, certificate_template_mongo_id);
  
            if (!data || data.length === 0) {
              errors.push({ id, error: 'No data returned from Supabase' });
            } else {
              results.push({ id, status: 'success' });
            }
          } catch (err) {
            errors.push({ id, error: err.message || 'Unexpected error' });
          }
        } else if (type === 'contest') {
            try{
              const data = await addCertificateToContest(id, certificate_template_mongo_id);
              if (!data || data.length === 0) {
                errors.push({ id, error: 'No data returned from Supabase' });
              } else {
                results.push({ id, status: 'success' });
              }
            } catch(err) {

              errors.push({ id, error: 'Contest type not supported yet' });
            }
        } else {
          errors.push({ id, error: 'Unknown type' });
        }

      }
      return new APIResponse(200, { results, errors }, 'Certificate assignment completed').send(res);
  } catch (e) {
    return new APIError(500, ['Something went wrong while adding the certificate', e.message]).send(res);
  }
};

export const publishExamResult = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await publishExamResultQuery(id);

    return new APIResponse(200, result, "Exam published successfully").send(res);
  } catch (err) {
    console.error("❌ Error publishing exam result:", err);
    return new APIError(
      err?.status || 500,
      ["Something went wrong while publishing exam result", err.message]
    ).send(res);
  }
};
