import { getFeatureValueForOrganization } from "../utils/accessCheckerForPlan/featureAccess.js";
import { APIError } from "../utils/ResponseAndError/ApiError.utils.js";

export const checkFeatureAccess = (featureKey, options = {}) => {
    return async (req, res, next) => {
        const orgId = req.user.role === 'organization' ? req.user._id : req.user.organizationId;

        const value = await getFeatureValueForOrganization(orgId, featureKey);
        console.log(value, "Feature Value");
        if (value === null || value === false) {
            console.log(`You do not have access to the feature: ${featureKey} in your plan.`);
            return new APIError(403, `You do not have access to the feature: ${featureKey} in your plan.`).send(res);

        }

        if (typeof value === 'number') {
            req.featureLimit = value;
        }

        next();
    }

};