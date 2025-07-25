import React, { useState, useEffect } from 'react';
import { MoveLeft, BarChart3, PieChart, Table, FileText, BookOpen, GraduationCap } from 'lucide-react';
import ExamAnalysis from './ExamAnalysis';
import ChapterAnalysis from './ChapterAnalysis';
import SummaryTable from './SummaryTable';
import StatsCard from './constants/StatsCard';
import ErrorDisplay from './constants/ErrorDisplay';
import SubjectDistributionChart from './SubjectPieChart';

const LoadingDisplay = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

const ExamDataDashboard = ({ questions = [], setShowAnalysis }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('overview');

  useEffect(() => {
    const processData = () => {
      try {
        if (!Array.isArray(questions)) {
          throw new Error('Questions data must be an array');
        }

        const processedQuestions = questions.map(question => ({
          id: question.id || '',
          subject: question.subject || 'Unknown',
          exam_id: question.exam_id || 'No Exam',
          chapter: question.chapter || ''
        }));

        setData(processedQuestions);
        setLoading(false);
      } catch (err) {
        setError('Failed to process data: ' + err.message);
        setLoading(false);
      }
    };

    processData();
  }, [questions]);

  if (loading) return <LoadingDisplay />;
  if (error) return <ErrorDisplay error={error} />;

  const totalQuestions = data.length;
  const uniqueSubjects = new Set(data.map(q => q.subject)).size;
  const uniqueExams = new Set(data.map(q => q.exam_id)).size;
  const questionsWithChapters = data.filter(q => q.chapter && q.chapter.trim()).length;

  const navigationItems = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'subjects', label: 'Subject Analysis', icon: BookOpen },
    { key: 'exams', label: 'Exam Analysis', icon: GraduationCap },
    { key: 'chapters', label: 'Chapter Analysis', icon: FileText },
    { key: 'summary', label: 'Summary Table', icon: Table },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'subjects':
        return (
          <div className="space-y-8">
            <SubjectDistributionChart data={data} />
          </div>
        );
      case 'exams':
        return (
          <div className="space-y-8">
            <ExamAnalysis data={data} />
          </div>
        );
      case 'chapters':
        return (
          <div className="space-y-8">
            <ChapterAnalysis data={data} />
          </div>
        );
      case 'summary':
        return (
          <div className="space-y-8">
            <SummaryTable data={data} />
          </div>
        );
      default:
        return (
          <div className="space-y-8">
            {/* Overview with all charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <SubjectDistributionChart data={data} />
              <ExamAnalysis data={data} />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <ChapterAnalysis data={data} />
              <div className="xl:col-span-1">
                <SummaryTable data={data} />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-indigo-600 mb-1">
                Exam Questions Data Dashboard
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                Comprehensive analysis of your exam question database
              </p>
            </div>
            <button 
              onClick={() => setShowAnalysis?.(false)}
              className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 transition-colors duration-200 rounded-lg text-white font-medium py-2 px-4"
            >
              <MoveLeft size={18} />
              Back To QBMS
            </button>
          </div>
        </div>
      </div>

      

      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            title="Total Questions" 
            value={totalQuestions} 
            icon={FileText}
            color="indigo"
          />
          <StatsCard 
            title="Unique Subjects" 
            value={uniqueSubjects} 
            icon={BookOpen}
            color="green"
          />
          <StatsCard 
            title="Total Exams" 
            value={uniqueExams} 
            icon={GraduationCap}
            color="purple"
          />
          <StatsCard 
            title="With Chapters" 
            value={questionsWithChapters} 
            icon={BarChart3}
            color="orange"
          />
        </div>

        {/* Data Insights Footer */}
        <div className="mt-12 bg-indigo-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-indigo-900 mb-4">Data Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="bg-white rounded p-4">
              <div className="font-medium text-gray-900">Average Questions per Subject</div>
              <div className="text-xl font-bold text-indigo-600">
                {uniqueSubjects > 0 ? Math.round(totalQuestions / uniqueSubjects) : 0}
              </div>
            </div>
            <div className="bg-white rounded p-4">
              <div className="font-medium text-gray-900">Average Questions per Exam</div>
              <div className="text-xl font-bold text-purple-600">
                {uniqueExams > 0 ? Math.round(totalQuestions / uniqueExams) : 0}
              </div>
            </div>
            <div className="bg-white rounded p-4">
              <div className="font-medium text-gray-900">Questions with Chapter Info</div>
              <div className="text-xl font-bold text-green-600">
                {totalQuestions > 0 ? Math.round((questionsWithChapters / totalQuestions) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveView(item.key)}
                    className={`${
                      activeView === item.key
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-8">
          {renderContent()}
        </div>

        
      </div>
    </div>
  );
};

export default ExamDataDashboard;