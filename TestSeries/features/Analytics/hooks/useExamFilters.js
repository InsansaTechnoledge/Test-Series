import { useState, useMemo } from 'react';

export const useExamFilters = (results) => {
  const [dateRange, setDateRange] = useState('all');
  const [scoreFilter, setScoreFilter] = useState('all');
  const [examFilter, setExamFilter] = useState('all');

  const processedData = useMemo(() => {
    if (!results || results.length === 0) return [];

    let filtered = [...results];

    // Date filtering
    if (dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateRange) {
        case '7d':
          filterDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          filterDate.setDate(now.getDate() - 30);
          break;
        case '90d':
          filterDate.setDate(now.getDate() - 90);
          break;
      }
      
      filtered = filtered.filter(item => new Date(item.resultDate) >= filterDate);
    }

    // Score filtering
    if (scoreFilter !== 'all') {
      switch (scoreFilter) {
        case 'positive':
          filtered = filtered.filter(item => item.marks > 0);
          break;
        case 'zero':
          filtered = filtered.filter(item => item.marks === 0);
          break;
        case 'negative':
          filtered = filtered.filter(item => item.marks < 0);
          break;
      }
    }

    // Exam filtering
    if (examFilter !== 'all') {
      filtered = filtered.filter(item => item.examName === examFilter);
    }

    return filtered;
  }, [results, dateRange, scoreFilter, examFilter]);

  const uniqueExams = useMemo(() => {
    if (!results) return [];
    const names = [...new Set(results.map(item => item.examName || 'Unknown Exam'))];
    return names;
  }, [results]);

  return {
    dateRange,
    setDateRange,
    scoreFilter,
    setScoreFilter,
    examFilter,
    setExamFilter,
    processedData,
    uniqueExams
  };
};
