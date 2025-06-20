import Plan from "../../models/SecondDB/plan.model.js";

export const getPlanFeaturesMap = async (planId) => {
    if(!planId) {
        return {};
    }

    const plan=await Plan.findById(planId).populate('features.featureId');
    const featuresMap = {};

    if(plan?.features?.length){
        for(const feature of plan.features) {
            if(feature.featureId && feature.featureId.key) {
                featuresMap[feature.featureId.key] = {
                    isActive: feature.featureId.isActive,
                    value: feature.value
                };
            }
        }
    }



    return featuresMap;
};