import React, { useEffect, useState } from "react";
import {
  X,
  Upload,
  CheckCircle,
  PlusCircle,
  FileSpreadsheet,
  Users,
  Calendar,
  BookOpen,
  Zap,
  Target,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import * as XLSX from "xlsx";
import NeedHelpComponent from "./components/NeedHelpComponent";
import { useCachedUser } from "../../../../hooks/useCachedUser";
import { useCachedRoleGroup } from "../../../../hooks/useCachedRoleGroup";
import { createBatch } from "../../../../utils/services/batchService";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "../../../../contexts/currentUserContext";
import Banner from "../../../../assests/Institute/create batch.svg";
import { usePageAccess } from "../../../../contexts/PageAccessContext";
import useLimitAccess from "../../../../hooks/useLimitAccess";
import { useLocation } from "react-router-dom";
import { useCachedOrganization } from "../../../../hooks/useCachedOrganization";
import { useTheme } from "../../../../hooks/useTheme";
import { useToast, ToastContainer } from "../../../../utils/Toaster";
const CreateBatch = () => {
  const [formData, setFormData] = useState({ batchMode: "only-subjects" });
  const [selectedFaculties, setSelectedFaculties] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const { toasts, showToast, removeToast } = useToast();
  // Add state for dynamic batch count tracking
  const [createdBatchesCount, setCreatedBatchesCount] = useState(0);

  const { users, isLoading } = useCachedUser();
  const { roleMap } = useCachedRoleGroup();
  const queryClient = useQueryClient();
  const { user, getFeatureKeyFromLocation } = useUser();
  const location = useLocation();
  const canAccessPage = usePageAccess();
  const canCreateMoreBatches = useLimitAccess(
    getFeatureKeyFromLocation(location.pathname),
    "totalBatches"
  );

  const organization =
    user.role !== "organization"
      ? useCachedOrganization({
          userId: user._id,
          orgId: user.organizationId._id,
        })?.organization
      : null;

  useEffect(() => {
    if (users) {
      setFaculty(users);
      setSelectedFaculties([]);
    }
  }, [users]);

  // Calculate dynamic available limit
  const Creation_Limit = user?.planFeatures?.batch_feature.value;
  const Total_Batch =
    user?.role === "organization"
      ? user.metaData?.totalBatches
      : organization?.metaData?.totalBatches;

  // Dynamic calculation that includes newly created batches in current session
  const Available_limit = Creation_Limit - (Total_Batch + createdBatchesCount);
  const { theme } = useTheme();
  const onChangeHandler = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const deleteSubject = (indexToDelete) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((_, index) => index !== indexToDelete),
    }));
  };

  const addSubject = () => {
    const newSubject = document
      .getElementById("subjects")
      .value.trim()
      .toLowerCase();
    if (!newSubject) return;
    setFormData((prev) => ({
      ...prev,
      subjects: [...(prev.subjects || []), newSubject],
    }));
    document.getElementById("subjects").value = "";
    document.getElementById("subjects").focus();
  };

  const generateExcelTemplate = (subjects) => {
    const workbook = XLSX.utils.book_new();
    subjects.forEach((subject) => {
      const sheetData = [["Chapter Name"], ["Sample Chapter"]];
      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, subject);
    });

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "syllabus_template.xlsx";
    link.click();
  };

  const handleFacultySelect = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) return;
    const selectedUser = faculty.find((faculty) => faculty._id === selectedId);
    if (!selectedUser) return;

    setSelectedFaculties((prev) => [...prev, selectedUser]);
    setFaculty((prev) => prev.filter((faculty) => faculty._id !== selectedId));
    e.target.value = "";
  };
  const inputCommon = `p-4 rounded-2xl transition-all duration-300 text-lg w-full pr-14 ${
    theme === "light"
      ? "bg-white text-gray-900 border-2 border-gray-200 focus:ring-indigo-200 focus:border-indigo-400 placeholder-gray-400"
      : "bg-gray-800 text-indigo-100 border-2 border-gray-600 focus:ring-indigo-500 focus:border-indigo-300 placeholder-indigo-300"
  }`;

  const handleFacultyRemove = (facultyId) => {
    const facultyToRemove = selectedFaculties.find((f) => f._id === facultyId);
    if (!facultyToRemove) return;

    setSelectedFaculties((prev) => prev.filter((f) => f._id !== facultyId));
    setFaculty((prev) => [...prev, facultyToRemove]);
  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.year ||
      !formData.subjects?.length ||
      !formData.batchMode
    ) {
      showToast("Please fill all required fields.", "warning");
      return;
    }

    if (
      formData.batchMode === "subjects-chapters" &&
      !formData.syllabus?.content
    ) {
      showToast("Please upload syllabus Excel file.", "warning");
      return;
    }

    let processedSyllabus = null;

    // Convert Excel JSON to { subject: [chapters] }
    if (formData.batchMode === "subjects-chapters") {
      processedSyllabus = {};
      const raw = formData.syllabus.content;

      for (const subject in raw) {
        const chaptersArray = raw[subject]
          .map((row) => row["Chapter Name"]?.trim()) // Clean whitespace
          .filter(Boolean); // Remove empty/null
        processedSyllabus[subject] = chaptersArray;
      }
    }

    const payload = {
      name: formData.name,
      year: formData.year,
      subjects: formData.subjects,
      faculties: selectedFaculties.map((f) => f._id),
      syllabus: processedSyllabus,
    };

    try {
      const response = await createBatch(payload);
      if (response.status === 200) {
        showToast("Batch created successfully!");

        // Increment the created batches count for dynamic limit calculation
        setCreatedBatchesCount((prev) => prev + 1);

        // Reset form
        setFormData({ batchMode: "only-subjects" });
        setSelectedFaculties([]);
        setFaculty((prev) => [...prev, ...selectedFaculties]);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        showToast(
          "Batch with this name already exists. Please choose a different name.",
          "error"
        );
        return;
      } else {
        showToast("Failed to create batch. Please try again.", "error");
        console.error("Error creating batch:", error.response);
      }
    } finally {
      await queryClient.invalidateQueries(["batches", user._id]);
    }
  };

  const getYearOptions = (past = 5, future = 6) => {
    const currentYear = new Date().getFullYear();
    return Array.from(
      { length: past + future + 1 },
      (_, i) => currentYear - past + i
    );
  };

  // Missing component definition for the Download icon
  const Download = ({ size, className }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  );

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 "></div>
        <div className="absolute inset-0 "></div>

        <div
          className="relative z-10 px-6 py-24 text-center bg-cover bg-center bg-no-repeat rounded-xl"
          style={{ backgroundImage: `url(${Banner})` }}
        >
          <div
            className={`absolute inset-0 ${
              theme === "dark" ? "bg-gray-900/60" : "bg-black/20"
            }`}
          ></div>
          <div className="inline-flex items-center space-x-3 mb-4">
            <h1 className="text-6xl z-10 md:text-7xl font-black text-white tracking-tight">
              Create Batch
            </h1>
          </div>
          <p className="text-xl z-10 text-white/80 max-w-2xl mx-auto font-medium">
            Create batch with subjects, faculty, syllabus.
          </p>
          <div className="flex items-center justify-center">
            <p className="mt-8 text-indigo-700 bg-indigo-50 border border-indigo-100 px-5 py-4 rounded-2xl text-base flex items-center gap-3 shadow-sm backdrop-blur-sm">
              <AlertTriangle className="w-5 h-5 text-indigo-400" />
              <span>
                <span className="font-semibold">Note:</span> For your current
                plan, you have an available limit of
                <span
                  className={`font-bold ${
                    Available_limit > 0 ? "text-green-600" : "text-red-600"
                  } mx-1`}
                >
                  {Available_limit}
                </span>
                Batches.
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* limits section */}
          <div
            className={`${
              theme === "light" ? "bg-white" : "bg-gray-800"
            }  rounded-3xl p-6 shadow-xl border-l-4 border-indigo-600 transform hover:scale-105 transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-semibold ${
                    theme === "light" ? "text-gray-600" : "text-gray-200"
                  }  uppercase tracking-wide`}
                >
                  Available Limit
                </p>
                <p
                  className={`text-2xl font-black ${
                    Available_limit > 0 ? "text-green-500" : "text-red-500"
                  } capitalize`}
                >
                  {Available_limit}
                </p>
                {/* Optional: Show session progress */}
                {createdBatchesCount > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    +{createdBatchesCount} created this session
                  </p>
                )}
              </div>
              <div
                className={` ${
                  theme === "light" ? "bg-indigo-100" : "bg-indigo-400"
                } p-3 rounded-2xl`}
              >
                {/* <Target className="w-8 h-8 text-indigo-600" /> */}
              </div>
            </div>
          </div>

          <div
            className={`${
              theme === "light" ? "bg-white" : "bg-gray-800"
            }  rounded-3xl p-6 shadow-xl border-l-4 border-indigo-600 transform hover:scale-105 transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-semibold   ${
                    theme === "light" ? "text-gray-600" : "text-gray-200"
                  } uppercase tracking-wide`}
                >
                  Batch Type
                </p>
                <p
                  className={`text-2xl font-black ${
                    theme === "light" ? "text-indigo-600" : "text-indigo-200"
                  } capitalize`}
                >
                  {formData.batchMode?.replace("-", " ")}
                </p>
              </div>
              <div
                className={` ${
                  theme === "light" ? "bg-indigo-100" : "bg-indigo-400"
                } p-3 rounded-2xl`}
              >
                {/* <Target className="w-8 h-8 text-indigo-600" /> */}
              </div>
            </div>
          </div>

          <div
            className={`${
              theme === "light" ? "bg-white" : "bg-gray-800"
            }  rounded-3xl p-6 shadow-xl border-l-4 border-indigo-600 transform hover:scale-105 transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-semibold   ${
                    theme === "light" ? "text-gray-600" : "text-gray-200"
                  } uppercase tracking-wide`}
                >
                  Subjects Added
                </p>
                <p
                  className={`text-2xl font-black ${
                    theme === "light" ? "text-indigo-600" : "text-indigo-200"
                  } capitalize`}
                >
                  {formData.subjects?.length || 0}
                </p>
              </div>
              <div
                className={` ${
                  theme === "light" ? "bg-indigo-100" : "bg-indigo-400"
                } p-3 rounded-2xl`}
              >
                {/* <Target className="w-8 h-8 text-indigo-600" /> */}
              </div>
            </div>
          </div>

          <div
            className={`${
              theme === "light" ? "bg-white" : "bg-gray-800"
            }  rounded-3xl p-6 shadow-xl border-l-4 border-indigo-600 transform hover:scale-105 transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-semibold   ${
                    theme === "light" ? "text-gray-600" : "text-gray-200"
                  } uppercase tracking-wide`}
                >
                  Faculty Selected
                </p>
                <p
                  className={`text-2xl font-black ${
                    theme === "light" ? "text-indigo-600" : "text-indigo-200"
                  } capitalize`}
                >
                  {selectedFaculties.length}
                </p>
              </div>
              <div
                className={` ${
                  theme === "light" ? "bg-indigo-100" : "bg-indigo-400"
                } p-3 rounded-2xl`}
              >
                {/* <Target className="w-8 h-8 text-indigo-600" /> */}
              </div>
            </div>
          </div>
        </div>

        {/* Need Help Component */}
        <div className="mb-8">
          <NeedHelpComponent
            heading="Creating Batch ?"
            question="Want to create new Batch"
            answer="Batches can be created with subjects and with subjects plus chapters , choose as per your requirement"
          />
        </div>

        {/* Dynamic limit warning */}
        {Available_limit <= 0 && (
          <p
            className={`mt-4 text-center ${
              theme === "light"
                ? "bg-red-100 border text-red-600 border-red-200"
                : "bg-red-600 text-gray-100"
            } text-sm  px-4 py-2 rounded-xl shadow-sm backdrop-blur-sm`}
          >
            You've reached your batch creation limit.{" "}
            <br className="sm:hidden" />
            <span className="font-medium">Upgrade your plan</span> to continue.
          </p>
        )}

        {/* Main Form Card */}
        <div
          className={`${
            theme === "light" ? " border border-gray-100" : "bg-gray-800"
          } rounded-3xl shadow-2xl overflow-hidden mt-5`}
        >
          {/* Batch Type Selection */}
          <div className="p-6  bg-gradient-to-r from-indigo-500 to-indigo-400 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10 flex justify-between">
              <h2 className="text-3xl font-black mb-6 flex items-center space-x-3">
                {/* <Target className="w-8 h-8" /> */}
                <span>Select Batch Type</span>
              </h2>
              <div className="flex gap-6">
                <label
                  className={`group flex items-center gap-3 cursor-pointer bg-white/20 backdrop-blur-sm px-6 py-4 rounded-2xl hover:bg-white/30 transition-all duration-300 hover:scale-105`}
                >
                  <input
                    type="radio"
                    name="batchMode"
                    value="only-subjects"
                    defaultChecked
                    onChange={(e) =>
                      onChangeHandler("batchMode", e.target.value)
                    }
                    checked={formData.batchMode === "only-subjects"}
                    className="w-5 h-5 accent-white"
                  />
                  <span className="text-lg font-bold">Only Subjects</span>
                  {/* <BookOpen className="w-5 h-5 group-hover:animate-pulse" /> */}
                </label>
                <label
                  className={`group flex items-center gap-3 cursor-pointer bg-white/20 backdrop-blur-sm px-6 py-4 rounded-2xl hover:bg-white/30 transition-all duration-300 hover:scale-105`}
                >
                  <input
                    type="radio"
                    name="batchMode"
                    value="subjects-chapters"
                    onChange={(e) =>
                      onChangeHandler("batchMode", e.target.value)
                    }
                    checked={formData.batchMode === "subjects-chapters"}
                    className="w-5 h-5 accent-white"
                  />
                  <span className="text-lg font-bold">Subjects & Chapters</span>
                  {/* <FileSpreadsheet className="w-5 h-5 group-hover:animate-pulse" /> */}
                </label>
              </div>
            </div>
          </div>

          {/* Excel Download Section */}
          {formData.batchMode === "subjects-chapters" && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-indigo-100 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4 text-indigo-800">
                  <div>
                    <h3 className="font-bold text-lg">
                      Excel Template Required
                    </h3>
                    <p className="text-indigo-600">
                      Download the template, fill it with chapter information,
                      and upload it back
                    </p>
                  </div>
                </div>
                <button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 hover:scale-105 hover:shadow-xl font-bold"
                  onClick={() => {
                    if (formData.subjects?.length > 0) {
                      generateExcelTemplate(formData.subjects);
                    } else {
                      showToast("Please add subjects first.", "warning");
                    }
                  }}
                >
                  {/* <Download size={20} /> */}
                  <span>Download Template</span>
                </button>
              </div>
            </div>
          )}

          {/* Form Content */}
          <div className="p-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Batch Name */}
                <div className="group">
                  <label
                    htmlFor="name"
                    className={`flex items-center gap-2 ${
                      theme === "light" ? "text-gray-700" : "text-indigo-100"
                    }  font-bold mb-3 text-lg`}
                  >
                    {/* <Target className="w-5 h-5 text-indigo-600" /> */}
                    Batch Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name?.toLowerCase() || ""}
                    onChange={(e) => onChangeHandler("name", e.target.value)}
                    className={inputCommon}
                    placeholder="Enter batch name"
                  />
                </div>

                {/* Year */}
                <div className="group">
                  <label
                    htmlFor="name"
                    className={`flex items-center gap-2 ${
                      theme === "light" ? "text-gray-700" : "text-indigo-100"
                    }  font-bold mb-3 text-lg`}
                  >
                    {/* <Calendar className="w-5 h-5 text-indigo-600" /> */}
                    Academic Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="year"
                    name="year"
                    value={formData.year || ""}
                    onChange={(e) =>
                      onChangeHandler("year", parseInt(e.target.value))
                    }
                    className={inputCommon}
                  >
                    <option value="">Select academic year</option>
                    {getYearOptions().map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Syllabus File Upload */}
                {formData.batchMode === "subjects-chapters" && (
                  <div className="group">
                    <label
                      htmlFor="syllabus"
                      className={`flex items-center gap-2 ${
                        theme === "light" ? "text-gray-700" : "text-gray-200"
                      }  font-bold mb-3 text-lg`}
                    >
                      <FileSpreadsheet
                        className={`w-5 h-5 ${
                          theme === "light"
                            ? "text-indigo-600"
                            : "text-indigo-400"
                        }`}
                      />
                      Syllabus File <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full">
                      <label
                        htmlFor="dropzone-file"
                        className={`flex flex-col items-center justify-center w-full h-40 border-3 border-dashed rounded-3xl cursor-pointer transition-all duration-300 ${
                          formData.syllabus?.name
                            ? "bg-green-50 border-green-300 hover:bg-green-100"
                            : theme === "light"
                            ? "bg-gray-50 border-gray-300 hover:bg-gray-100 hover:border-indigo-400"
                            : "bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-indigo-400"
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {formData.syllabus?.name ? (
                            <div className="flex flex-col items-center text-green-600 animate-pulse">
                              <CheckCircle size={48} className="mb-3" />
                              <p className="text-lg font-bold">
                                {formData.syllabus.name}
                              </p>
                              <p className="text-sm text-green-500 mt-2 bg-green-100 px-3 py-1 rounded-full">
                                File uploaded successfully
                              </p>
                            </div>
                          ) : (
                            <div
                              className={`flex flex-col items-center ${
                                theme === "light"
                                  ? "text-gray-500"
                                  : "text-gray-400"
                              }`}
                            >
                              <Upload
                                size={40}
                                className="mb-3 animate-bounce"
                              />
                              <p className="text-lg font-bold mb-2">
                                <span
                                  className={`${
                                    theme === "light"
                                      ? "text-indigo-600"
                                      : "text-indigo-400"
                                  }`}
                                >
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p
                                className={`text-sm ${
                                  theme === "light"
                                    ? "bg-gray-100"
                                    : "bg-gray-600"
                                } px-3 py-1 rounded-full`}
                              >
                                Excel files only (.xlsx)
                              </p>
                            </div>
                          )}
                        </div>
                        <input
                          id="dropzone-file"
                          type="file"
                          className="hidden"
                          accept=".xlsx"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const data = new Uint8Array(event.target.result);
                              const workbook = XLSX.read(data, {
                                type: "array",
                              });
                              const syllabusJSON = {};
                              workbook.SheetNames.forEach((sheetName) => {
                                const sheet = workbook.Sheets[sheetName];
                                const jsonData = XLSX.utils.sheet_to_json(
                                  sheet,
                                  { defval: "" }
                                );
                                syllabusJSON[sheetName] = jsonData;
                              });
                              setFormData((prev) => ({
                                ...prev,
                                syllabus: {
                                  name: file.name,
                                  content: syllabusJSON,
                                },
                              }));
                            };
                            reader.readAsArrayBuffer(file);
                          }}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-8">
                {/* Subjects */}
                <div className="group">
                  <label
                    htmlFor="name"
                    className={`flex items-center gap-2 ${
                      theme === "light" ? "text-gray-700" : "text-indigo-100"
                    }  font-bold mb-3 text-lg`}
                  >
                    {/* <BookOpen className="w-5 h-5 text-indigo-600" /> */}
                    Subjects <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      id="subjects"
                      name="subjects"
                      className={inputCommon}
                      placeholder="Enter subject name"
                       onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault(); // Prevents form submission if inside a form
                          addSubject();       // Calls your existing function
                        }
                      }}

                    />
                    <button
                      onClick={addSubject}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-6 flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-xl font-bold"
                    >
                      {/* <PlusCircle size={20} /> */}
                      <span>Add</span>
                    </button>
                  </div>

                  {/* Subject Tags */}
                  {formData.subjects?.length > 0 && (
                    <div className="mt-6">
                      <div className="text-sm font-bold text-gray-600 mb-3 uppercase tracking-wide">
                        Added subjects:
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {formData.subjects.map((subject, idx) => (
                          <div
                            key={idx}
                            className="group flex items-center gap-3 bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 rounded-2xl px-5 py-3 transition-all duration-300 hover:from-indigo-200 hover:to-indigo-300 hover:scale-105 shadow-md"
                          >
                            <span className="font-bold">{subject}</span>
                            <button
                              onClick={() => deleteSubject(idx)}
                              className={`w-full p-4 ${
                                theme === "light"
                                  ? "border-2 border-gray-200 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300  bg-gray-50 group-hover:bg-white"
                                  : "border-2 border-indigo-400 transition-all duration-300  bg-indigo-100 group-hover:bg-indigo-50 text-gray-800"
                              } rounded-2xl  text-lg font-medium`}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Faculties */}
                <div className="group">
                  <label
                    htmlFor="name"
                    className={`flex items-center gap-2 ${
                      theme === "light" ? "text-gray-700" : "text-indigo-100"
                    }  font-bold mb-3 text-lg`}
                  >
                    {/* <Users className="w-5 h-5 text-indigo-600" /> */}
                    Faculties <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      {/* <Users size={20} className="text-gray-500" /> */}
                    </div>
                    <select
                      id="faculties"
                      name="faculties"
                      className={inputCommon}
                      onChange={handleFacultySelect}
                    >
                      <option value="">Select faculty member</option>
                      {faculty.map((user, idx) => (
                        <option key={idx} value={user._id}>
                          {user.name} -{" "}
                          {roleMap[user.roleId]?.name || "Unknown Role"}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Faculty Tags */}
                  {selectedFaculties.length > 0 && (
                    <div className="mt-6">
                      <div className="text-sm font-bold text-gray-600 mb-3 uppercase tracking-wide">
                        Selected faculty members:
                      </div>
                      <div className="space-y-3">
                        {selectedFaculties.map((user, idx) => (
                          <div
                            key={idx}
                            className="group flex items-center justify-between bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 rounded-2xl p-4 transition-all duration-300 hover:from-purple-200 hover:to-purple-300 hover:scale-102 shadow-md"
                          >
                            <div className="flex-1">
                              <div className="font-bold text-lg">
                                {user.name}
                              </div>
                              <div className="text-sm text-purple-600">
                                {user.email}
                              </div>
                              <div className="text-xs text-purple-500 bg-white/50 inline-block px-2 py-1 rounded-full mt-1">
                                {roleMap[user.roleId]?.name || "Unknown Role"} -{" "}
                                {roleMap[user.roleId]?.description || ""}
                              </div>
                            </div>
                            <button
                              onClick={() => handleFacultyRemove(user._id)}
                              className="text-purple-700 hover:text-purple-900 transition-all duration-300 hover:rotate-90 bg-white/50 rounded-full p-2 ml-3"
                            >
                              {/* <X size={18} /> */}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="p-8 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={canAccessPage === false || Available_limit <= 0}
              className={`group text-white px-12 py-4 rounded-3xl flex items-center gap-3 font-bold text-lg transition-all duration-300 transform
              ${
                canAccessPage === false || Available_limit <= 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-green-600 hover:scale-105 hover:shadow-2xl"
              }
                `}
            >
              {/* <CheckCircle size={24} className={`${canAccessPage !== false && Available_limit > 0 ? 'group-hover:animate-pulse' : ''}`} /> */}
              <span
                className={`${
                  !canAccessPage || Available_limit <= 0 ? "opacity-50" : ""
                }`}
              >
                {canAccessPage === false
                  ? "Access Denied"
                  : Available_limit <= 0
                  ? "Limit Reached"
                  : "Create Batch"}
              </span>
            </button>
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default CreateBatch;
