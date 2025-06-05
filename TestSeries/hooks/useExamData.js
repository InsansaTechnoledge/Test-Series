import { useQuery } from '@tanstack/react-query';
import { fetchExamsWithoutQuestions } from '../utils/services/examService';
import { useUser } from '../contexts/currentUserContext';

export const usePendingExams = () => {
  const { user } = useUser();
  const orgId = user?.organizationId || user?._id;

  const fetchPendingExams = async () => {
    try{
      const response = await fetchExamsWithoutQuestions(orgId);
      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }
      return response.data;
    }catch (err) {
      console.error("Error fetching pending exams:", err);
      return [];
    }
  };

  const { data: pendingExams = [], isLoading, isError } = useQuery({
    queryKey: ['pendingExams', orgId],
    queryFn: fetchPendingExams,
    enabled: !!orgId,
    staleTime: 1000 * 60 * 5,
  });

 const  pendingExamsIds = Object.fromEntries(pendingExams.map((exam) => [exam.id,exam]));


  return {
    pendingExams,
    isLoading,
    isError,
    pendingExamsIds
  };
};

export default usePendingExams;
