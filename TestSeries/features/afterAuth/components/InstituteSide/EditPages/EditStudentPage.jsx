import React, { useState } from 'react';
import { useCachedStudents } from '../../../../../hooks/useCachedStudents';
import { useCachedBatches } from '../../../../../hooks/useCachedBatches';
import { useLocation } from 'react-router-dom';
// import { updateStudentById } from '../../../../../utils/services/studentService';
import axios from 'axios';

const StudentEditPage = () => {
    const location = useLocation();
    const studentId = location?.state.studentId

    const {studentMap} = useCachedStudents();
    const {batches , batchMap} = useCachedBatches();

    const studentData = studentMap?.[studentId];

    const [name, setName] = useState(studentData?.name || "");
    const [email , setEmail] = useState(studentData?.email || "");
    const [phone , setPhone] = useState(studentData?.phone || "")
    const [gender , setGender] = useState(studentData?.gender || "")
    const [parentEmail , setparentEmail] = useState(studentData?.parentEmail || "")
    const [parentPhone , setParentPhone] = useState(studentData?.parentPhone || "")
    const [prevBatch, setPrevBatch] = useState(studentData?.batch.currentBatch)
    const [currentBatch, setCurrentBatch] = useState(studentData?.batch.currentBatch || '');
    


    const batchList = batches.map((b) => (
        <option key={b.id} value={b.id}>
          {b.name}
        </option>
      ));

      const handleSubmit = async (e) => {
        e.preventDefault();
      
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
      
        console.log("Formdata to be sent:", formdata);
      
        try {
          const response = await axios.patch(
            `http://localhost:8000/api/v1/student/update/${studentId}`,
            formdata,  // send as JSON
            {
              headers: {
                "Content-Type": "application/json"
              }
            }
          );
          console.log("Response:", response.data.data);
        } catch (err) {
          console.error("Error updating student:", err);
        }
      };
      
      
    
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-3xl mx-auto bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Student Information</h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                placeholder="Enter student name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                onChange={(e) => setGender(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={gender}>{gender}</option>
                {gender !== "Male" && <option value="Male">Male</option>}
                {gender !== "Female" && <option value="Female">Female</option>}
              </select>
            </div>

            {/* Parent Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent Email</label>
              <input
                type="email"
                placeholder="Enter parent email"
                value={parentEmail}
                onChange={(e) => setparentEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Parent Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parent Phone</label>
              <input
                type="text"
                placeholder="Enter parent phone number"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Batch */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
              {/* <input
                type="text"
                placeholder="Enter batch ID"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              /> */}
             <select
                value={currentBatch}
                onChange={(e) => setCurrentBatch(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <option value={currentBatch}>{batchMap?.[currentBatch]?.name || 'Select Batch'}</option>
                {batchList}
            </select>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Update Student
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentEditPage;
