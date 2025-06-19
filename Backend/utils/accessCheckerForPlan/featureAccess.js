import { Organization } from "../../models/FirstDB/organization.model.js";
import PlanFeature from "../../models/SecondDB/plan-feature.model.js";
import Plan from "../../models/SecondDB/plan.model.js";

export const getFeatureValueForOrganization = async(orgId, featureKey) => {
    const org= await Organization.findById(orgId).populate({
        path: 'planPurchased',
        model: Plan,
         populate: {
        path: 'features.featureId',
        select: 'key isActive',
        model: PlanFeature
        }
       
    });

    console.log(org.planPurchased.features.map(f => f.key));

    if (!org || !org.planPurchased) {
        return null;
    };
    console.log(featureKey,"🥲");

const matchedFeature = org.planPurchased?.features?.find(
  f => f.key === featureKey && f.featureId?.isActive
);

console.log(matchedFeature);
    if (!matchedFeature || !matchedFeature.value ){
        return null;
    }

    return matchedFeature.value;

};