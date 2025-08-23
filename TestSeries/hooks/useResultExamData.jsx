import { useQuery } from "@tanstack/react-query";
import { useUser } from "../contexts/currentUserContext";
import { getResultDetail } from "../utils/services/resultPage";

export const useCachedResultExamData = (examId, forAllStudents,resultId) => {
    const { user } = useUser();

    const fetchExamData = async () => {
        try {
            const response = await getResultDetail(examId,forAllStudents,resultId);
            if (response.status !== 200) {
                throw new Error("Network response was not ok");
            }
            return response.data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const enabled = !!user && !!examId;

    const { data: data = [], isLoading, isError } = useQuery({
        queryKey: ['resultExamData', examId],
        queryFn: fetchExamData,
        enabled,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: Infinity,
        cacheTime: 24 * 60 * 60 * 1000,
        retry: 0,
    });

    if (data.length === 0) {
        return { data, isLoading, isError: true };
    }

    return { data, isLoading, isError };
};
