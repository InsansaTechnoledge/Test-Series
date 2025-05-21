import { useQuery } from '@tanstack/react-query';
import { fetchBatchList } from '../utils/services/batchService';
import { useUser } from '../contexts/currentUserContext';

export const useCachedBatches = () => {
    const {user} = useUser();
    const fetchBatchListFunction = async () => {
    try{
        const response = await fetchBatchList();
        if (response.status !== 200) {
            throw new Error('Network response was not ok');
        }
        return response.data;
    }catch(err){
        console.log(err);
        // setbatchError(
        //     err.response?.data?.message || err.message || "Something went wrong"
        // )
    }
    }

    const { data: batches = [], isLoading, isError } = useQuery({
        queryKey: ['batches', user._id],
        queryFn: () => fetchBatchListFunction(),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: Infinity,
        cacheTime: 24 * 60 * 60 * 1000,
        retry: 0,
    });

    return {
        batches,
        isLoading,
        isError
    }
};
