import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js";
import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js";
import { CreateOrganizationBatch, getOrganizationBacthes, updateOrganizationBatch, deleteOrganizationBatch } from "../../utils/SqlQueries/batch.queries.js";
import { createSyllabus } from "../../utils/SqlQueries/syllabus.queries.js";
import { updateUsersFunction } from "../FirstDB/user.controllers.js";
import { deleteStudentsFunction } from "../FirstDB/student.controllers.js";
import { deleteExamByBatchId } from "./exam.controllers.js";

////have to crete the function rpc call when i add the syllabus for the partoicular batch 
export const createOrgBatch = async (req, res) => {
  try {
    const { syllabus, faculties, ...data } = req.body;
    data.updated_at = new Date();
    data.updated_by = req.user._id;
    data.organization_id = req.user.role === 'organization' ? req.user._id : req.user.organization_id;
    data.created_by = req.user._id;

    let createdSyllabus;
    if (syllabus) {
      const syllabusData = {
        syllabus: syllabus,
        created_at: new Date(),
        updated_at: new Date(),
        updated_by: req.user._id
      };

      createdSyllabus = await createSyllabus(syllabusData);
      data.syllabus_id = createdSyllabus[0].id;
    }


    const batch = await CreateOrganizationBatch(data);


    if (faculties && faculties.length > 0) {
      const batchId = batch[0].id;
      // Pass batchId as an array to updateUsersFunction to push into batch array
      await updateUsersFunction(faculties, { batchAdd: [batchId] }, req.user);
    }

    return new APIResponse(200, batch, 'Batch created successfully').send(res);
  } catch (err) {
    if (err.code === '23505') {
      return new APIError(400, ["Batch with this name already exists"]).send(res);
    }
    else {
      console.log(err);
      new APIError(err?.response?.status || err?.status || 500,
        ["Something went wrong while creating the batch", err.message || ""]
      ).send(res);
    }
  }
};


export const getOrgBatches = async (req, res) => {
  try {
    //here id would be array of ids , so always pass the is
    const { id, organization_id, year } = req.mergedQuery || req.query;
    const batches = await getOrganizationBacthes({ id, organization_id, year });
    return new APIResponse(200, batches, 'Batch(s) fetched successfully').send(res);

  } catch (err) {
    console.log(err);
    new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while fetching the batch(s)", err.message || ""]).send(res);

  }
};

export const updateOrgBatch = async (req, res) => {
  try {
    const { id } = req.params;
    let {facultiesToAdd, facultiesToRemove ,...updates} = req.body;
    updates.updated_at = new Date();
    updates.updated_by = req.user.id;

    if (!id) return new APIError(400, 'Batch ID is required').send(res);

    const updated = await updateOrganizationBatch(id, updates);

    if (facultiesToAdd && facultiesToAdd.length > 0) {
      const batchId = updated.id;
      // Pass batchId as an array to updateUsersFunction to push into batch array
      await updateUsersFunction(facultiesToAdd, { batchAdd: [batchId] }, req.user);
    }

    if( facultiesToRemove && facultiesToRemove.length > 0) {
      const batchId = updated.id;
      // Pass batchId as an array to updateUsersFunction to pull from batch array
      await updateUsersFunction(facultiesToRemove, { batchRemove: [batchId] }, req.user);
    }

    return new APIResponse(200, updated, 'Batch updated successfully').send(res);
  } catch (err) {
    new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while updating the batch", err.message || ""]).send(res);

  }
};

export const deleteOrgBatch = async (req, res) => {
  const { id } = req.params;
  const { faculties = [], students = [] } = req.body;

  if (!id) {
    return new APIError(400, 'Batch ID is required').send(res);
  }

  let deletedBatch = null;
  let deletedFaculties = [];
  let deletedStudents = [];
  let deletedExams = [];

  try {
    // Delete batch first
    deletedBatch = await deleteOrganizationBatch(id);
    if (!deletedBatch) {
      return new APIError(404, 'Batch not found or already deleted').send(res);
    }

    // Remove batch from faculty users
    if (faculties.length > 0) {
      deletedFaculties = await updateUsersFunction(faculties, { batchRemove: [deletedBatch.id] }, req.user);
    }

    if (students.length > 0) {
      deletedStudents = await deleteStudentsFunction(students);
    }
    deletedExams = await deleteExamByBatchId(deletedBatch.id);

    return new APIResponse(200, {
      batch: deletedBatch,
      faculties: deletedFaculties,
      students: deletedStudents,
      exams: deletedExams
    }, 'Batch deleted successfully').send(res);

  } catch (err) {
    console.error("Error in batch deletion:", err);

    // Retry missing steps if possible (best-effort)
    try {
      if (deletedBatch) {
        if (faculties.length > 0 && deletedFaculties.length === 0) {
          deletedFaculties = await updateUsersFunction(faculties, { batchRemove: [deletedBatch.id] }, req.user);
        }

        if (students.length > 0 && deletedStudents.length === 0) {
          deletedStudents = await deleteStudentsFunction(students);
        }
      }
    } catch (retryErr) {
      console.warn("Retry step failed:", retryErr);
      // Optional: Log retry failure to an error log service
    }

    return new APIError(
      err?.response?.status || err?.status || 500,
      ["Something went wrong while deleting the batch", err.message || ""]
    ).send(res);
  }
};
