import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { fetchUpcomingExams, goLiveExam, deleteExam } from '../utils/services/examService';
import { useUser } from '../contexts/currentUserContext';

// Hook to fetch exams
export const useExams = () => {
  const { user } = useUser();
  
  return useQuery({
    queryKey: ['exams', user?._id],
    queryFn: fetchUpcomingExams, 
    enabled: !!user?._id, // Only run query if user ID exists
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    onError: (error) => {
      console.error('❌ Failed to fetch exams:', error);
    }
  });
};

// Hook to handle going live/pausing exams
export const useGoLiveExam = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: async ({ examId, goLive }) => {
      console.log('🔄 Calling goLiveExam with:', { examId, goLive });
      const response = await goLiveExam(examId, goLive);
      console.log('✅ goLiveExam response:', response);
      return response.data;
    },
    onSuccess: (data, variables) => {
      console.log('✅ Go live mutation successful:', { data, variables });
      // Invalidate and refetch exams after successful update
      queryClient.invalidateQueries(['exams', user?._id]);
    },
    onError: (error, variables) => {
      console.error('❌ Failed to update exam status:', { error, variables });
    }
  });
};

// Hook to handle exam deletion
export const useDeleteExam = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation({
    mutationFn: async (examId) => {
      return await deleteExam(examId);
    },
    onSuccess: (data, examId) => {
      // Invalidate and refetch exams after successful deletion
      queryClient.invalidateQueries(['exams', user?._id]);
      
      // Optionally, you can also update the cache directly for instant UI update
      queryClient.setQueryData(['exams', user?._id], (oldData) => {
        if (!oldData) return oldData;
        return oldData.filter(exam => exam.id !== examId);
      });
    },
    onError: (error) => {
      console.error('❌ Failed to delete exam:', error);
    }
  });
};

// Utility hook for grouping exams by batch
export const useGroupedExams = (exams) => {
  return useMemo(() => {
    if (!exams || !Array.isArray(exams)) return {};
    
    const result = {};
    exams.forEach((exam) => {
      const batchName = exam.batch?.name || 'Unknown Batch';
      if (!result[batchName]) result[batchName] = [];
      result[batchName].push(exam);
    });
    return result;
  }, [exams]);
};

// You can also create a combined hook that provides all exam-related functionality
export const useExamManagement = () => {
  const examsQuery = useExams();
  const goLiveMutation = useGoLiveExam();
  const deleteMutation = useDeleteExam();
  const groupedExams = useGroupedExams(examsQuery.data);

  return {
    // Exam data
    exams: examsQuery.data || [],
    groupedExams,
    isLoading: examsQuery.isLoading,
    error: examsQuery.error,
    
    // Actions
    goLive: goLiveMutation.mutateAsync, // Use mutateAsync for better error handling
    deleteExam: deleteMutation.mutateAsync,
    
    // Loading states for actions
    isGoingLive: goLiveMutation.isPending,
    isDeleting: deleteMutation.isPending,
    
    // Refetch function
    refetch: examsQuery.refetch
  };
};