import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js";
import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js";
import { CreateOrganizationBatch , getOrganizationBacthes ,updateOrganizationBatch , deleteOrganizationBatch} from "../../SqlQueries/batch.queries.js";

export const createOrgBatch = async (req, res) => {
    try {
      const data = req.body;
  
      if (!data.organization_id || !data.name || !data.year) {
        return new APIError(400, 'Required fields missing').send(res);
      }
  
      const batch = await CreateOrganizationBatch(data);
      return new APIResponse(201, batch, 'Batch created successfully').send(res);
    } catch (e) {
      return new APIError(500, ['Failed to create batch', e.message]).send(res);
    }
  };
  
  export const getOrgBatches = async (req, res) => {
    try {
      const { id, organization_id, year } = req.query;
  
      const batches = await getOrganizationBacthes({ id, organization_id, year });
      return new APIResponse(200, batches, 'Batch(s) fetched successfully').send(res);
    } catch (e) {
      return new APIError(500, ['Failed to fetch batch(s)', e.message]).send(res);
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
      return new APIError(500, ['Failed to update batch', e.message]).send(res);
    }
  };
  
  export const deleteOrgBatch = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) return new APIError(400, 'Batch ID is required').send(res);
  
      const deleted = await deleteOrganizationBatch(id);
      return new APIResponse(200, deleted, 'Batch deleted successfully').send(res);
    } catch (e) {
      return new APIError(500, ['Failed to delete batch', e.message]).send(res);
    }
  };