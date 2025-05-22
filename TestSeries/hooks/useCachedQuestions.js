import { useQuery } from "@tanstack/react-query";
import { fetchQuestionsbyExam } from "../utils/services/examService";

export const useCachedQuestions = (examId) => {

    const fetchExamQuestions = async () => {
        try {
            const response = await fetchQuestionsbyExam(examId);
            if (response.status !== 200) {
                throw new Error("Network response was not ok");
            }
            return response.data;
        }
        catch (err) {
            console.log(err);
        }

    }
        const { data: questions = [], isLoading, isError } = useQuery({
        queryKey: ['questions',examId],
        queryFn: fetchExamQuestions,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: Infinity,
        cacheTime: 24 * 60 * 60 * 1000,
        retry: 0,
    });

    return {
        questions,
        isLoading,
        isError
    }
}