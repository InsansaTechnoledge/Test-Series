import { featureKeyToMetaDataKey } from "../utils/dataMapping.util.js";
import { APIError } from "../utils/ResponseAndError/ApiError.utils.js";

export const checkLimitAccess= (req, res, next) => {
    console.log("Checking feature access limit...");
    console.log(req.featureLimit);
    const metaData=req.user?.metaData;
    const featureInfo= req.featureLimit;

    if (!metaData ||  !metaData[featureKeyToMetaDataKey[featureInfo.key]]) {
        console.log(`You do not have access to the feature: ${featureInfo.key} in your plan.`);
        return new APIError(403, [`You do not have access to the feature: ${featureInfo.key} in your plan.`]).send(res);
    }


    const used = metaData[featureKeyToMetaDataKey[featureInfo.key]] || 0;
    const limit = featureInfo.value;
    const canUse = used < limit;

    if(canUse) {

    next();
    }
    else {
        console.log(`You have reached the limit for the feature: ${featureInfo.key}.`);
        return new APIError(403, [`You have reached the limit for the feature: ${featureInfo.key}.`]).send(res);
    }
}