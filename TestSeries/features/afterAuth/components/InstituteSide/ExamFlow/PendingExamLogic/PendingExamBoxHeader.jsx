import React from 'react'

const PendingExamBoxHeader = ({theme , role}) => {
  return (
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
          <span>Pending Exams {role === 'user' && 'Of Batches you have been assigned'}  <span className='text-gray-300'>(No Questions Added)</span> </span>
        </h2>
      </div>
  )
}

export default PendingExamBoxHeader
