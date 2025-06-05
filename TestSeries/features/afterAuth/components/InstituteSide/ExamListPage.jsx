import React, { useEffect, useState } from 'react';
import { Clock, Users, CheckCircle, PlayCircle, Loader2, Calendar, BookOpen, Globe, Heading } from 'lucide-react';
import { goLiveExam , fetchUpcomingExams } from '../../../../utils/services/examService';
import HeadingUtil from '../../utility/HeadingUtil';
import NeedHelpComponent from './components/NeedHelpComponent';

const ExamListPage = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  console.log(exams)

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

  const handleGoLive = async (examId) => {
    try {
      console.log('⏳ Starting go live for exam:', examId);
      setUpdatingId(examId);
  
      const res = await goLiveExam(examId);
      console.log('✅ goLiveExam API response:', res);
  
      await getExams();
      console.log('✅ Exams reloaded after go live');
    } catch (err) {
      console.error('❌ Failed to set exam live:', err);
    } finally {
      setUpdatingId(null);
    }
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
    <div className="min-h-screen ">
      {/* Header Section */}
      {/* <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Examination Dashboard
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Manage and organize your exams by batch. Monitor status and activate exams when ready.
            </p>
          </div>
        </div>
      </div> */}

      <HeadingUtil heading="List of Created/Drafted Exams" description="this shows list of all the exams organization created batchwise"/>

      <NeedHelpComponent heading="Want to Live your Exam ?" about="schedule or immediatly live the exam" question="can i revert live exam ?" answer="yes, you can click on pause button to pause the exams (unless any user started it)" />
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        {Object.keys(groupedExams).length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Exams Found</h3>
            <p className="text-gray-500">There are no exams available at the moment.</p>
          </div>
        ) : (
          Object.entries(groupedExams).map(([batchName, batchExams]) => (
            <div key={batchName} className="space-y-6">
              {/* Batch Header */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-4">
                  
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{batchName}</h2>
                    <p className="text-gray-600 flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Year: {batchExams[0]?.batch?.year || 'N/A'}</span>
                      <span className="mx-2">•</span>
                      <span>{batchExams.length} exam{batchExams.length !== 1 ? 's' : ''}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Exam Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {batchExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    {/* Exam Header */}
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          exam.status === 'live' 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                        }`}>
                          {exam.go_live  ? (
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
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

                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 leading-tight">
                          {exam.name}
                        </h3>
                      </div>
                    </div>

                    {/* Exam Details */}
                    <div className="space-y-3 mt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>Year</span>
                        </span>
                        <span className="font-semibold text-gray-700">
                          {exam.batch?.year || 'N/A'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        {
                            exam.go_live ? "" : (
                                <>
                                 <span className="text-gray-500 flex items-center space-x-2">
                                <Globe className="w-4 h-4" />
                                <span>Go Live</span>
                                </span>
                                </>
                          ) 
                        
                        }
                        
                        <span className={`font-semibold flex items-center space-x-1 ${
                          exam.go_live ? 'text-green-600' : 'text-gray-500'
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
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    {!exam.go_live && (
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => handleGoLive(exam.id)}
                          disabled={updatingId === exam.id}
                          className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center space-x-2 ${
                            updatingId === exam.id
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transform hover:scale-105'
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
                      </div>
                    )}

                    {exam.go_live && (
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="w-full py-3 px-4 rounded-xl bg-green-50 border border-green-200 text-green-700 font-semibold text-sm flex items-center justify-center space-x-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Exam is Live</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExamListPage;