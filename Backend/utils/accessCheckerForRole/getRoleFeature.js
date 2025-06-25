import { Role } from "../../models/FirstDB/roles.model.js";

export const getRoleFeatureMap = async (roleId) => {
    if (!roleId) {
        return {};
    }
    const role = await Role.findById(roleId).populate('features').lean();

    if (!role) {
        throw new Error('Role not found');
    }

    const roleFeatures = {};

    for (const feature of role.features) {
        const category = feature.category || 'uncategorized';
        const featureName = feature.name;
        const status = feature.status;

        if (!roleFeatures[category]) {
            roleFeatures[category] = {};
        }

        roleFeatures[category][featureName] = status;
    }

    return  roleFeatures ;
};