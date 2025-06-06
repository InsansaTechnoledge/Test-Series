import { useQuery } from "@tanstack/react-query";
import { fetchAllRoleGroups } from "../utils/services/RoleGroupService";
import { useUser } from "../contexts/currentUserContext";

export const useCachedRoleGroup = () => {
    const { user } = useUser();
    const fetchRoleGroupListFunction = async () => {
        try {
            const response = await fetchAllRoleGroups();
            if (response.status !== 200) {
                throw new Error("Network response was not ok");
            }
            return response.data;
        } catch (err) {
            if (err.response.status || err.status === 404)
                return [];
            else
                console.log(err);
            return [];
        }
    };

    const { data: roleGroups = [], isLoading: rolesLoading } = useQuery({
        queryKey: ['roleGroups', user._id],
        queryFn: fetchRoleGroupListFunction,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: Infinity,
        cacheTime: 24 * 60 * 60 * 1000,
        retry: 0,
    });

    const roleMap = Object.fromEntries(roleGroups?.map(r => [r._id, r]));

    const roleFeatureMapWithStatus = {};
    for (const role of roleGroups) {
        roleFeatureMapWithStatus[role._id] = new Map(
            (role.features || []).map(feature => [feature.id, feature.status])
        );
    }

    const hasActiveFeatureInRole = ({ roleId, featureId }) => {
        const featureStatus = roleFeatureMapWithStatus[roleId]?.get(featureId);
        return featureStatus === 'active';
    };
//example usage:            
// console.log("hasFeature", hasActiveFeatureInRole({featureId:'683061baeeb53072d9ad40ec',roleId:user.roleId}));
//have to pass the particular fetaureId and roleId (from the user.roleId)

    return {
        roleGroups,
        rolesLoading,
        roleMap,
        hasActiveFeatureInRole,
    }
};