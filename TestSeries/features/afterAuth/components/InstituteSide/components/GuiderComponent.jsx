import React from 'react'

const GuiderComponent = ({question, answer , theme}) => {
  return (
    <div>
      <div className={`p-4 border ${theme === 'light' ? 'bg-blue-50 text-blue-700' : 'bg-gray-600 text-indigo-200'} rounded-md  flex items-start gap-3 mb-8`}>
        <div>
          <p className="font-medium">{question}<span className={`${theme === 'light' ? 'text-red-600' : 'text-red-400'} px-2`}>* </span></p>
          <p className="text-sm">{answer}</p>
        </div>
      </div>
    </div>
  )
}

export default GuiderComponent
