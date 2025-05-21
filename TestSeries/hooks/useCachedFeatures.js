import { useQuery } from "@tanstack/react-query";
import { fetchFeatures } from "../utils/services/FeaturesService";
import { useUser } from "../contexts/currentUserContext";


export const useCachedFeatures = () => {
    const {user} = useUser();
    const fetchAllFeatures = async () => {
        try {
            const response = await fetchFeatures();
            if (response.status !== 200) {
                throw new Error("Network response was not ok");
            }
            return response.data;
        } catch (err) {
            console.log(err);
        }
    };

    const {data : featuresData = [] , isLoading} = useQuery({
        queryKey: ['features', user._id],
        queryFn: fetchAllFeatures,
        staleTime: Infinity,
    });

    return {
        featuresData,
        isLoading
    }
};
    
