import React from 'react';
import { useLocation } from 'react-router-dom';
import { useCachedStudents } from '../../../../../hooks/useCachedStudents';
import { useCachedBatches } from '../../../../../hooks/useCachedBatches';
import BackButton from '../../../../constants/BackButton';
import { User, Mail, Phone, Users, BookOpen, ArrowLeft, GraduationCap, UserCheck } from 'lucide-react';

const StudentViewPage = () => {
  const location = useLocation();
  const studentId = location.state?.studentId;
  const { studentMap } = useCachedStudents();
  const {batchMap} = useCachedBatches();

  const studentData = studentMap?.[studentId];

  const batchName = batchMap?.[studentData.batch?.currentBatch]?.name || 'N/A';

  if (!studentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500 text-lg">Loading student details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <BackButton />
        
        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden mb-8">
          {/* Header Section with Profile */}
          <div className="relative">
            <div className="h-40 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600"></div>
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <img
                  src={studentData.profilePhoto}
                  alt={studentData.name}
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                />
               
              </div>
            </div>
          </div>
          
          {/* Profile Info */}
          <div className="pt-16 pb-8 px-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{studentData.name}</h1>
            <p className="text-blue-600 font-medium mb-4">{studentData.email}</p>
           
          </div>
        </div>

        {/* Information Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-3">
                <User className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <User className="w-5 h-5 text-blue-600 mr-4" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-medium">Full Name</p>
                  <p className="text-gray-800 font-semibold">{studentData.name}</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <Mail className="w-5 h-5 text-blue-600 mr-4" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-medium">Email Address</p>
                  <p className="text-gray-800 font-semibold">{studentData.email}</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <Phone className="w-5 h-5 text-blue-600 mr-4" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-medium">Phone Number</p>
                  <p className="text-gray-800 font-semibold">{studentData.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <UserCheck className="w-5 h-5 text-blue-600 mr-4" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-medium">Gender</p>
                  <p className="text-gray-800 font-semibold">{studentData.gender}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Parent Information */}
          <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mr-3">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Parent Details</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                <Mail className="w-5 h-5 text-indigo-600 mr-4" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-medium">Parent Email</p>
                  <p className="text-gray-800 font-semibold">{studentData.parentEmail}</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
                <Phone className="w-5 h-5 text-indigo-600 mr-4" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-medium">Parent Phone</p>
                  <p className="text-gray-800 font-semibold">{studentData.parentPhone}</p>
                </div>
              </div>
            </div>

            {/* Emergency Contact Notice */}
            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> Parent contact information is used for sending their wards results and updates.
              </p>
            </div>
          </div>
        </div>

        {/* Batch Information - Full Width */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mr-3">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Batch Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
              <div className="flex items-center mb-3">
                <GraduationCap className="w-6 h-6 text-green-600 mr-2" />
                <span className="text-green-800 font-semibold">Current Batch</span>
              </div>
              <p className="text-2xl font-bold text-green-700 mb-2">{batchName}</p>
              <p className="text-sm text-green-600">Active enrollment</p>
            </div>
            
          </div>
        </div>

        </div>
      </div>
  );
};

export default StudentViewPage;