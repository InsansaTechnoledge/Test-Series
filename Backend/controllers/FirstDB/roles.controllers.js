import { Role } from "../../models/FirstDB/roles.model.js";
import User  from "../../models/FirstDB/user.model.js";
import { APIError } from "../../utils/ResponseAndError/ApiError.utils.js";
import { APIResponse } from "../../utils/ResponseAndError/ApiResponse.utils.js";
import { mongoose,Types } from "mongoose";

// export const addRole = async (req, res) => {
//     try {
//         const orgId = req.user.id || req.user._id

//         const roleData = req.body;

//         const newRole = await Role.create(roleData);

//         return new APIResponse(200, newRole, "New role Created successfully!").send(res);
//     }
//     catch (err) {
//         console.log(err);
//         return new APIError(err?.response?.status || 500, ['Something went wrong while creating role', err.message]).send(res);
//     }

// }

export const addRole = async (req, res) => {
  try {
    const rawOrgId = req.user.id || req.user._id;

    const orgId = new Types.ObjectId(
      Buffer.isBuffer(rawOrgId) ? rawOrgId.toString("hex") : rawOrgId
    );

    const { name, description, featureIds } = req.body;

    if (!name || !Array.isArray(featureIds)) {
      return res.status(400).json({ message: "Name and featureIds are required" });
    }

    const roleData = {
      name,
      description,
      organizationId: orgId,
      features: featureIds.map(id => new Types.ObjectId(id)),
      createdBy: {
        id: orgId,
        model: req.user.role === "organization" ? "Organization" : "User",
      },
    };

    const newRole = await Role.create(roleData);

    return res.status(200).json({
      success: true,
      data: newRole,
      message: "New role created successfully!",
    });
  } catch (err) {
    console.error("Error while creating role:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating role",
      error: err.message,
    });
  }
};



export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteUsers=req.query.deleteUsers;
    let users;

    if (!deleteUsers) {
      users = await User.updateMany(
        { roleId: id },
        { $set: { roleId: null } }
      )

    }
    else {
      users = await User.deleteMany({
        roleId: id
      });
    }
    const role = await Role.findByIdAndDelete(id);
    return new APIResponse(200, role, 'Role Deleted successfully').send(res);
  }
  catch (err) {
    console.log(err);
    return new APIError(err?.response?.status || 500, ['Something went wrong while deleting role', err.message]).send(res);
  }
}

// export const updateRole = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const roleData = req.body;
//         const role = await Role.findByIdAndUpdate(id, roleData, {new: true});

//         return new APIResponse(200, role, 'Role updated successfully').send(res);
//     }
//     catch (err) {
//         console.log(err);
//         return new APIError(err?.response?.status || 500, ['Something went wrong while deleting role', err.message]).send(res);
//     }
// }

export const updateRole = async (req, res) => {
  try {
    const { id, name, description, featureIds } = req.body;

    if (!id) {
      return new APIError(400, ['Missing role group ID']).send(res);
    }

    const updateData = {
      name,
      description,
      features: Array.isArray(featureIds)
        ? featureIds.map(f => new Types.ObjectId(f))
        : [],
    };

    // Update and fetch updated version
    const updatedRole = await Role.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate('features');

    if (!updatedRole) {
      return new APIError(404, ['Role group not found']).send(res);
    }

    return new APIResponse(200, updatedRole, 'Role updated successfully').send(res);
  } catch (err) {
    console.error(err);
    return new APIError(
      err?.response?.status || 500,
      ['Something went wrong while updating role', err.message]
    ).send(res);
  }
};




export const fetchRolesForOrganization = async (req, res) => {
  try {

    const id = req.user.role === 'organization' ? req.user._id : (req.user.organizationId._id || req.user.organizationId);
    const OrgRoles = await Role.find({ organizationId: id }).populate('features')
    if (!OrgRoles || OrgRoles.length === 0) {
      return new APIError(404, ["Roles for organization not found"]).send(res);
    }
    return new APIResponse(200, OrgRoles, "Roles for organization fetched").send(res);
  }
  catch (err) {
    console.log(err);
    return new APIError(err?.response?.status || 500, ['Something went wrong while fetching roles for organization', err.message]).send(res);
  }
}

// export const fetchRolesForOrganization = async (req, res) => {
//     try {
//       const rawOrgId = req.user.id || req.user._id;

//       const orgId = new mongoose.Types.ObjectId(
//         Buffer.isBuffer(rawOrgId) ? rawOrgId.toString("hex") : rawOrgId
//       );

//       const OrgRoles = await Role.find({ organizationId: orgId })
//         .populate("features")
//         .lean();

//       if (!OrgRoles || OrgRoles.length === 0) {
//         return new APIError(404, ["Roles for organization not found"]).send(res);
//       }

//       return new APIResponse(200, OrgRoles, "Roles for organization fetched").send(res);
//     } catch (err) {
//       console.error(err);
//       return new APIError(
//         err?.response?.status || 500,
//         ["Something went wrong while fetching roles for organization", err.message]
//       ).send(res);
//     }
//   };

export const fetchRoleDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findById(id).populate('features').lean();
    if (!role) {
      return new APIError(404, ["Role not found"]).send(res);
    }

    return new APIResponse(200, role, "Role fetched successfully").send(res);
  }
  catch (err) {
    console.log(err);
    return new APIError(err?.response?.status || 500, ['Something went wrong while fetching role details', err.message]).send(res);
  }
}


// function to delete roles when org is deleted
export const deleteRolesForOrganization = async (orgId) => {
  try {
    const OrgRoles = await Role.deleteMany({ organizationId: orgId });
    return OrgRoles;
  }
  catch (err) {
    console.log(err);
    return new APIError(err?.response?.status || 500, ['Something went wrong while deleting roles for organization', err.message]).send(res);
  }
}
