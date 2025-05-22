import { useQuery } from "@tanstack/react-query";
import { fetchExamById } from "../utils/services/examService";
import { useUser } from "../contexts/currentUserContext";

export const useCachedExam = (examId) => {
    const { user } = useUser();

    const fetchExam = async () => {
        try {
            const response = await fetchExamById(examId);
            if (response.status !== 200) {
                throw new Error("Network response was not ok");
            }
            return response.data;
        } catch (err) {
            console.error(err);
            throw err; // Propagate error to useQuery
        }
    };

    const enabled = !!user && !!examId;

    const { data: exam = [], isLoading, isError } = useQuery({
        queryKey: ['exam', examId, user?.organizationId],
        queryFn: fetchExam,
        enabled, // prevents running if user is not ready or examId is undefined
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: Infinity,
        cacheTime: 24 * 60 * 60 * 1000,
        retry: 0,
    });

    return { exam: exam[0], isLoading, isError };
};
