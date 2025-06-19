import React from 'react';
import { useLocation } from 'react-router-dom';
import { useCachedStudents } from '../../../../../hooks/useCachedStudents';
import { useCachedBatches } from '../../../../../hooks/useCachedBatches';
import BackButton from '../../../../constants/BackButton';
import { User, Mail, Phone, Users, BookOpen, ArrowLeft, GraduationCap, UserCheck, } from 'lucide-react';

const StudentViewPage = () => {
  const location = useLocation();
  const studentId = location.state?.studentId;
  const { studentMap } = useCachedStudents();
  const { batchMap } = useCachedBatches();

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
    <div className="min-h-screen p-4 md:p-8">
      <div className=" mx-auto ">
        {/* headers */}
        <div className='relative'>


          <div className="relative overflow-hidden  shadow-xl mb-10 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white h-sc">
            {/* Background Blobs */}
            <div className="absolute inset-0 opacity-40">
              <div className="absolute top-10 left-10 w-60 h-60 bg-white rounded-full blur-[100px]"></div>
              <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-400 rounded-full blur-[100px]"></div>
            </div>

            {/* Header Buttons */}
            <div className="relative z-10 px-8 pt-6 pb-12">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="group inline-flex items-center space-x-3 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-md border border-white/20 hover:border-white/40 hover:scale-105"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span>Back</span>
                </button>


              </div>

              {/* Avatar + Name Section */}
              <div className="mt-10 flex flex-col items-center text-center">
                <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg bg-white text-black text-3xl font-bold flex items-center justify-center overflow-hidden">
                  <img
                    src={studentData.profilePhoto}
                    alt={studentData.name}
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                  />

                </div>

                <h1 className="text-4xl font-extrabold mt-4">{studentData.name}</h1>
                <p className='my-1'>{studentData.email}</p>
                <p className="text-yellow-300 font-medium text-lg mt-1">
                  {studentData.name}&apos;s Complete Profile Overview
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className=' flex justify-center flex-col items-center max-w-5xl mx-auto relative z-20 -mt-16'>



          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="rounded-[24px] overflow-hidden shadow-2xl border border-gray-200 bg-white/90 backdrop-blur-xl">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-5 flex items-center space-x-4">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-white">Personal Information</h2>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl text-white shadow-lg">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">Full Name</p>
                    <p className="text-gray-800 font-semibold">{studentData.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl text-white shadow-lg">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">Email Address</p>
                    <p className="text-gray-800 font-semibold">{studentData.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-pink-400 to-pink-500 rounded-xl text-white shadow-lg">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">Phone Number</p>
                    <p className="text-gray-800 font-semibold">{studentData.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl text-white shadow-lg">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">Gender</p>
                    <p className="text-gray-800 font-semibold">{studentData.gender}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Parent Details */}
            <div className="rounded-[24px] overflow-hidden shadow-2xl border border-gray-200 bg-white/90 backdrop-blur-xl">
              <div className="bg-gradient-to-r from-pink-500 to-fuchsia-600 px-6 py-5 flex items-center space-x-4">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-white">Parent Details</h2>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl text-white shadow-lg">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">Parent Email</p>
                    <p className="text-gray-800 font-semibold">{studentData.parentEmail}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl text-white shadow-lg">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">Parent Phone</p>
                    <p className="text-gray-800 font-semibold">{studentData.parentPhone}</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl shadow-sm">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Parent contact information is used for sending their ward's results and updates.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>





          </div>
          {/* Information Cards Grid */}
          <div className="bg-white rounded-3xl shadow-[0_10px_60px_rgba(0,0,0,0.08)] overflow-hidden mb-8 my-6 w-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-blue-600 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Batch Information</h2>
              </div>
              <div className="bg-white/20 px-4 py-1 rounded-full text-white text-sm font-semibold">
                1 Batch
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl p-5 shadow-lg hover:scale-[1.02] transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold capitalize">{batchName}</p>
                      <p className="text-sm text-blue-100">Active Batch</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>





      </div>




    </div>
  );
};

export default StudentViewPage;