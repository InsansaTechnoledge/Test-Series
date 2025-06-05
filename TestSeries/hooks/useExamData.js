import { useQuery } from '@tanstack/react-query';
import { fetchExamsWithoutQuestions } from '../utils/services/examService';
import { useUser } from '../contexts/currentUserContext';

export const usePendingExams = () => {
  const { user } = useUser();
  const orgId = user?.organizationId || user?._id;

  const { data: pendingExams = [], isLoading, isError } = useQuery({
    queryKey: ['pendingExams', orgId],
    queryFn: () => fetchExamsWithoutQuestions(orgId),
    enabled: !!orgId,
    staleTime: 1000 * 60 * 5,
  });

  return {
    pendingExams,
    isLoading,
    isError,
  };
};
