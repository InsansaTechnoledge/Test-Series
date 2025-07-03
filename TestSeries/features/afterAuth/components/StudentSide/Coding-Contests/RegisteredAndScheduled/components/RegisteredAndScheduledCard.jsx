import React from 'react'

const RegisteredAndScheduledCard = ({registeredContest}) => {
  return (
    <div className='min-h-screen'>
      
      {registeredContest.length === 0 ? (
        <p className="text-gray-500">No registered or scheduled contests found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {registeredContest.map(contest => (
            <div
              key={contest.id}
              className="bg-white rounded-xl shadow p-5 border hover:shadow-md transition-all"
            >
              <h3 className="text-lg font-bold text-indigo-800">{contest.name}</h3>
              <p className="text-sm text-gray-600 mt-1 mb-3">{contest.description}</p>
              <div className="text-sm text-gray-500">
                <strong>Type:</strong> {contest.type}
              </div>
              <div className="text-sm text-gray-500">
                <strong>Status:</strong>{' '}
                {contest.isEnrolled ? (
                  <span className="text-green-600 font-medium">Enrolled</span>
                ) : (
                  <span className="text-red-600 font-medium">Not Enrolled</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default RegisteredAndScheduledCard
