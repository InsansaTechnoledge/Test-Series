import { useQuery } from '@tanstack/react-query';
import { fetchBatchList } from '../utils/services/batchService';
import { useUser } from '../contexts/currentUserContext';

export const useCachedBatches = () => {
  const { user } = useUser();

  const fetchBatchListFunction = async () => {
    const orgId = user._id || user.organizationId;
    const { data } = await fetchBatchList(orgId); 
    console.log("✅ Batches fetched:", data);
    return data; 
  };

  const { data: batches = [], isLoading, isError } = useQuery({
    queryKey: ['batches', user._id || user.organizationId],
    queryFn: fetchBatchListFunction,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
    cacheTime: 24 * 60 * 60 * 1000,
    retry: 0,
  });

  const batchMap = Object.fromEntries((batches || []).map((b) => [b.id, b]));

  return {
    batches,
    isLoading,
    isError,
    batchMap,
  };
};
