import React from 'react';
import { useExamFilters } from '../../hooks/useExamFilters';
import { useExamAnalytics } from '../../hooks/useExamAnalytics';
import { FilterPanel } from './components/FilterPanel';
import { SummaryCards } from './components/SummaryCards';
import { PerformanceMetrics } from './components/PerformanceMetrics';
import { PerformanceChart } from './components/PerformanceCharts';
import { ScoreDistributionChart } from './components/ScoreDistribution';
import { ActivityChart } from './components/ActivityChart';
import { ExamPerformanceTable } from './components/ExamPerformanceTable';

const ExamAnalysis = ({ results }) => {
  
  const {
    dateRange,
    setDateRange,
    scoreFilter,
    setScoreFilter,
    examFilter,
    setExamFilter,
    processedData,
    uniqueExams
  } = useExamFilters(results);

  const analytics = useExamAnalytics(processedData);

  if (!results || results.length === 0) {
    return (
      <div className="p-6  rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Cumulative Exam Analysis</h2>
        <p className="text-gray-600">No exam data available for analysis.</p>
      </div>
    );
  }

  return (
    <div className="p-6  min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Cumulative Exam Analysis</h1>
      
      <FilterPanel
        dateRange={dateRange}
        setDateRange={setDateRange}
        scoreFilter={scoreFilter}
        setScoreFilter={setScoreFilter}
        examFilter={examFilter}
        setExamFilter={setExamFilter}
        uniqueExams={uniqueExams}
      />

      <SummaryCards analytics={analytics} />

      <PerformanceMetrics analytics={analytics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <PerformanceChart data={analytics.timelineData} />
        <ScoreDistributionChart data={analytics.scoreDistribution} />
      </div>

      <ActivityChart data={analytics.activityData} />

      <ExamPerformanceTable examStats={analytics.examStats} />
    </div>
  );
};

export default ExamAnalysis;