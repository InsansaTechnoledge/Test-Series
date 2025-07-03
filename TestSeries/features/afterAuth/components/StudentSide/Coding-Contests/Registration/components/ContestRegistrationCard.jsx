import React, { useEffect, useState } from 'react';

const ContestRegistrationPage = ({contest}) => {
  
  return (
    <div className="min-h-screen">
     
      {contest.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No participation-based contests found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contest.map(contest => (
            <div
              key={contest.id}
              className="bg-white p-6 rounded-xl shadow-md border hover:shadow-lg transition-all duration-200"
            >
              <h2 className="text-xl font-semibold text-indigo-800">{contest.name}</h2>
              <p className="text-sm text-gray-500 mt-1 mb-3">
                {contest.description || 'No description available'}
              </p>

              <div className="text-sm text-gray-600 mb-2">
                <strong>Duration:</strong> {contest.duration} mins
              </div>

              <div className="text-sm text-gray-600 mb-2">
                <strong>Valid From:</strong> {contest.validity?.start || 'N/A'} <br />
                <strong>Valid Until:</strong> {contest.validity?.end || 'N/A'}
              </div>

              <div className="text-sm mt-2">
                <span
                  className={`px-2 py-1 rounded text-white ${
                    contest.isEnrolled ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {contest.isEnrolled ? 'Already Enrolled' : 'Not Enrolled'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContestRegistrationPage;
