import { useQuery } from "@tanstack/react-query";

export const useCachedExam = ({examId}) => {

    const fetchExam = async () => {
        try {
            const response = await fetchExamQuestions(examId);
            if (response.status !== 200) {
                throw new Error("Network response was not ok");
            }
            return response.data;
        }
        catch (err) {
            console.log(err);
        }

    }
        const { data: exam = [], isLoading, isError } = useQuery({
        queryKey: ['exam',examId],
        queryFn: fetchExam,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: Infinity,
        cacheTime: 24 * 60 * 60 * 1000,
        retry: 0,
    });

    return {
        exam,
        isLoading,
        isError
    }
}