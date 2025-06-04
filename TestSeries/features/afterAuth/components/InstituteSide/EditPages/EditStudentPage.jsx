import React, { useState } from 'react';
import { useCachedStudents } from '../../../../../hooks/useCachedStudents';
import { useCachedBatches } from '../../../../../hooks/useCachedBatches';
import { useLocation } from 'react-router-dom';
import { updateStudentById } from '../../../../../utils/services/studentService';
import { User, Mail, Phone, Users, CheckCircle, XCircle, Loader } from 'lucide-react';


const StudentEditPage = () => {
  const location = useLocation();
  const studentId = location?.state.studentId;

  const { studentMap } = useCachedStudents();
  const { batches, batchMap } = useCachedBatches();

  const studentData = studentMap?.[studentId];

  const [name, setName] = useState(studentData?.name || '');
  const [email, setEmail] = useState(studentData?.email || '');
  const [phone, setPhone] = useState(studentData?.phone || '');
  const [gender, setGender] = useState(studentData?.gender || '');
  const [parentEmail, setparentEmail] = useState(studentData?.parentEmail || '');
  const [parentPhone, setParentPhone] = useState(studentData?.parentPhone || '');
  const [prevBatch, setPrevBatch] = useState(studentData?.batch.currentBatch);
  const [currentBatch, setCurrentBatch] = useState(studentData?.batch.currentBatch || '');

  // Status state
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const batchList = batches.map((b) => (
    <option key={b.id} value={b.id}>
      {b.name}
    </option>
  ));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    const formdata = {
      name: name,
      email: email,
      phone: phone,
      gender: gender,
      parentEmail: parentEmail,
      parentPhone: parentPhone,
      batch: {
        previousBatch: prevBatch,
        currentBatch: currentBatch,
        _id: studentData.batch?._id
      }
    };

    console.log('Formdata to be sent:', formdata);

    try {
        const response = await updateStudentById(studentId, formdata);
        console.log('Updated student data:', response);
        alert("student data updated")
      } catch (err) {
        console.error('Error updating student:', err);
        setErrorMessage('Failed to update student. Please try again.');
      } finally {
        setLoading(false)
      }
  };

    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-4 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Student Information</h1>
          <p className="text-gray-600">Update student details and batch assignment</p>
        </div>

        {/* Main Form Container */}
        <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden">
          {/* Status Messages */}
          {(loading || successMessage || errorMessage) && (
            <div className="p-6 border-b border-blue-50">
              {loading && (
                <div className="flex items-center p-4 bg-blue-50 rounded-xl">
                  <Loader className="w-5 h-5 text-blue-500 animate-spin mr-3" />
                  <span className="text-blue-700 font-medium">Updating student information...</span>
                </div>
              )}
              {successMessage && (
                <div className="flex items-center p-4 bg-green-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                  <span className="text-green-700 font-medium">{successMessage}</span>
                </div>
              )}
              {errorMessage && (
                <div className="flex items-center p-4 bg-red-50 rounded-xl">
                  <XCircle className="w-5 h-5 text-red-500 mr-3" />
                  <span className="text-red-700 font-medium">{errorMessage}</span>
                </div>
              )}
            </div>
          )}

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Student Information Section */}
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Student Details</h2>
                </div>

                {/* Name */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter student name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 group-hover:border-blue-300"
                    />
                    <User className="absolute left-4 top-4 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Email */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Enter email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 group-hover:border-blue-300"
                    />
                    <Mail className="absolute left-4 top-4 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Phone */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 group-hover:border-blue-300"
                    />
                    <Phone className="absolute left-4 top-4 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Gender */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 group-hover:border-blue-300 bg-white"
                  >
                    <option value={gender}>{gender}</option>
                    {gender !== 'Male' && <option value="Male">Male</option>}
                    {gender !== 'Female' && <option value="Female">Female</option>}
                  </select>
                </div>
              </div>

              {/* Parent Information & Batch Section */}
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Parent & Batch Info</h2>
                </div>

                {/* Parent Email */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Parent Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Enter parent email"
                      value={parentEmail}
                      onChange={(e) => setparentEmail(e.target.value)}
                      className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 group-hover:border-blue-300"
                    />
                    <Mail className="absolute left-4 top-4 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Parent Phone */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Parent Phone</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter parent phone number"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      className="w-full p-4 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 group-hover:border-blue-300"
                    />
                    <Phone className="absolute left-4 top-4 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Batch Assignment */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Batch Assignment</label>
                  <select
                    value={currentBatch}
                    onChange={(e) => setCurrentBatch(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 group-hover:border-blue-300 bg-white"
                  >
                    <option value={currentBatch}>{batchMap?.[currentBatch]?.name || 'Select Batch'}</option>
                    {batchList}
                  </select>
                </div>

                {/* Current Batch Display */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                  <p className="text-sm text-gray-600 mb-1">Currently Assigned:</p>
                  <p className="font-semibold text-blue-700">{batchMap?.[currentBatch]?.name || 'No Batch Selected'}</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-10 pt-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={loading}
                onClick={handleSubmit}
                className={`w-full md:w-auto px-8 py-4 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200 ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl'
                }`}
              >
                <div className="flex items-center justify-center">
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin mr-2" />
                      Updating Student...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Update Student Information
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default StudentEditPage;
