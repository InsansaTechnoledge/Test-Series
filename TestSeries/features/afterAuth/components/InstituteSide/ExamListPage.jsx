import React, { useEffect, useState } from 'react';
import { Clock, Users, CheckCircle, PlayCircle, Loader2, Calendar, BookOpen, Globe, Heading, CirclePause } from 'lucide-react';
import { goLiveExam, fetchUpcomingExams } from '../../../../utils/services/examService';
import HeadingUtil from '../../utility/HeadingUtil';
import NeedHelpComponent from './components/NeedHelpComponent';
import usePendingExams from '../../../../hooks/useExamData';
import { useNavigate } from 'react-router-dom';

const ExamListPage = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const { pendingExams } = usePendingExams();
  const navigate=useNavigate();


  const getExams = async () => {
    try {
      setLoading(true);
      const response = await fetchUpcomingExams();
      setExams(response.data);
    } catch (err) {
      console.error('❌ Failed to fetch exams:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoLive = async (examId,go_live) => {
    try {
      setUpdatingId(examId);

      const res = await goLiveExam(examId,go_live);

      await getExams();
    } catch (err) {
      console.error('❌ Failed to set exam live:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAddQuestion = (examId) => {
   navigate(`/institute/create-exam/${examId}`);
  };



  const groupByBatch = (examList) => {
    const result = {};
    examList.forEach((exam) => {
      const batchName = exam.batch?.name || 'Unknown Batch';
      if (!result[batchName]) result[batchName] = [];
      result[batchName].push(exam);
    });
    return result;
  };

  useEffect(() => {
    getExams();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
            <BookOpen className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-xl font-medium text-gray-700">Loading exams...</p>
          <p className="text-sm text-gray-500">Please wait while we fetch your exam data</p>
        </div>
      </div>
    );
  }

  const groupedExams = groupByBatch(exams);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Loading State */}
      {loading && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-3 border-gray-200 rounded-full animate-spin border-t-blue-500 mx-auto"></div>
              <BookOpen className="w-6 h-6 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="space-y-1">
              <p className="text-xl font-semibold text-gray-800">Loading exams...</p>
              <p className="text-gray-600">Please wait while we fetch your exam data</p>
            </div>
          </div>
        </div>
      )}
  
      {/* Main Content */}
      {!loading && (
        <>
          <HeadingUtil 
            heading="List of Created/Drafted Exams" 
            description="this shows list of all the exams organization created batchwise" 
          />
  
          <NeedHelpComponent 
            heading="Want to Live your Exam ?" 
            about="schedule or immediatly live the exam" 
            question="can i revert live exam ?" 
            answer="yes, you can click on pause button to pause the exams (unless any user started it)" 
          />
  
          <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
            {Object.keys(groupedExams).length === 0 ? (
              /* Empty State */
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-12 h-12 text-blue-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold text-gray-800">No Exams Found</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    There are no exams available at the moment. Create your first exam to get started.
                  </p>
                </div>
              </div>
            ) : (
              /* Exams List */
              Object.entries(groupedExams).map(([batchName, batchExams]) => (
                <div key={batchName} className="space-y-6">
                  {/* Batch Header */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div className="space-y-1">
                        <h2 className="text-2xl font-bold text-gray-900">{batchName}</h2>
                        <div className="flex items-center space-x-3 text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Year: {batchExams[0]?.batch?.year || 'N/A'}</span>
                          </div>
                          <span>•</span>
                          <span>{batchExams.length} exam{batchExams.length !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>
                  </div>
  
                  {/* Exam Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {batchExams.map((exam) => (
                      <div
                        key={exam.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-200 transition-all duration-200"
                      >
                        {/* Status Badge */}
                        <div className="flex justify-end mb-4">
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            exam.go_live
                              ? 'bg-green-100 text-green-700 border border-green-200'
                              : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                          }`}>
                            {exam.go_live ? (
                              <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>LIVE</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>DRAFT</span>
                              </div>
                            )}
                          </div>
                        </div>
  
                        {/* Exam Content */}
                        <div className="space-y-4">
                          {/* Title */}
                          <h3 className="text-lg font-bold text-gray-900 leading-tight">
                            {exam.name}
                          </h3>
  
                          {/* Details */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center space-x-2 text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>Year</span>
                              </div>
                              <span className="font-semibold text-gray-800">
                                {exam.batch?.year || 'N/A'}
                              </span>
                            </div>
  
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center space-x-2 text-gray-600">
                                <Globe className="w-4 h-4" />
                                <span>Status</span>
                              </div>
                              <div className={`flex items-center space-x-1 font-semibold ${
                                exam.go_live ? 'text-green-600' : 'text-orange-600'
                              }`}>
                                {exam.go_live ? (
                                  <>
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Active</span>
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-4 h-4" />
                                    <span>Pending</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
  
                          {/* Action Buttons */}
                          <div className="pt-4 space-y-3">
                            {!exam.go_live && (
                              <>
                                {pendingExams.some(p => p.id === exam.id) ? (
                                  <button
                                    onClick={() => handleAddQuestion(exam.id)}
                                    className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors duration-200"
                                  >
                                    <div className="flex items-center justify-center space-x-2">
                                      <BookOpen className="w-4 h-4" />
                                      <span>Add Question</span>
                                    </div>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleGoLive(exam.id, exam.go_live)}
                                    disabled={updatingId === exam.id}
                                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 ${
                                      updatingId === exam.id
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                    }`}
                                  >
                                    {updatingId === exam.id ? (
                                      <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Activating...</span>
                                      </>
                                    ) : (
                                      <>
                                        <PlayCircle className="w-4 h-4" />
                                        <span>Go Live</span>
                                      </>
                                    )}
                                  </button>
                                )}
                              </>
                            )}
  
                            {exam.go_live && (
                              <div className="space-y-3">
                                <div className="w-full py-3 px-4 rounded-lg bg-green-50 border border-green-200 text-green-700 font-semibold text-center">
                                  <div className="flex items-center justify-center space-x-2">
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Exam is Live</span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleGoLive(exam.id, exam.go_live)}
                                  disabled={updatingId === exam.id}
                                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2 ${
                                    updatingId === exam.id
                                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                      : 'bg-red-600 hover:bg-red-700 text-white'
                                  }`}
                                >
                                  <CirclePause className="w-4 h-4" />
                                  <span>Pause The Exam</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ExamListPage;