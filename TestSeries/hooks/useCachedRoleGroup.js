import { useQuery } from "@tanstack/react-query";
import { fetchAllRoleGroups } from "../utils/services/RoleGroupService";
import { useUser } from "../contexts/currentUserContext";

export const useCachedRoleGroup = () => {
    const {user} = useUser();
    const fetchRoleGroupListFunction = async () => {
        try {
            const response = await fetchAllRoleGroups();
            if (response.status !== 200) {
                throw new Error("Network response was not ok");
            }
            return response.data;
        } catch (err) {
            console.log(err);
        }
    };

      const { data: roleGroups = [], isLoading: rolesLoading } = useQuery({
        queryKey: ['roleGroups', user._id],
        queryFn:fetchRoleGroupListFunction,
       refetchOnWindowFocus: false,
           refetchOnMount: false,
           staleTime: Infinity,
           cacheTime: 24 * 60 * 60 * 1000,
           retry: 0,
      });

       const roleMap = Object.fromEntries(roleGroups?.map(r => [r._id, r]));

      return {
        roleGroups,
        rolesLoading,
        roleMap
      }
};