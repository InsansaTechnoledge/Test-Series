import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js";
import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js";
import { CreateOrganizationBatch , getOrganizationBacthes ,updateOrganizationBatch , deleteOrganizationBatch} from "../../utils/SqlQueries/batch.queries.js";

///have to crete the function rpc call when i add the syllabus for the partoicular batch 

export const createOrgBatch = async (req, res) => {
    try {
      //body should be array of objects
      let data = req.body;
      data.upadted_at = new Date();
      data.updated_by = req.user.id;
      // if (!data.organization_id || !data.name || !data.year) {
      //   return new APIError(400, 'Required fields missing').send(res);
      // }
  
      const batch = await CreateOrganizationBatch(data);
      return new APIResponse(201, batch, 'Batch created successfully').send(res);
    } catch (err) {
      console.log(err);
      new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while creating the batch", err.message || ""]).send(res);

    }
  };
  
  export const getOrgBatches = async (req, res) => {
    try {
      //here id would be array of ids , so always pass the is
      const { id, organization_id, year } = req.mergedQuery||req.query;
      console.log(id, organization_id, year);
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
      const updates = req.body;
  
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
    } catch (e) {
      new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while deleting the batch", err.message || ""]).send(res);

    }
  };