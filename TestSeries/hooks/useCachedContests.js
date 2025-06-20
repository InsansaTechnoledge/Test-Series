import { useQuery } from "@tanstack/react-query";
import { useUser } from "../contexts/currentUserContext";
import { FetchContest } from "../utils/services/contestService";

const useCachedContests = () => {
    const { user } = useUser();
    let batchId = null
    if (user.role === 'student' || user.role === 'user') {
        batchId = user.batch.currentBatch || user.batch;
    }
    const fetchContestList = async () => {
        try {
            const response = await FetchContest(batchId);
            if (response.status === 200) {
                return response.data;
            }
            else return [];


        } catch (error) {
            console.error('Error fetching contest list:', error);
            throw error;
        }
    };

    const { data=[], isLoading, error } = useQuery({
        queryKey: ['contests', user._id],
        queryFn: fetchContestList,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: Infinity,
        cacheTime: 24 * 60 * 60 * 1000,
        retry: 0,
    });

    const contestMap = Object.fromEntries(data?.map(contest => [contest.id, contest]));

    return {
        contestMap,
        contestList:data || [],
        isLoading,
        error
    };
}

export default useCachedContests;