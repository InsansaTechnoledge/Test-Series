import React, { useState } from 'react';
import { addExamAPI } from '../../../../../utils/services/questionUploadService';
import { useUser } from '../../../../../contexts/currentUserContext';
import { useCachedBatches } from '../../../../../hooks/useCachedBatches';
import { usePendingExams } from '../../../../../hooks/useExamData';
import { useEffect } from 'react';
import { updateExam } from '../../../../../utils/services/examService';
import { usePageAccess } from '../../../../../contexts/PageAccessContext';
import { useQueryClient } from '@tanstack/react-query';
import { useTheme } from '../../../../../hooks/useTheme';


const ExamForm = ({ canCreateMoreExams, onSubmit, initialData = {
  name: '',
  date: '',
  total_marks: '',
  duration: '',
  batch_id: '',
  ai_proctored: false,
} }) => {

  const {theme} = useTheme()
  const { user } = useUser();
  const { batches = [], batchMap } = useCachedBatches();

  const { pendingExams, isLoading: pendingLoading } = usePendingExams();

  const canAccessPage = usePageAccess()

  const [form, setForm] = useState(initialData);
  const queryClient=useQueryClient();

  useEffect(() => {
    setForm(initialData);

  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      organization_id: user.role === 'organization' ? user._id : (user.organizationId._id || user.organizationId), // Ensure orgId is set correctly
      date: new Date(form.date).toISOString().split('T')[0],
      // organization_id: user?.user?._id   // ✅ Inject orgId here reliably
    };

    if (!payload.organization_id) {
      alert("Missing organization ID. Please try again.");
      return;
    }

    console.log("form data" , form)
    try {
      let response = {};

      if (form.id) {

        const { batch, ...examData } = payload;

        response = await updateExam(form.id, examData);

      }
      else {
        response = await addExamAPI(payload);
      }

      onSubmit(response?.data);
      queryClient.invalidateQueries(['pendingExams', payload.organization_id]);

    } catch (error) {
      console.error('Error creating exam:', error);
      alert('Failed to create exam.');
    }
  };


  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-4xl mx-auto">


    

<div className="mb-8 transform hover:scale-105 transition-all duration-300">
          {pendingExams.length === 0 ? (
            <div className={`backdrop-blur-md rounded-xl p-6 shadow-xl ${
              theme === 'light' 
                ? 'bg-white/50 border border-indigo-200' 
                : 'bg-gray-800/80 border border-gray-600'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  theme === 'light' ? 'bg-indigo-100' : 'bg-indigo-900/50'
                }`}>
                  <svg className={`w-6 h-6 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <p className={`font-semibold ${theme === 'light' ? 'text-indigo-800' : 'text-indigo-300'}`}>
                  No pending exams found for this organization.
                </p>
              </div>
            </div>
          ) : (
            <div className={`backdrop-blur-md rounded-xl p-6 shadow-xl ${
              theme === 'light' 
                ? 'bg-white/50 border border-indigo-200' 
                : 'bg-gray-800/80 border border-gray-600'
            }`}>
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  theme === 'light' ? 'bg-indigo-100' : 'bg-indigo-900/50'
                }`}>
                  <svg className={`w-6 h-6 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-indigo-900' : 'text-indigo-300'}`}>
                  You have these exams pending (complete or delete them)
                </h2>
              </div>
              <ul className="space-y-2">
                {pendingExams.map((exam, index) => (
                  <li key={exam?.id || index} className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${theme === 'light' ? 'bg-indigo-500' : 'bg-indigo-400'}`}></div>
                    <span className={`font-medium ${theme === 'light' ? 'text-indigo-800' : 'text-indigo-300'}`}>
                      {exam?.name || 'Unnamed Exam'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        



        {/* Exam Creation Form */}
        <div className="borderoverflow-hidden mb-8  rounded-3xl p-6 transform hover:scale-105 transition-all duration-300 ">



          {/* new */}

          <div className="bg-gradient-to-r from-[#4c51bf] to-indigo-600 px-8 py-8 rounded-t-2xl  shadow-xl  ">
            <h1 className="text-2xl font-extrabold text-white flex items-center space-x-3">

              <span>Create New Exam</span>
            </h1>
          </div>


          <form onSubmit={handleSubmit} className={`p-8 space-y-8 rounded-b-3xl shadow-2xl ${
            theme === 'light' 
              ? 'backdrop-blur-md bg-white/30 border border-white/40' 
              : 'bg-gray-800 border border-gray-700'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Exam Name */}
              <div className="md:col-span-2">
       
              <label className={`font-bold mb-3 flex items-center space-x-2 text-sm ${
                  theme === 'light' ? 'text-gray-800' : 'text-gray-100'
                }`}>
                  <span>Choose a name for your exam</span>
                </label>
                <input
                  name="name"
                  placeholder="Enter exam name..."
                  className={`p-4 rounded-2xl transition-all duration-300 text-lg w-full pr-14 ${
                    theme === 'light'
                      ? 'bg-white text-gray-900 border-2 border-gray-200 focus:ring-indigo-200 focus:border-indigo-400 placeholder-gray-400'
                      : 'bg-gray-800 text-indigo-100 border-2 border-gray-600 focus:ring-indigo-500 focus:border-indigo-300 placeholder-indigo-300'
                  }`}
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Date */}
              <div>
              <label className={`font-bold mb-3 flex items-center space-x-2 text-sm ${
                  theme === 'light' ? 'text-gray-800' : 'text-gray-100'
                }`}>

                  <span>Schedule your exam</span>
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  className={`p-4 rounded-2xl transition-all duration-300 text-lg w-full  ${
                    theme === 'light'
                      ? 'bg-white text-gray-900 border-2 border-gray-200 focus:ring-indigo-200 focus:border-indigo-400 placeholder-gray-400'
                      : 'bg-gray-800 text-indigo-100 border-2 border-gray-600 focus:ring-indigo-500 focus:border-indigo-300 placeholder-indigo-300'
                  }`}
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Total Marks */}
              <div>
              <label className={`font-bold mb-3 flex items-center space-x-2 text-sm ${
                  theme === 'light' ? 'text-gray-800' : 'text-gray-100'
                }`}>

                  <span>Total Marks</span>
                </label>
                <input
                  name="total_marks"
                  type="number"
                  placeholder="Enter total marks..."
                  className={`p-4 rounded-2xl transition-all duration-300 text-lg w-full  ${
                    theme === 'light'
                      ? 'bg-white text-gray-900 border-2 border-gray-200 focus:ring-indigo-200 focus:border-indigo-400 placeholder-gray-400'
                      : 'bg-gray-800 text-indigo-100 border-2 border-gray-600 focus:ring-indigo-500 focus:border-indigo-300 placeholder-indigo-300'
                  }`}
                  value={form.total_marks}
                  onChange={handleChange}
                />
              </div>

              {/* Duration */}
              <div>
              <label className={`font-bold mb-3 flex items-center space-x-2 text-sm ${
                  theme === 'light' ? 'text-gray-800' : 'text-gray-100'
                }`}>

                  <span>Duration (minutes)</span>
                </label>
                <input
                  name="duration"
                  type="number"
                  placeholder="Enter duration in minutes..."
                  className={`p-4 rounded-2xl transition-all duration-300 text-lg w-full pr-14 ${
                    theme === 'light'
                      ? 'bg-white text-gray-900 border-2 border-gray-200 focus:ring-indigo-200 focus:border-indigo-400 placeholder-gray-400'
                      : 'bg-gray-800 text-indigo-100 border-2 border-gray-600 focus:ring-indigo-500 focus:border-indigo-300 placeholder-indigo-300'
                  }`}
                  value={form.duration}
                  onChange={handleChange}
                />
              </div>

              {/* Batch Selection */}
              <div>
              <label className={`font-bold mb-3 flex items-center space-x-2 text-sm ${
                  theme === 'light' ? 'text-gray-800' : 'text-gray-100'
                }`}>

                  <span>Select Batch</span>
                </label>
                <select
                  name="batch_id"
                  className={`p-4 rounded-2xl transition-all duration-300 text-lg w-full pr-14 ${
                    theme === 'light'
                      ? 'bg-white text-gray-900 border-2 border-gray-200 focus:ring-indigo-200 focus:border-indigo-400 placeholder-gray-400'
                      : 'bg-gray-800 text-indigo-100 border-2 border-gray-600 focus:ring-indigo-500 focus:border-indigo-300 placeholder-indigo-300'
                  }`}
                  value={form.batch_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Batch --</option>
                  {Array.isArray(batches) && batches.map((batch, index) => (
                    <option key={batch?.id || index} value={batch?.id || ''}>
                      {batch?.name || 'Unnamed Batch'} - {batch?.year || 'No Year'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reapplicable Checkbox */}
            <div className="bg-white/50 p-6 rounded-xl border border-gray-200 backdrop-blur-sm transition-all hover:shadow-lg">
              <label htmlFor="reapplicable" className="text-gray-800 font-semibold mb-3 flex items-center space-x-2">

                <span>Can students apply for this exam multiple times?</span>
              </label>
              <div className="flex items-center space-x-3">
                <input
                  id="reapplicable"
                  name="reapplicable"
                  type="checkbox"
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition"
                  onChange={handleChange}
                  checked={form.reapplicable}
                />
                <span className="text-gray-700 font-medium">Allow reattempt</span>
              </div>
            </div>

            <div className="bg-white/50 p-6 rounded-xl border border-gray-200 backdrop-blur-sm transition-all hover:shadow-lg">
            <label htmlFor="ai_proctored" className="...">
              <span>Do you want this exam to be ai-proctored?</span>
            </label>

              <div className="flex items-center space-x-3">
              <input
                  id="ai_proctored"
                  name="ai_proctored"
                  type="checkbox"
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition"
                  onChange={handleChange}
                  checked={form.ai_proctored}
                />
                <span className="text-gray-700 font-medium">yes</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={canAccessPage === false || canCreateMoreExams === false}
              className={`group text-white px-12 py-4 rounded-3xl flex items-center gap-3 font-bold text-lg transition-all duration-300 transform
    ${canAccessPage === false || canCreateMoreExams === false
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-105 hover:shadow-2xl'}
  `}
            >
              <span className={`text-center ${canAccessPage === false || canCreateMoreExams === false ? "text-red-600" : ""}`}>
                {!canAccessPage
                  ? 'Access Denied'
                  : !canCreateMoreExams
                    ? 'Limit Exceeded'
                    : (form.id ? 'Update Exam' : 'Create Exam')
                }
              </span>
            </button>
          </form>

        </div>
        {/* Pending Exams Section */}



      {!form.id && (
          <div className={`backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 ${
            theme === 'light' 
              ? 'bg-white/50 border border-white/30' 
              : 'bg-gray-800/80 border border-gray-700'
          }`}>
            
            {/* Header */}
            <div className={`px-8 py-6 ${
              theme === 'light' 
                ? 'bg-gradient-to-r from-[#4c51bf] to-[#2a4365]' 
                : ' bg-gradient-to-r from-[#4c51bf] to-indigo-600'
            }`}>
              <h2 className="text-2xl font-extrabold text-white flex items-center space-x-3">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Pending Exams (No Questions Added)</span>
              </h2>
            </div>

            {/* Content */}
            <div className="p-8">
              {pendingLoading && (
                <div className="flex items-center justify-center space-x-3 py-8">
                  <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
                    theme === 'light' ? 'border-blue-600' : 'border-indigo-400'
                  }`}></div>
                  <p className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                    Loading pending exams...
                  </p>
                </div>
              )}

           {pendingExams.length === 0 ? (
              <div className="text-center py-12">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                     theme === 'light' ? 'bg-indigo-100' : 'bg-indigo-900/50'
                   }`}>
                     <svg className={`w-8 h-8 ${theme === 'light' ? 'text-indigo-400' : 'text-indigo-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                         d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                     </svg>
                  </div>
                 <p className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                 No pending exams found!
                 </p>
                 <p className={`mt-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                   Create your first exam using the form above.
                 </p>
               </div>
             ) : (
               <div className="space-y-4">
                 {pendingExams.map((exam, index) => (
                   <div
                     key={exam?.id || index}
                     className={`group rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 ${
                       theme === 'light' 
                         ? 'bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 hover:from-indigo-100 hover:to-blue-100' 
  : 'bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600 hover:from-gray-600 hover:to-gray-700'
                     }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              theme === 'light' ? 'bg-indigo-100' : 'bg-indigo-900/50'
                            }`}>
                              <svg className={`w-5 h-5 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <h3 className={`text-xl font-bold ${
                              theme === 'light' ? 'text-indigo-900' : 'text-indigo-300'
                            }`}>
                              {exam?.name || 'Unnamed Exam'}
                            </h3>
                          </div>
                          
                          <div className={`flex flex-wrap gap-4 text-sm ${
                            theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                          }`}>
                            <div className="flex items-center space-x-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <span>Batch: {batchMap[exam?.batch_id]?.name || 'N/A'} | {exam?.batch_id || 'N/A'}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>Date: {exam?.date || 'No Date'}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => exam?.id ? onSubmit(exam) : console.error('Exam ID is missing')}
                          className="px-6 py-3 rounded-2xl transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span>Add Questions</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
       


      </div>
    </div>


  
  );
};

export default ExamForm;