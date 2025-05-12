import { Role } from "../../models/FirstDB/roles.model.js";
import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js";
import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js";

export const addRole = async (req, res) => {
    try {
        const roleData = req.body;

        const newRole = await Role.create(roleData);

        return new APIResponse(200, newRole, "New role Created successfully!").send(res);
    }
    catch (err) {
        console.log(err);
        return new APIError(err?.response?.status || 500, ['Something went wrong while creating role', err.message]).send(res);
    }

}

export const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;

        const role = await Role.findByIdAndDelete(id);

        return new APIResponse(200, role, 'Role Deleted successfully');
    }
    catch (err) {
        console.log(err);
        return new APIError(err?.response?.status || 500, ['Something went wrong while deleting role', err.message]).send(res);
    }
}

export const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const roleData = req.body;

        const role = await Role.findByIdAndUpdate(id, roleData);

        return new APIResponse(200, role, 'Role updated successfully');
    }
    catch (err) {
        console.log(err);
        return new APIError(err?.response?.status || 500, ['Something went wrong while deleting role', err.message]).send(res);
    }
}

export const fetchRolesForOrganization = async (req,res) => {
    try{

        const {id} = req.params;
        const OrgRoles = await Role.find({organizationId: id}).populate('features').lean();
        return new APIResponse(200, OrgRoles, "Roles for organization fetched");
    }
    catch(err){
        console.log(err);
        return new APIError(err?.response?.status || 500, ['Something went wrong while fetching roles for organization', err.message]).send(res);
    }
}

export const fetchRoleDetails = async (req,res) => {
    try{
        const {id} = req.params;
        const role = await Role.findById(id).populate('features').lean();
        return new APIResponse(200, role, "Role fetched successfully");
    }
    catch(err){
        console.log(err);
        return new APIError(err?.response?.status || 500, ['Something went wrong while fetching role details', err.message]).send(res);
    }
}


// function to delete roles when org is deleted
export const deleteRolesForOrganization = async (orgId) => {
    try{
        const OrgRoles = await Role.deleteMany({organizationId: orgId});
        return OrgRoles;
    }
    catch(err){
        console.log(err);
        return new APIError(err?.response?.status || 500, ['Something went wrong while deleting roles for organization', err.message]).send(res);
    }
}
