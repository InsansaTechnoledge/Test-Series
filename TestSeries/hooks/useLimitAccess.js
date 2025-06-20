import { useUser } from "../contexts/currentUserContext";
import { useCachedOrganization } from "./useCachedOrganization";

const useLimitAccess = (featureKey,usageKey) => {
    const {user}=useUser();
    if(user.role === 'organization' && user.planPurchased && user.planFeatures){
        const limit= user.planFeatures[featureKey]?.value;
        const used=user.metaData?.[usageKey];

        if(typeof limit!== 'number')
            return true;
        if(typeof used !== 'number')
            return true;

        return used < limit;
    }else if(user.role === 'user' && user.planFeatures){
        const limit = user.planFeatures[featureKey]?.value;
        const {organization}=useCachedOrganization({userId: user._id, orgId: user.organizationId._id});


        const used = organization?.metaData?.[usageKey];

        if (typeof limit !== 'number')
            return true;
        if (typeof used !== 'number')
            return true;

        return used < limit;
    }
};

export default useLimitAccess;