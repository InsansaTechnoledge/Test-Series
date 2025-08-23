import React, { useMemo } from 'react'
import PendingExamBoxHeader from './PendingExamBoxHeader'
import { useUser } from '../../../../../../contexts/currentUserContext';
import { Calendar, Plus } from 'lucide-react';

const PendingExamComponent = ({form , theme , pendingLoading , pendingExams , batchMap , onSubmit }) => {
  
  const {user} = useUser();
  // console.log("role" , user.role);
  
  const AllowedBatched = user.batch 
  
  const allowedSet = useMemo(() => new Set(AllowedBatched), [AllowedBatched]);
  // console.log("batch array"  , allowedSet);

  const PendingExamToShow = useMemo(() => {
    // If role is not 'user', just return all pending exams
    if (user?.role !== 'user') {
      return pendingExams;
    }
  
    // Otherwise, filter by allowedSet
    return pendingExams.filter(
      exam => typeof exam?.batch_id === "string" && allowedSet.has(exam.batch_id)
    );
  }, [user?.role, pendingExams, allowedSet]);
  
  // console.log("pending" , PendingExamToShow);


  const humanDate = useMemo(() => {
    const fmt = new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'long',    
      year: 'numeric',
      timeZone: 'Asia/Kolkata',
    });
    return (iso) => {
      if (!iso) return 'No Date';
      const d = new Date(iso);
      if (isNaN(d.getTime())) return 'Invalid date';
      return fmt.format(d); 
    };
  }, []);


  return (
    <div>
      {!form.id && (
          <div className={`backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 ${
            theme === 'light' 
              ? 'bg-white/50 border border-white/30' 
              : 'bg-gray-800/80 border border-gray-700'
          }`}>
            
            {/* Header */}
            <PendingExamBoxHeader theme={theme} role={user.role}/>

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

           {PendingExamToShow.length === 0 ? (
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
                 {PendingExamToShow.map((exam, index) => (
                   <div
                     key={exam?.id || index}
                     className={`group rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 ${
                       theme === 'light' 
                         ? 'bg-indigo-50 hover:bg-indigo-100 ' 
  : 'bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600 hover:from-gray-600 hover:to-gray-700'
                     }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
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
                              <span>Batch: {batchMap[exam?.batch_id]?.name || 'N/A'}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className='w-4 h-4'/>
                              <span>Date: {humanDate(exam?.date) || 'No Date'}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => exam?.id ? onSubmit(exam) : console.error('Exam ID is missing')}
                          className="text-gray-100 px-6 py-3 rounded-2xl transition-all duration-300 font-bold transform hover:scale-105 flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700"
                        >
                         <Plus/>
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
  )
}

export default PendingExamComponent
