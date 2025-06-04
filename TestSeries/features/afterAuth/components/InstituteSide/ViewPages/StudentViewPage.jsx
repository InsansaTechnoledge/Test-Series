import React from 'react';
import { useLocation } from 'react-router-dom';
import { useCachedStudents } from '../../../../../hooks/useCachedStudents';
import { useCachedBatches } from '../../../../../hooks/useCachedBatches';
import BackButton from '../../../../constants/BackButton';
const StudentViewPage = () => {
  const location = useLocation();
  const studentId = location.state?.studentId;
  const { studentMap } = useCachedStudents();
  const {batchMap} = useCachedBatches();

  const studentData = studentMap?.[studentId];

  const batchName = batchMap?.[studentData.batch?.currentBatch]?.name || 'N/A';

  if (!studentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">Loading student details...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
        <BackButton/>
      <div className="max-w-3xl mx-auto bg-white shadow rounded-lg overflow-hidden">
        <div className="flex flex-col items-center p-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
          <img
            src={studentData.profilePhoto}
            alt={studentData.name}
            className="w-24 h-24 rounded-full border-4 border-white shadow-md"
          />
          <h1 className="mt-3 text-2xl font-bold">{studentData.name}</h1>
          <p className="text-sm opacity-80">{studentData.email}</p>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Basic Information</h2>
          <ul className="space-y-2">
            <li>
              <span className="font-medium text-gray-600">Name:</span>{' '}
              <span className="text-gray-800">{studentData.name}</span>
            </li>
            <li>
              <span className="font-medium text-gray-600">Email:</span>{' '}
              <span className="text-gray-800">{studentData.email}</span>
            </li>
            <li>
              <span className="font-medium text-gray-600">Phone:</span>{' '}
              <span className="text-gray-800">{studentData.phone}</span>
            </li>
            <li>
              <span className="font-medium text-gray-600">Gender:</span>{' '}
              <span className="text-gray-800">{studentData.gender}</span>
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Parent Details</h2>
          <ul className="space-y-2">
            <li>
              <span className="font-medium text-gray-600">Parent Email:</span>{' '}
              <span className="text-gray-800">{studentData.parentEmail}</span>
            </li>
            <li>
              <span className="font-medium text-gray-600">Parent Phone:</span>{' '}
              <span className="text-gray-800">{studentData.parentPhone}</span>
            </li>
          </ul>

          <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Batch Information</h2>
          <ul className="space-y-2">
            <li>
              <span className="font-medium text-gray-600">Current Batch:</span>{' '}
              <span className="text-gray-800">
                {batchName}
              </span>
            </li>
            <li>
              <span className="font-medium text-gray-600">Batch ID:</span>{' '}
              <span className="text-gray-800">{studentData.batch?._id || 'N/A'}</span>
            </li>
          </ul>

        </div>
      </div>
    </div>
  );
};

export default StudentViewPage;
