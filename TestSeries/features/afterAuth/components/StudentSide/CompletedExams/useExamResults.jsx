import { useQuery } from "@tanstack/react-query";
import { getStudentResults } from "../../../../../utils/services/resultPage";

const useStudentExamResults = (studentId) => {
    const fetchExamResults=async()=>{
        try{
            const response=await getStudentResults();
            if(response.status===200){
                return response.data;
            }
        }catch(err){
            console.error(err);
            return [];
        }
    }

    const {data, isLoading, isError} = useQuery({
        queryKey: ['studentExamResults', studentId],
        queryFn: fetchExamResults,
        enabled: !!studentId,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: Infinity,
        cacheTime: 1000 * 60 * 5,
        retry: 0,
    });

    return {
        results: data || [],
        isLoading,
        isError,
    };
}

export default useStudentExamResults;