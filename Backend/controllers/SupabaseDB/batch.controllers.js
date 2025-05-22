import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js";
import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js";
import { CreateOrganizationBatch , getOrganizationBacthes ,updateOrganizationBatch , deleteOrganizationBatch} from "../../utils/SqlQueries/batch.queries.js";
import { createSyllabus } from "../../utils/SqlQueries/syllabus.queries.js";
import { updateUsersFunction } from "../FirstDB/user.controllers.js";

////have to crete the function rpc call when i add the syllabus for the partoicular batch 
export const createOrgBatch = async (req, res) => {
  try {
    const { syllabus, faculties, ...data } = req.body;
    data.updated_at = new Date();
    data.updated_by = req.user._id;
    data.organization_id = req.user.role === 'organization' ? req.user._id : req.user.organization_id;
    data.created_by = req.user._id;

    let createdSyllabus ;
    if (syllabus) {
      const syllabusData = {
        syllabus:syllabus,
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
      await updateUsersFunction(faculties, { batch: [batchId] }, req.user);
    }

    return new APIResponse(200, batch, 'Batch created successfully').send(res);
  } catch (err) {
    console.log(err);
    new APIError(err?.response?.status || err?.status || 500,
      ["Something went wrong while creating the batch", err.message || ""]
    ).send(res);
  }
};

  
  export const getOrgBatches = async (req, res) => {
    try {
      //here id would be array of ids , so always pass the is
      const { id, organization_id, year } = req.mergedQuery||req.query;
      const batches= await getOrganizationBacthes({ id, organization_id, year });
      return new APIResponse(200, batches, 'Batch(s) fetched successfully').send(res);
      
    } catch (err) {
      console.log(err);
      new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while fetching the batch(s)", err.message || ""]).send(res);

    }
  };
  
  export const updateOrgBatch = async (req, res) => {
    try {
      const { id } = req.params;
      let updates = req.body;
      updates.updated_at = new Date();
      updates.updated_by = req.user.id;
  
      if (!id) return new APIError(400, 'Batch ID is required').send(res);
  
      const updated = await updateOrganizationBatch(id, updates);
      return new APIResponse(200, updated, 'Batch updated successfully').send(res);
    } catch (e) {
      new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while updating the batch", err.message || ""]).send(res);
      
    }
  };
  
  export const deleteOrgBatch = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) return new APIError(400, 'Batch ID is required').send(res);
  
      const deleted = await deleteOrganizationBatch(id);
      return new APIResponse(200, deleted, 'Batch deleted successfully').send(res);
    } catch (err) {
      console.log(err);
      new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while deleting the batch", err.message || ""]).send(res);

    }
  };