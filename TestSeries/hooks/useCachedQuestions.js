import { useQuery } from "@tanstack/react-query";
import { fetchQuestionsbyExam } from "../utils/services/examService";
import { useUser } from "../contexts/currentUserContext";

export const useCachedQuestions = (examId) => {
    const { user } = useUser();

    const fetchExamQuestions = async () => {
        try {
            const response = await fetchQuestionsbyExam(examId);
            if (response.status !== 200) {
                throw new Error("Network response was not ok");
            }
            return response.data;
        } catch (err) {
            console.error(err);
            throw err; // Let react-query handle error
        }
    };

    const enabled = !!user && !!examId;

    const { data: questions = [], isLoading, isError } = useQuery({
        queryKey: ['questions', examId, user?.organizationId],
        queryFn: fetchExamQuestions,
        enabled,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: Infinity,
        cacheTime: 24 * 60 * 60 * 1000,
        retry: 0,
    });

    return { questions, isLoading, isError };
};
