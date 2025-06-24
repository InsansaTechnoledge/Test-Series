import { useQuery } from "@tanstack/react-query";
import { useUser } from "../contexts/currentUserContext";
import { fetchAnalyticsOnExams } from "../utils/services/examService";

const useExamBatchAnalytics = () => {

    const {user}=useUser();

    const fetchAnalytics = async () => {
        try{
            const response =await fetchAnalyticsOnExams();
            if(response.status !== 200) {
                throw new Error("Network response was not ok");
            };
            return response.data;

        }catch (err) {
            console.error("Error fetching exam batch analytics:", err);
            return [];
        }
    };

    const { data: examBatchAnalytics = [], isLoading, isError } = useQuery({
        queryKey: ['examBatchAnalytics',user._id],
        queryFn:fetchAnalytics,
        enabled:!!user, // prevents running if user is not ready or examId is undefined
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: Infinity,
        cacheTime: 24 * 60 * 60 * 1000,
        retry: 0,

    });

    return {
        examBatchAnalytics,
        isLoading,
        isError
    };
};

export default useExamBatchAnalytics;