import React, { useState } from 'react';
import { addExamAPI } from '../../../../../utils/services/questionUploadService';
import { useUser } from '../../../../../contexts/currentUserContext';
import { useCachedBatches } from '../../../../../hooks/useCachedBatches';
import { usePendingExams } from '../../../../../hooks/useExamData';
import { useEffect } from 'react';
import { updateExam } from '../../../../../utils/services/examService';
import { usePageAccess } from '../../../../../contexts/PageAccessContext';


const ExamForm = ({ onSubmit ,initialData={ name: '',
    date: '',
    total_marks: '',
    duration: '',
    batch_id: '',
  }}) => {
  const { user } = useUser();
  const { batches = [] , batchMap } = useCachedBatches();

  const { pendingExams, isLoading: pendingLoading } = usePendingExams();
  
    const canAccessPage = usePageAccess()

  console.log(pendingExams)
  const [form, setForm] = useState(initialData);

    useEffect(() => {
    setForm(initialData);
    console.log("Initial data set in form:", initialData);
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
      organization_id: user.role==='organization'?user._id :user.organizationId,
      date: new Date(form.date).toISOString().split('T')[0],
      // organization_id: user?.user?._id   // ✅ Inject orgId here reliably
    };

    if (!payload.organization_id) {
      alert("Missing organization ID. Please try again.");
      return;
    }

    try {
      let response = {};

      if(form.id){
        console.log("Updating existing exam with ID:", form.id);
        console.log("Payload for update:", payload);
        const {batch,...examData}=payload;
        console.log("Exam data to update:", examData);
       response = await updateExam(form.id, examData);
        console.log("Exam updated successfully:", response.data);
      
      }
      else{
       response = await addExamAPI(payload);
    }
      onSubmit(response?.data);
    
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
    <div className="bg-white/50 backdrop-blur-md border border-indigo-200 rounded-xl p-6 shadow-xl">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-indigo-800 font-semibold">No pending exams found for this organization.</p>
      </div>
    </div>
  ) : (
    <div className="bg-white/50 backdrop-blur-md border border-indigo-200 rounded-xl p-6 shadow-xl">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-indigo-900">You have these exams pending (complete or delete them)</h2>
      </div>
      <ul className="space-y-2">
        {pendingExams.map((exam, index) => (
          <li key={exam?.id || index} className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
            <span className="text-indigo-800 font-medium">{exam?.name || 'Unnamed Exam'}</span>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>




  
        {/* Exam Creation Form */}
        <div className="borderoverflow-hidden mb-8  rounded-3xl p-6 transform hover:scale-105 transition-all duration-300 ">
       
  
         
          {/* new */}
     
<div className="bg-gradient-to-r from-[#4c51bf] to-[#2a4365] px-8 py-8 rounded-t-2xl  shadow-xl  ">
  <h1 className="text-2xl font-extrabold text-white flex items-center space-x-3">
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
    <span>Create New Exam</span>
  </h1>
</div>


<form onSubmit={handleSubmit} className="p-8 space-y-6 backdrop-blur-md bg-white/30 rounded-b-2xl shadow-2xl border border-white/40">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Exam Name */}
    <div className="md:col-span-2">
      <label className="text-gray-800 font-semibold mb-2 flex items-center space-x-2">
        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10l-1 12H8L7 7zm0 0V6a2 2 0 012-2h6a2 2 0 012 2v1" />
        </svg>
        <span>Choose a name for your exam</span>
      </label>
      <input
        name="name"
        placeholder="Enter exam name..."
        className="w-full p-4 rounded-xl bg-white/70 shadow-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all hover:shadow-md"
        value={form.name}
        onChange={handleChange}
        required
      />
    </div>

    {/* Date */}
    <div>
      <label className="text-gray-800 font-semibold mb-2 flex items-center space-x-2">
        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>Schedule your exam</span>
      </label>
      <input
        type="datetime-local"
        name="date"
        className="w-full p-4 rounded-xl bg-white/70 shadow-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all hover:shadow-md"
        value={form.date}
        onChange={handleChange}
        required
      />
    </div>

    {/* Total Marks */}
    <div>
      <label className="text-gray-800 font-semibold mb-2 flex items-center space-x-2">
        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <span>Total Marks</span>
      </label>
      <input
        name="total_marks"
        type="number"
        placeholder="Enter total marks..."
        className="w-full p-4 rounded-xl bg-white/70 shadow-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all hover:shadow-md"
        value={form.total_marks}
        onChange={handleChange}
      />
    </div>

    {/* Duration */}
    <div>
      <label className="text-gray-800 font-semibold mb-2 flex items-center space-x-2">
        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Duration (minutes)</span>
      </label>
      <input
        name="duration"
        type="number"
        placeholder="Enter duration in minutes..."
        className="w-full p-4 rounded-xl bg-white/70 shadow-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all hover:shadow-md"
        value={form.duration}
        onChange={handleChange}
      />
    </div>

    {/* Batch Selection */}
    <div>
      <label className="text-gray-800 font-semibold mb-2 flex items-center space-x-2">
        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span>Select Batch</span>
      </label>
      <select
        name="batch_id"
        className="w-full p-4 rounded-xl bg-white/70 shadow-sm border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all hover:shadow-md"
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
      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
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

  {/* Submit Button */}
  <div className="pt-4 flex justify-center">
    <button
      type="submit"
      disabled={canAccessPage === false}
      className={`group text-white px-12 py-4 rounded-3xl flex items-center gap-3 font-bold text-lg transition-all duration-300 transform
        ${canAccessPage === false
          ? 'bg-gray-300 cursor-not-allowed'
          : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-105 hover:shadow-2xl'}
      `}
    >
      <span className={`${!canAccessPage && "text-red-600"}`}>
        {canAccessPage ? (
          <>
          
            {form.id ? 'Update Exam' : 'Create Exam'}
          </>
        ) : (
          'Access Denied'
        )}
      </span>
    </button>
  </div>
</form>

        </div>
  



{/* Pending Exams Section */}
{!form.id && (
  <div className="bg-white/50 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30 overflow-hidden transform hover:scale-105 transition-all duration-300">
    <div className="bg-gradient-to-r from-[#4c51bf] to-[#2a4365] px-8 py-6">
      <h2 className="text-2xl font-extrabold text-white flex items-center space-x-3">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        <span>Pending Exams (No Questions Added)</span>
      </h2>
    </div>

    <div className="p-8">
      {pendingLoading && (
        <div className="flex items-center justify-center space-x-3 py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-700 font-medium">Loading pending exams...</p>
        </div>
      )}

      {pendingExams.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-700 text-lg font-semibold">No pending exams found!</p>
          <p className="text-gray-500 mt-2">Create your first exam using the form above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingExams.map((exam, index) => (
            <div
              key={exam?.id || index}
              className="group bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 hover:from-indigo-100 hover:to-blue-100"
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-indigo-900">{exam?.name || 'Unnamed Exam'}</h3>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-700">
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>Batch: {batchMap[exam?.batch_id]?.name || 'N/A'} | {exam?.batch_id || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Date: {exam?.date || 'No Date'}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => exam?.id ? onSubmit(exam) : console.error('Exam ID is missing')}
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 font-semibold shadow-md hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
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