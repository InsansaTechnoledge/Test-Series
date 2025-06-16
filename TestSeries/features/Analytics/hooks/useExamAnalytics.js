import { useMemo } from 'react';

export const useExamAnalytics = (processedData) => {
  return useMemo(() => {
    if (!processedData.length) return {};

    const marks = processedData.map(item => item.marks);
    const totalMarks = marks.reduce((sum, mark) => sum + mark, 0);
    const avgMarks = totalMarks / marks.length;
    const maxMarks = Math.max(...marks);
    const minMarks = Math.min(...marks);
    
    // Performance trends
    const timelineData = processedData
      .sort((a, b) => new Date(a.resultDate) - new Date(b.resultDate))
      .map((item, index) => ({
        attempt: index + 1,
        score: item.marks,
        date: new Date(item.resultDate).toLocaleDateString(),
        examName: item.examName || 'Unknown Exam'
      }));

    // Score distribution
    const scoreRanges = {
      'Negative': marks.filter(m => m < 0).length,
      'Zero': marks.filter(m => m === 0).length,
      'Low (1-3)': marks.filter(m => m > 0 && m <= 3).length,
      'Medium (4-7)': marks.filter(m => m >= 4 && m <= 7).length,
      'High (8+)': marks.filter(m => m >= 8).length
    };

    const scoreDistribution = Object.entries(scoreRanges)
      .map(([range, count]) => ({ range, count }))
      .filter(item => item.count > 0);

    // Exam performance by name
    const examPerformance = {};
    processedData.forEach(item => {
      const examName = item.examName || 'Unknown Exam';
      if (!examPerformance[examName]) {
        examPerformance[examName] = { attempts: 0, totalMarks: 0, scores: [], allAttempts: [] };
      }
      examPerformance[examName].attempts++;
      examPerformance[examName].totalMarks += item.marks;
      examPerformance[examName].scores.push(item.marks);
      examPerformance[examName].allAttempts.push({
        score: item.marks,
        date: new Date(item.resultDate).toLocaleDateString(),
        time: new Date(item.resultDate).toLocaleTimeString()
      });
    });

    const examStats = Object.entries(examPerformance).map(([name, data]) => ({
      examName: name,
      attempts: data.attempts,
      avgScore: (data.totalMarks / data.attempts).toFixed(1),
      bestScore: Math.max(...data.scores),
      worstScore: Math.min(...data.scores),
      allAttempts: data.allAttempts.sort((a, b) => new Date(a.date + ' ' + a.time) - new Date(b.date + ' ' + b.time))
    }));

    // Daily activity
    const dailyActivity = {};
    processedData.forEach(item => {
      const date = new Date(item.resultDate).toLocaleDateString();
      dailyActivity[date] = (dailyActivity[date] || 0) + 1;
    });

    const activityData = Object.entries(dailyActivity)
      .map(([date, count]) => ({ date, attempts: count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    return {
      totalExams: processedData.length,
      avgMarks: avgMarks.toFixed(1),
      maxMarks,
      minMarks,
      positiveScores: marks.filter(m => m > 0).length,
      zeroScores: marks.filter(m => m === 0).length,
      negativeScores: marks.filter(m => m < 0).length,
      timelineData,
      scoreDistribution,
      examStats,
      activityData,
      totalMarks
    };
  }, [processedData]);
};