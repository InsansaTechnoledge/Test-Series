import { featureKeyToCategory } from "../utils/dataMapping.util.js";
import { APIError } from "../utils/ResponseAndError/ApiError.utils.js";

export const checkRoleAccess= (featureKey) => {
    return async (req, res, next) => {
     const user = req.user;
     if(user.role ==='organization') {
         console.log("User is an organization, skipping role access check.");
            return next();
        }

     if(req.method === 'GET')
           {
            console.log("GET request detected, skipping role access check.");
            return next();
           }

     const roleKey=featureKeyToCategory[featureKey];

     if(!user.roleFeatures || typeof user.roleFeatures !== 'object' || !user.roleFeatures[roleKey]) {
         console.log(`You do not have access to the feature: ${featureKey} in your plan.`);
        return new APIError(403, `You do not have access to the feature: ${featureKey} in your plan.`).send(res);
     }

  const hasAnyActiveFeature = Object.values(user.roleFeatures).some(category =>
    Object.values(category).some(status => status === 'active')
  );

     console.log("Checking role access for feature:", featureKey, "Active features:", user.roleFeatures[roleKey]);

     if(!hasAnyActiveFeature){
            console.log(`You do not have access to the feature: ${featureKey} in your plan.`);
           return new APIError(403, `You do not have access to the feature: ${featureKey} in your plan.`).send(res);
     }


     req.roleKey = roleKey; 

     next();
    }
}