import { useQuery } from "@tanstack/react-query";
import { useUser } from "../../../../../contexts/currentUserContext";
import { fetchUpcomingExams } from "../../../../../utils/services/examService";

const useExams = () => {
    const { user } = useUser();

    const fetch = async () => {
        try {
            const response = await fetchUpcomingExams();

            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            console.error('Error fetching exams:', error);
            return [];// Rethrow to handle in the query
        }
    };

    const { data: exams, isLoading, error } = useQuery({
        queryKey: ['exams', user?._id],
        queryFn: fetch,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: Infinity,
        staleTime: 1000 * 60 * 5,
    });

    return {
        exams,
        isLoading,
        error,
    };
}

export default useExams;
