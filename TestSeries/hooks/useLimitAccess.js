import { useUser } from "../contexts/currentUserContext";

const useLimitAccess = (featureKey,usageKey) => {
    const {user}=useUser();
    if(user.role === 'organization' && user.planPurchased && user.planFeatures){
        const limit= user.planFeatures[featureKey]?.value;
        const used=user.metaData?.[usageKey];

        console.log("useLimitAccess", featureKey, usageKey, limit, used);

        if(typeof limit!== 'number')
            return true;
        if(typeof used !== 'number')
            return true;

        return used < limit;
    }
};

export default useLimitAccess;