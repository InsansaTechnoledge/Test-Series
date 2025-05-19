import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js";
import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js";
import { Organization } from "../../models/FirstDB/organization.model.js";


export const CreateOrganization = async (req, res) => {
    try {
      const data = req.body;
  
    //   // Get client's IP
    //   const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
  
    //   // Fetch coordinates
    //   const location = await getGeoLocationFromIp(ip);
      
  
    //   if (location) {
    //     data.address = {
    //       ...data.address,
    //       location
    //     };
    //   }

    if (req.file && req.file.path) {
        data.logoUrl = req.file.path;
      }
      const existing = await Organization.findOne({
        $or: [{ email: data.email }, { phone: data.phone }]
      });
  
      if (existing) {
        return new APIError(409, ['Institute already exists']).send(res);
      }
  
      const newOrganization = await Organization.create(data);
      return new APIResponse(201, newOrganization, 'Organization created successfully').send(res);
    } catch (err) {
      console.error('Error creating Organization:', err.message);
      new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while creating organization", err.message || ""]).send(res);

    }
};

export const getAllOrganization = async (req , res) => {

    try{
        const allOrganization = await Organization.find().sort({createdAt: -1});
        return new APIResponse(200 , allOrganization , 'all fetched').send(res);

    } catch(e) {
        new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while fetching all organization", err.message || ""]).send(res);
        
    }
}

export const getOrganizationById = async (req, res) => {

    try{

        const {id} = req.params
        
        const org = await Organization.findById(id)
        if (!org) {
            return new APIError(404, ['org not found']).send(res);
        }

        return new APIResponse(200, org, 'org fetched').send(res);

    } catch(e) {
       new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while fetching organization Data", err.message || ""]).send(res);
       

    }
}

export const updateOrganization = async (req, res) => {

    try {
      const { id } = req.params;
      const updateData = req.body;
  
      const newOrganization = await Organization.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
  
      if (!newOrganization) {
        return new APIError(404, ['Institute not found']).send(res);
      }
  
      return new APIResponse(200, newOrganization, 'Organization updated successfully').send(res);
    } catch (err) {
      console.error('Error updating Organization:', err);
      new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while updating the organization", err.message || ""]).send(res);

    }
};

export const deleteOrganization = async (req, res) => {

    try {
      const { id } = req.params;
  
      const organization = await Organization.findByIdAndDelete(id);
  
      if (!organization) {
        return new APIError(404, ['Organization not found']).send(res);
      }
  
      return new APIResponse(200, organization, 'Organization deleted successfully').send(res);
    } catch (err) {
      console.error('Error deleting Organization:', err);
     new APIError(err?.response?.status || err?.status || 500, ["Something went wrong while deleting the organization", err.message || ""]).send(res);

    }
};
