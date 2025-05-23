import { useQuery } from "@tanstack/react-query";
import { getOrganizationById } from "../utils/services/organizationService";

export const useCachedOrganization = (ids) => {
    const { userId, orgId } = ids;
    const fetchOrganization = async (id) => {
  
        console.log("Fetching organization with ID:", id);
        try {
            const response = await getOrganizationById(id);
            if (response.status !== 200) {
                throw new Error("Network response was not ok");
            }
            return response.data;
        } catch (err) {
            console.log(err);
            throw err; // Rethrow the error to be handled by react-query
        }
    };
const enabled = !!userId && !!orgId;

    const { data: organization, isLoading, isError } = useQuery({
        queryKey: ["organization",userId],
        queryFn: ()=>fetchOrganization(orgId),
        enabled,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: Infinity,
        cacheTime: 24 * 60 * 60 * 1000,
        retry: 0,
    });

    return {
        organization,
        isLoading,
        isError,
    };
};