import React, { useState } from "react";
import { useCachedStudents } from "../../../../../hooks/useCachedStudents";
import { useCachedBatches } from "../../../../../hooks/useCachedBatches";
import { useLocation } from "react-router-dom";
import { updateStudentById } from "../../../../../utils/services/studentService";
import {
  User,
  Mail,
  Phone,
  Users,
  CheckCircle,
  XCircle,
  Loader,
} from "lucide-react";
import BackButton from "../../../../constants/BackButton";
import { useTheme } from "../../../../../hooks/useTheme";
import { useToast, ToastContainer } from "../../../../../utils/Toaster";

const StudentEditPage = () => {
  const location = useLocation();
  const studentId = location?.state.studentId;

  const { studentMap } = useCachedStudents();
  const { batches, batchMap } = useCachedBatches();
  const { theme } = useTheme();

  const studentData = studentMap?.[studentId];
  const { toasts, showToast, removeToast } = useToast();
  const [name, setName] = useState(studentData?.name || "");
  const [email, setEmail] = useState(studentData?.email || "");
  const [phone, setPhone] = useState(studentData?.phone || "");
  const [gender, setGender] = useState(studentData?.gender || "");
  const [parentEmail, setparentEmail] = useState(
    studentData?.parentEmail || ""
  );
  const [parentPhone, setParentPhone] = useState(
    studentData?.parentPhone || ""
  );
  const [prevBatch, setPrevBatch] = useState(studentData?.batch.currentBatch);
  const [currentBatch, setCurrentBatch] = useState(
    studentData?.batch.currentBatch || ""
  );

  // Status state
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const batchList = batches.map((b) => (
    <option key={b.id} value={b.id}>
      {b.name}
    </option>
  ));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

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
        _id: studentData.batch?._id,
      },
    };

    try {
      const response = await updateStudentById(studentId, formdata);

      showToast("student data updated");
    } catch (err) {
      console.error("Error updating student:", err);
      setErrorMessage("Failed to update student. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 `}>
      <BackButton />
      <div className="max-w-4xl mx-auto py-2">
        {/* Header */}
        <div
          className={`text-center py-3 ${
            theme === "light"
              ? "bg-gradient-to-r from-indigo-600 to-gray-600"
              : "bg-gradient-to-r from-indigo-700 to-gray-800"
          } text-white relative overflow-hidden rounded-t-2xl`}
        >
          {/* <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg ">
            <User className="w-8 h-8 " />
          </div> */}
          <h1 className="text-3xl font-bold text-white mb-2">
            Edit Student Information
          </h1>
          <p className="text-white ">
            Update student details and batch assignment
          </p>
        </div>

        {/* Main Form Container */}
        <div
          className={`rounded-2xl shadow-2xl overflow-hidden ${
            theme === "light"
              ? "bg-white border border-blue-100"
              : "bg-gray-800 border border-gray-700"
          }`}
        >
          {/* Status Messages */}
          {(loading || successMessage || errorMessage) && (
            <div
              className={`p-6 ${
                theme === "light"
                  ? "border-b border-blue-50"
                  : "border-b border-gray-700"
              }`}
            >
              {loading && (
                <div
                  className={`flex items-center p-4 rounded-xl ${
                    theme === "light" ? "bg-blue-50" : "bg-blue-900/30"
                  }`}
                >
                  <Loader
                    className={`w-5 h-5 animate-spin mr-3 ${
                      theme === "light" ? "text-blue-500" : "text-blue-400"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      theme === "light" ? "text-blue-700" : "text-blue-300"
                    }`}
                  >
                    Updating student information...
                  </span>
                </div>
              )}
              {successMessage && (
                <div
                  className={`flex items-center p-4 rounded-xl ${
                    theme === "light" ? "bg-green-50" : "bg-green-900/30"
                  }`}
                >
                  <CheckCircle
                    className={`w-5 h-5 mr-3 ${
                      theme === "light" ? "text-green-500" : "text-green-400"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      theme === "light" ? "text-green-700" : "text-green-300"
                    }`}
                  >
                    {successMessage}
                  </span>
                </div>
              )}
              {errorMessage && (
                <div
                  className={`flex items-center p-4 rounded-xl ${
                    theme === "light" ? "bg-red-50" : "bg-red-900/30"
                  }`}
                >
                  <XCircle
                    className={`w-5 h-5 mr-3 ${
                      theme === "light" ? "text-red-500" : "text-red-400"
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      theme === "light" ? "text-red-700" : "text-red-300"
                    }`}
                  >
                    {errorMessage}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Student Information Section */}
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      theme === "light" ? "bg-blue-100" : "bg-blue-900/50"
                    }`}
                  >
                    <User
                      className={`w-4 h-4 ${
                        theme === "light" ? "text-blue-600" : "text-blue-400"
                      }`}
                    />
                  </div>
                  <h2
                    className={`text-xl font-semibold ${
                      theme === "light" ? "text-gray-800" : "text-gray-200"
                    }`}
                  >
                    Student Details
                  </h2>
                </div>

                {/* Name */}
                <div className="group">
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter student name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full p-4 pl-12 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                        theme === "light"
                          ? "bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 group-hover:border-blue-300"
                          : "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-900 group-hover:border-blue-400"
                      }`}
                    />
                    <User
                      className={`absolute left-4 w-5 h-5 top-1/2 transform -translate-y-1/2 ${
                        theme === "light" ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="group">
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Enter email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full p-4 pl-12 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                        theme === "light"
                          ? "bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 group-hover:border-blue-300"
                          : "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-900 group-hover:border-blue-400"
                      }`}
                    />
                    <Mail
                      className={`absolute left-4 w-5 h-5 top-1/2 transform -translate-y-1/2 ${
                        theme === "light" ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="group">
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone
                      className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                        theme === "light" ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                    <input
                      type="text"
                      placeholder="Enter phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full pl-12 p-4 border-2 rounded-2xl focus:outline-none focus:ring-4 transition-all duration-300 text-lg ${
                        theme === "light"
                          ? "bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-indigo-200 focus:border-indigo-400"
                          : "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-900 focus:border-indigo-400"
                      }`}
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className="group">
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className={`w-full p-4 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                      theme === "light"
                        ? "bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 group-hover:border-blue-300"
                        : "bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-4 focus:ring-blue-900 group-hover:border-blue-400"
                    }`}
                  >
                    <option value={gender}>{gender}</option>
                    {gender !== "Male" && <option value="Male">Male</option>}
                    {gender !== "Female" && (
                      <option value="Female">Female</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Parent Information & Batch Section */}
              <div className="space-y-6">
                <div className="flex items-center mb-6">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      theme === "light" ? "bg-blue-100" : "bg-blue-900/50"
                    }`}
                  >
                    <Users
                      className={`w-4 h-4 ${
                        theme === "light" ? "text-blue-600" : "text-blue-400"
                      }`}
                    />
                  </div>
                  <h2
                    className={`text-xl font-semibold ${
                      theme === "light" ? "text-gray-800" : "text-gray-200"
                    }`}
                  >
                    Parent & Batch Info
                  </h2>
                </div>

                {/* Parent Email */}
                <div className="group">
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    Parent Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Enter parent email"
                      value={parentEmail}
                      onChange={(e) => setparentEmail(e.target.value)}
                      className={`w-full p-4 pl-12 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                        theme === "light"
                          ? "bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 group-hover:border-blue-300"
                          : "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-900 group-hover:border-blue-400"
                      }`}
                    />
                    <Mail
                      className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                        theme === "light" ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                  </div>
                </div>

                {/* Parent Phone */}
                <div className="group">
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    Parent Phone
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter parent phone number"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      className={`w-full p-4 pl-12 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                        theme === "light"
                          ? "bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 group-hover:border-blue-300"
                          : "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-900 group-hover:border-blue-400"
                      }`}
                    />
                    <Phone
                      className={`absolute left-4 w-5 h-5 top-1/2 transform -translate-y-1/2 ${
                        theme === "light" ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                  </div>
                </div>

                {/* Batch Assignment */}
                <div className="group">
                  <label
                    className={`block text-sm font-semibold mb-2 ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    Batch Assignment
                  </label>
                  <select
                    value={currentBatch}
                    onChange={(e) => setCurrentBatch(e.target.value)}
                    className={`w-full p-4 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                      theme === "light"
                        ? "bg-white border-gray-200 text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 group-hover:border-blue-300"
                        : "bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-4 focus:ring-blue-900 group-hover:border-blue-400"
                    }`}
                  >
                    <option value={currentBatch}>
                      {batchMap?.[currentBatch]?.name || "Select Batch"}
                    </option>
                    {batchList}
                  </select>
                </div>

                {/* Current Batch Display */}
                <div
                  className={`p-4 rounded-xl border ${
                    theme === "light"
                      ? "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200"
                      : "bg-gradient-to-r from-blue-900/30 to-blue-800/30 border-blue-700"
                  }`}
                >
                  <p
                    className={`text-sm mb-1 ${
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    Currently Assigned:
                  </p>
                  <p
                    className={`font-semibold ${
                      theme === "light" ? "text-blue-700" : "text-blue-300"
                    }`}
                  >
                    {batchMap?.[currentBatch]?.name || "No Batch Selected"}
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div
              className={`mt-10 pt-6 flex justify-center ${
                theme === "light"
                  ? "border-t border-gray-100"
                  : "border-t border-gray-700"
              }`}
            >
              <button
                type="submit"
                disabled={loading}
                onClick={handleSubmit}
                className={`group px-12 py-4 rounded-3xl flex items-center gap-3 font-black text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl transform ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : theme === "light"
                    ? "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl"
                    : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl"
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
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default StudentEditPage;
