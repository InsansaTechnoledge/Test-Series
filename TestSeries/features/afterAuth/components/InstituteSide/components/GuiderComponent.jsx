import React from 'react'

const GuiderComponent = ({question, answer}) => {
  return (
    <div>
      <div className="p-4 border rounded-md bg-blue-50 text-blue-700 flex items-start gap-3 mb-8">
        <div>
          <p className="font-medium">{question}<span className="text-red-600 px-2">* </span></p>
          <p className="text-sm">{answer}</p>
        </div>
      </div>
    </div>
  )
}

export default GuiderComponent
