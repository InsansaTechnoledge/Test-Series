import { useQuery } from "@tanstack/react-query";
import { fetchStudents } from "../utils/services/studentService";
import { useUser } from "../contexts/currentUserContext";

export const useCachedStudents = () => {
    const {user}= useUser();
    const fetchStudentsFunction = async () => {
        try{
            const response = await fetchStudents();
            if (response.status !== 200) {
                throw new Error("Network response was not ok");
            }
            console.log(response.data);
            return response.data;
        }catch (error) {
            if(error.response && error.response.status === 404) {
                console.log("No students found");
                return [];
            }else console.log("Error fetching students:", error);
            
        }
    }

    const { data: students = [], isLoading, isError }
        = useQuery({
        queryKey: ["Students", user._id],
        queryFn:fetchStudentsFunction,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: Infinity,
        cacheTime: 24 * 60 * 60 * 1000,
        retry: 0,
    });

    const studentMap = Object.fromEntries(students?.map(s => [s._id, s]));

    return {
        students,
        isLoading,
        isError,
        studentMap
    }
};