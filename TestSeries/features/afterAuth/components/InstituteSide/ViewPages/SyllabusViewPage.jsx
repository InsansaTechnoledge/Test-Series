import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSyllabusById } from '../../../../../utils/services/syllabusService';
import { useCachedUser } from '../../../../../hooks/useCachedUser';
import BackButton from '../../../../constants/BackButton';

const SyllabusViewPage = () => {
  const { syllabusId } = useParams();
  const [syllabusData, setSyllabusData] = useState(null);
  const {userMap} = useCachedUser();

  useEffect(() => { 
    const fetchData = async () => {
      try {
        const res = await fetchSyllabusById(syllabusId);
        console.log(res.data);
        setSyllabusData(res.data);
      } catch (e) {
        console.log('Something went wrong', e);
      }
    };

    if (syllabusId) {
      fetchData();
    }
  }, [syllabusId]);

  if (!syllabusData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-blue-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Syllabus</h2>
            <p className="text-gray-600">Please wait while we fetch the syllabus details...</p>
          </div>
        </div>
      </div>
    );
  }
  
  const { syllabus, created_at, updated_at, updated_by } = syllabusData;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-blue-100 p-6">
      <div className="max-w-5xl mx-auto">
        <BackButton/>
        {/* Header Section */}
        <div className=" mt-8 mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-900 bg-clip-text text-transparent">
              Syllabus Details
            </h1>
          </div>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-blue-600 rounded-full"></div>
        </div>
  
        {/* Metadata Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8 overflow-hidden relative">
          <div className="relative">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Syllabus Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10l-1 12H8L7 7zm0 0V6a2 2 0 012-2h6a2 2 0 012 2v1" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Syllabus ID</p>
                    <p className="text-lg font-mono text-gray-900 bg-gray-50 px-3 py-1 rounded-lg inline-block">{syllabusId}</p>
                  </div>
                </div>
  
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Created At</p>
                    <p className="text-lg text-gray-900">{new Date(created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
  
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Updated At</p>
                    <p className="text-lg text-gray-900">{new Date(updated_at).toLocaleString()}</p>
                  </div>
                </div>
  
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-0.5">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Updated By</p>
                    <p className="text-lg text-gray-900">{userMap[updated_by]?.name || updated_by}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Subjects & Topics Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-600 px-8 py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Subjects & Topics</h2>
            </div>
          </div>
  
          <div className="p-8">
            {syllabus && Object.entries(syllabus).length > 0 ? (
              <div className="space-y-8">
                {Object.entries(syllabus).map(([subject, topics], index) => (
                  <div key={subject} className="group">
                    <div className="flex items-start space-x-4">
                      {/* Subject Number Badge */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {index + 1}
                        </div>
                      </div>
                      
                      {/* Subject Content */}
                      <div className="flex-1 min-w-0">
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200 group-hover:shadow-md transition-all duration-200">
                          <h3 className="text-2xl font-bold text-blue-900 mb-4 flex items-center space-x-2">
                            <span>{subject.toUpperCase()}</span>
                            <div className="h-1 flex-1 bg-gradient-to-r from-blue-400 to-transparent rounded-full ml-4"></div>
                          </h3>
                          
                          {Array.isArray(topics) && topics.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {topics.map((topic, idx) => (
                                <div key={idx} className="flex items-start space-x-3 group/item">
                                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0 group-hover/item:bg-blue-600 transition-colors duration-200"></div>
                                  <p className="text-gray-700 leading-relaxed group-hover/item:text-gray-900 transition-colors duration-200">
                                    {topic}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <p className="text-gray-500 font-medium">No topics available for this subject</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Syllabus Content</h3>
                <p className="text-gray-500">This syllabus doesn't contain any subjects or topics yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SyllabusViewPage;
