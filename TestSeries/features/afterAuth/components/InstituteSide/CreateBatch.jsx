import React, { useEffect, useState } from 'react';
import { X, Upload, CheckCircle, PlusCircle, FileSpreadsheet, Users, Calendar, BookOpen, Zap, Target, Sparkles } from 'lucide-react';
import * as XLSX from 'xlsx';
import NeedHelpComponent from './components/NeedHelpComponent';
import HeadingUtil from '../../utility/HeadingUtil';
import { useCachedUser } from '../../../../hooks/useCachedUser';
import { useCachedRoleGroup } from '../../../../hooks/useCachedRoleGroup';
import { createBatch } from '../../../../utils/services/batchService';
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '../../../../contexts/currentUserContext';
import Banner from "../../../../assests/Institute/create batch.svg"
import { usePageAccess } from '../../../../contexts/PageAccessContext';

const CreateBatch = () => {
  const [formData, setFormData] = useState({ batchMode: 'only-subjects' });
  const [selectedFaculties, setSelectedFaculties] = useState([]);
  const [faculty, setFaculty] = useState([])
  const { users, isLoading } = useCachedUser();
  const { roleMap } = useCachedRoleGroup();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const canAccessPage = usePageAccess();

  useEffect(() => {
    if (users) {
      setFaculty(users);
      setSelectedFaculties([]);
    }
  }, [users]);




  const onChangeHandler = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    if (formData) {
      console.log(formData);
    }
  }, [formData])

  const deleteSubject = (indexToDelete) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((_, index) => index !== indexToDelete)
    }));
  };

  const addSubject = () => {
    const newSubject = document.getElementById('subjects').value.trim().toLowerCase();
    if (!newSubject) return;
    setFormData((prev) => ({
      ...prev,
      subjects: [...(prev.subjects || []), newSubject]
    }));
    document.getElementById('subjects').value = '';
    document.getElementById('subjects').focus();
  };

  const generateExcelTemplate = (subjects) => {
    const workbook = XLSX.utils.book_new();
    subjects.forEach((subject) => {
      const sheetData = [['Chapter Name'], ['Sample Chapter']];
      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, subject);
    });

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'syllabus_template.xlsx';
    link.click();
  };

  const handleFacultySelect = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) return;
    const selectedUser = faculty.find((faculty) => faculty._id === selectedId);
    if (!selectedUser) return;

    setSelectedFaculties((prev) => [...prev, selectedUser]);

    setFaculty((prev) => prev.filter((faculty) => faculty._id !== selectedId));
    e.target.value = '';
  };

  const handleFacultyRemove = (facultyId) => {
    const facultyToRemove = selectedFaculties.find((f) => f._id === facultyId);
    if (!facultyToRemove) return;

    setSelectedFaculties((prev) => prev.filter((f) => f._id !== facultyId));
    setFaculty((prev) => [...prev, facultyToRemove]);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.year || !formData.subjects?.length || !formData.batchMode) {
      alert('Please fill all required fields.');
      return;
    }

    if (formData.batchMode === 'subjects-chapters' && !formData.syllabus?.content) {
      alert('Please upload syllabus Excel file.');
      return;
    }

    let processedSyllabus = null;

    // Convert Excel JSON to { subject: [chapters] }
    if (formData.batchMode === 'subjects-chapters') {
      processedSyllabus = {};
      const raw = formData.syllabus.content;

      for (const subject in raw) {
        const chaptersArray = raw[subject]
          .map(row => row['Chapter Name']?.trim())  // Clean whitespace
          .filter(Boolean);                         // Remove empty/null
        processedSyllabus[subject] = chaptersArray;
      }
    }
    console.log("📊 Processed Syllabus:", processedSyllabus);

    const payload = {
      name: formData.name,
      year: formData.year,
      // batchMode: formData.batchMode,
      subjects: formData.subjects,
      faculties: selectedFaculties.map(f => f._id),
      syllabus: processedSyllabus,
    };

    console.log("✅ Final JSON payload to submit:", payload);
    try {
      const response = await createBatch(payload);
      if (response.status === 200) {
        alert('Batch created successfully!');
        setFormData({ "batchMode": "only-subjects" });
        setSelectedFaculties([]);
        setFaculty(prev => ([...prev, ...selectedFaculties]));

      }
    } catch (error) {

      if (error.response?.status === 400) {
        alert('Batch with this name already exists. Please choose a different name.');
        return;
      } else {
        alert('Failed to create batch. Please try again.');
        console.error('Error creating batch:', error.response);
      }
    }
    finally {
      await queryClient.invalidateQueries(['batches', user._id]);
    }
  };

  const getYearOptions = (past = 5, future = 6) => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: past + future + 1 }, (_, i) => currentYear - past + i);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">

      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 "></div>
        <div className="absolute inset-0 "></div>


        <div
          className="relative z-10 px-6 py-24 text-center bg-cover bg-center bg-no-repeat rounded-xl"
          style={{ backgroundImage: `url(${Banner})` }}
        >
          <div className="inline-flex items-center space-x-3 mb-4">
            <h1 className="text-6xl md:text-7xl font-black text-white tracking-tight">
              Create Batch
            </h1>

          </div>
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-medium">
            Create batch with subjects, faculty, syllabus.
          </p>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-xl border-l-4 border-indigo-600 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Batch Type</p>
                <p className="text-2xl font-black text-indigo-600 capitalize">{formData.batchMode?.replace('-', ' ')}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-2xl">
                {/* <Target className="w-8 h-8 text-indigo-600" /> */}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-xl border-l-4 border-gray-600 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Subjects Added</p>
                <p className="text-4xl font-black text-gray-600">{formData.subjects?.length || 0}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-2xl">
                {/* <BookOpen className="w-8 h-8 text-gray-600" /> */}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-xl border-l-4 border-indigo-600 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Faculty Selected</p>
                <p className="text-4xl font-black text-indigo-600">{selectedFaculties.length}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-2xl">
                {/* <Users className="w-8 h-8 text-indigo-600" /> */}
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

        {/* Main Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">

          {/* Batch Type Selection */}
          <div className="p-8 bg-gradient-to-r from-indigo-600 to-gray-600 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-6 flex items-center space-x-3">
                <Target className="w-8 h-8" />
                <span>Select Batch Type</span>
              </h2>
              <div className="flex gap-6">
                <label className="group flex items-center gap-3 cursor-pointer bg-white/20 backdrop-blur-sm px-6 py-4 rounded-2xl hover:bg-white/30 transition-all duration-300 hover:scale-105">
                  <input
                    type="radio"
                    name="batchMode"
                    value="only-subjects"
                    defaultChecked
                    onChange={(e) => onChangeHandler('batchMode', e.target.value)}
                    checked={formData.batchMode === 'only-subjects'}
                    className="w-5 h-5 accent-white"
                  />
                  <span className="text-lg font-bold">Only Subjects</span>
                  <BookOpen className="w-5 h-5 group-hover:animate-pulse" />
                </label>
                <label className="group flex items-center gap-3 cursor-pointer bg-white/20 backdrop-blur-sm px-6 py-4 rounded-2xl hover:bg-white/30 transition-all duration-300 hover:scale-105">
                  <input
                    type="radio"
                    name="batchMode"
                    value="subjects-chapters"
                    onChange={(e) => onChangeHandler('batchMode', e.target.value)}
                    checked={formData.batchMode === 'subjects-chapters'}
                    className="w-5 h-5 accent-white"
                  />
                  <span className="text-lg font-bold">Subjects & Chapters</span>
                  <FileSpreadsheet className="w-5 h-5 group-hover:animate-pulse" />
                </label>
              </div>
            </div>
          </div>

          {/* Excel Download Section */}
          {formData.batchMode === 'subjects-chapters' && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-indigo-100 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4 text-indigo-800">
                  <div className="bg-indigo-100 p-3 rounded-2xl">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Excel Template Required</h3>
                    <p className="text-indigo-600">Download the template, fill it with chapter information, and upload it back</p>
                  </div>
                </div>
                <button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 hover:scale-105 hover:shadow-xl font-bold"
                  onClick={() => {
                    if (formData.subjects?.length > 0) {
                      generateExcelTemplate(formData.subjects);
                    } else {
                      alert('Please add subjects first.');
                    }
                  }}
                >
                  <Download size={20} />
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
                  <label htmlFor="name" className="flex items-center gap-2 text-gray-700 font-bold mb-3 text-lg">
                    <Target className="w-5 h-5 text-indigo-600" />
                    Batch Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name?.toLowerCase() || ''}
                    onChange={(e) => onChangeHandler('name', e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 text-lg font-medium bg-gray-50 group-hover:bg-white"
                    placeholder="Enter batch name"
                  />
                </div>

                {/* Year */}
                <div className="group">
                  <label htmlFor="year" className="flex items-center gap-2 text-gray-700 font-bold mb-3 text-lg">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    Academic Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="year"
                    name="year"
                    value={formData.year || ''}
                    onChange={(e) => onChangeHandler('year', parseInt(e.target.value))}
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 text-lg font-medium bg-gray-50 group-hover:bg-white"
                  >
                    <option value="">Select academic year</option>
                    {getYearOptions().map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                {/* Syllabus File Upload */}
                {formData.batchMode === 'subjects-chapters' && (
                  <div className="group">
                    <label className="flex items-center gap-2 text-gray-700 font-bold mb-3 text-lg">
                      <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                      Syllabus File <span className="text-red-500">*</span>
                    </label>
                    <div className="w-full">
                      <label
                        htmlFor="dropzone-file"
                        className={`flex flex-col items-center justify-center w-full h-40 border-3 border-dashed rounded-3xl cursor-pointer transition-all duration-300 ${formData.syllabus?.name
                            ? 'bg-green-50 border-green-300 hover:bg-green-100'
                            : 'bg-gray-50 border-gray-300 hover:bg-gray-100 hover:border-indigo-400'
                          }`}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {formData.syllabus?.name ? (
                            <div className="flex flex-col items-center text-green-600 animate-pulse">
                              <CheckCircle size={48} className="mb-3" />
                              <p className="text-lg font-bold">{formData.syllabus.name}</p>
                              <p className="text-sm text-green-500 mt-2 bg-green-100 px-3 py-1 rounded-full">File uploaded successfully</p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center text-gray-500">
                              <Upload size={40} className="mb-3 animate-bounce" />
                              <p className="text-lg font-bold mb-2">
                                <span className="text-indigo-600">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-sm bg-gray-100 px-3 py-1 rounded-full">Excel files only (.xlsx)</p>
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
                              const workbook = XLSX.read(data, { type: 'array' });
                              const syllabusJSON = {};
                              workbook.SheetNames.forEach((sheetName) => {
                                const sheet = workbook.Sheets[sheetName];
                                const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: '' });
                                syllabusJSON[sheetName] = jsonData;
                              });
                              setFormData((prev) => ({
                                ...prev,
                                syllabus: { name: file.name, content: syllabusJSON }
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
                  <label htmlFor="subjects" className="flex items-center gap-2 text-gray-700 font-bold mb-3 text-lg">
                    <BookOpen className="w-5 h-5 text-indigo-600" />
                    Subjects <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      id="subjects"
                      name="subjects"
                      className="flex-1 p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 text-lg font-medium bg-gray-50 group-hover:bg-white"
                      placeholder="Enter subject name"
                    />
                    <button
                      onClick={addSubject}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-6 flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-xl font-bold"
                    >
                      <PlusCircle size={20} />
                      <span>Add</span>
                    </button>
                  </div>

                  {/* Subject Tags */}
                  {formData.subjects?.length > 0 && (
                    <div className="mt-6">
                      <div className="text-sm font-bold text-gray-600 mb-3 uppercase tracking-wide">Added subjects:</div>
                      <div className="flex flex-wrap gap-3">
                        {formData.subjects.map((subject, idx) => (
                          <div
                            key={idx}
                            className="group flex items-center gap-3 bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-800 rounded-2xl px-5 py-3 transition-all duration-300 hover:from-indigo-200 hover:to-indigo-300 hover:scale-105 shadow-md"
                          >
                            <span className="font-bold">{subject}</span>
                            <button
                              onClick={() => deleteSubject(idx)}
                              className="text-indigo-700 hover:text-indigo-900 transition-all duration-300 hover:rotate-90 bg-white/50 rounded-full p-1"
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
                  <label htmlFor="faculties" className="flex items-center gap-2 text-gray-700 font-bold mb-3 text-lg">
                    <Users className="w-5 h-5 text-indigo-600" />
                    Faculties <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <Users size={20} className="text-gray-500" />
                    </div>
                    <select
                      id="faculties"
                      name="faculties"
                      className="w-full pl-12 p-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 text-lg font-medium bg-gray-50 group-hover:bg-white"
                      onChange={handleFacultySelect}
                    >
                      <option value="">Select faculty member</option>
                      {faculty.map((user, idx) => (
                        <option key={idx} value={user._id}>
                          {user.name} - {roleMap[user.roleId]?.name || 'Unknown Role'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Faculty Tags */}
                  {selectedFaculties.length > 0 && (
                    <div className="mt-6">
                      <div className="text-sm font-bold text-gray-600 mb-3 uppercase tracking-wide">Selected faculty members:</div>
                      <div className="space-y-3">
                        {selectedFaculties.map((user, idx) => (
                          <div
                            key={idx}
                            className="group flex items-center justify-between bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 rounded-2xl p-4 transition-all duration-300 hover:from-purple-200 hover:to-purple-300 hover:scale-102 shadow-md"
                          >
                            <div className="flex-1">
                              <div className="font-bold text-lg">{user.name}</div>
                              <div className="text-sm text-purple-600">{user.email}</div>
                              <div className="text-xs text-purple-500 bg-white/50 inline-block px-2 py-1 rounded-full mt-1">
                                {roleMap[user.roleId]?.name || 'Unknown Role'} - {roleMap[user.roleId]?.description || ''}
                              </div>
                            </div>
                            <button
                              onClick={() => handleFacultyRemove(user._id)}
                              className="text-purple-700 hover:text-purple-900 transition-all duration-300 hover:rotate-90 bg-white/50 rounded-full p-2 ml-3"
                            >
                              <X size={18} />
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
          <div className="p-8 bg-gradient-to-r from-gray-50 to-indigo-50 border-t border-gray-100 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={canAccessPage === false}
              className={`group text-white px-12 py-4 rounded-3xl flex items-center gap-3 font-bold text-lg transition-all duration-300 transform
              ${canAccessPage === false
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-105 hover:shadow-2xl'}
                `}
              >
              {/* <CheckCircle size={24} className={`${canAccessPage !== false ? 'group-hover:animate-pulse' : ''}`} /> */}
              <span className={`${!canAccessPage && "text-red-600 "}`}>{canAccessPage === false ? 'Access Denied' : 'Create Batch'}</span>
            </button>
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }
        
        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </div>
  );
};

export default CreateBatch;