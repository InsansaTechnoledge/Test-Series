import React, { useEffect, useState } from 'react';
import { X, Upload, CheckCircle, PlusCircle, FileSpreadsheet, Users } from 'lucide-react';
import * as XLSX from 'xlsx';
import NeedHelpComponent from './components/NeedHelpComponent';
import HeadingUtil from '../../utility/HeadingUtil';
import { useCachedUser } from '../../../../hooks/useCachedUser';
import { useCachedRoleGroup } from '../../../../hooks/useCachedRoleGroup';
import { createBatch } from '../../../../utils/services/batchService';
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '../../../../contexts/currentUserContext';

const CreateBatch = () => {
  const [formData, setFormData] = useState({ batchMode: 'only-subjects' });
  const [selectedFaculties, setSelectedFaculties] = useState([]);
  const [faculty, setFaculty] = useState([])
  const { users, isLoading } = useCachedUser();
  const { roleMap } = useCachedRoleGroup();
  const queryClient = useQueryClient();
  const { user } = useUser();

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
    try{
    const response = await createBatch(payload);
    if (response.status === 200) {
      alert('Batch created successfully!');
      setFormData({ "batchMode": "only-subjects" });
      setSelectedFaculties([]);
      setFaculty(prev => ([...prev, ...selectedFaculties]));

    }
   }catch (error) {

      if (error.response?.status === 400) {
        alert('Batch with this name already exists. Please choose a different name.');
        return;
      }else{
      alert('Failed to create batch. Please try again.');
      console.error('Error creating batch:',error.response);}
    }
    finally{
            await queryClient.invalidateQueries(['batches', user._id]);
    }


  };

  const getYearOptions = (past = 5, future = 6) => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: past + future + 1 }, (_, i) => currentYear - past + i);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <HeadingUtil
        heading="Create New Batch"
        description="Set up a new batch with subjects, faculties, and syllabus information for your institute"
      />

      <NeedHelpComponent heading="Creating Batch ?" question="Want to create new Batch" answer="Batches can be created with subjects and with subjects plus chapters , choose as per your requirement" />

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Batch Type Selection */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 text-white">
          <h2 className="text-xl text-gray-800 font-semibold mb-4">Select Batch Type</h2>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer bg-white/20 text-gray-700 px-4 py-2 rounded-lg hover:bg-white/30 transition-all">
              <input
                type="radio"
                name="batchMode"
                value="only-subjects"
                defaultChecked
                onChange={(e) => onChangeHandler('batchMode', e.target.value)}
                checked={formData.batchMode === 'only-subjects'}
                className="accent-black"
              />
              <span>Only Subjects</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-gray-700 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-all">
              <input
                type="radio"
                name="batchMode"
                value="subjects-chapters"
                onChange={(e) => onChangeHandler('batchMode', e.target.value)}
                checked={formData.batchMode === 'subjects-chapters'}
                className="accent-black"
              />
              <span>Subjects & Chapters</span>
            </label>
          </div>
        </div>

        {/* Excel Download Button */}
        {formData.batchMode === 'subjects-chapters' && (
          <div className="bg-blue-50 p-4 border-b border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-800">
              <FileSpreadsheet size={20} />
              <span>Download the Excel template, fill it with your chapter information, and upload it back</span>
            </div>
            <button
              className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
              onClick={() => {
                if (formData.subjects?.length > 0) {
                  generateExcelTemplate(formData.subjects);
                } else {
                  alert('Please add subjects first.');
                }
              }}
            >
              <Download size={16} />
              <span>Download Template</span>
            </button>
          </div>
        )}

        <div className="p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Batch Name */}
              <div>
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                  Batch Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name?.toLowerCase() || ''}
                  onChange={(e) => onChangeHandler('name', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter batch name"
                />
              </div>

              {/* Year */}
              <div>
                <label htmlFor="year" className="block text-gray-700 font-medium mb-2">
                  Academic Year <span className="text-red-500">*</span>
                </label>
                <select
                  id="year"
                  name="year"
                  value={formData.year || ''}
                  onChange={(e) => onChangeHandler('year', parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="">Select academic year</option>
                  {getYearOptions().map((year) => (
                    <option key={year} value={year}>
                      {year}</option>
                  ))}
                </select>
              </div>

              {/* Syllabus File Upload */}
              {formData.batchMode === 'subjects-chapters' && (
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Syllabus File <span className="text-red-500">*</span>
                  </label>
                  <div className="w-full">
                    <label
                      htmlFor="dropzone-file"
                      className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all ${formData.syllabus?.name ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                        }`}
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {formData.syllabus?.name ? (
                          <div className="flex flex-col items-center text-green-600">
                            <CheckCircle size={40} className="mb-2" />
                            <p className="text-sm font-medium">{formData.syllabus.name}</p>
                            <p className="text-xs text-green-500 mt-1">File uploaded successfully</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center text-gray-500">
                            <Upload size={32} className="mb-2" />
                            <p className="text-sm font-medium">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs mt-1">Excel files only (.xlsx)</p>
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
            <div className="space-y-6">
              {/* Subjects */}
              <div>
                <label htmlFor="subjects" className="block text-gray-700 font-medium mb-2">
                  Subjects <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="subjects"
                    name="subjects"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter subject name"
                  />
                  <button
                    onClick={addSubject}
                    className="bg-blue-700 hover:bg-blue-800 text-white rounded-lg px-4 flex items-center gap-1 transition-all"
                  >
                    <PlusCircle size={18} />
                    <span>Add</span>
                  </button>
                </div>

                {/* Subject Tags */}
                {formData.subjects?.length > 0 && (
                  <div className="mt-4">
                    <div className="text-sm text-gray-600 mb-2">Added subjects:</div>
                    <div className="flex flex-wrap gap-2">
                      {formData.subjects.map((subject, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-blue-100 text-blue-800 rounded-full px-4 py-2 transition-all hover:bg-blue-200">
                          <span>{subject}</span>
                          <button
                            onClick={() => deleteSubject(idx)}
                            className="text-blue-700 hover:text-blue-900 transition-all"
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
              <div>
                <label htmlFor="faculties" className="block text-gray-700 font-medium mb-2">
                  Faculties <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Users size={18} className="text-gray-500" />
                  </div>
                  <select
                    id="faculties"
                    name="faculties"
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    onChange={handleFacultySelect}
                  >
                    <option value="">Select faculty member</option>
                    {faculty.map((user, idx) => (
                      <option key={idx} value={user._id}>{user.name} - {roleMap[user.roleId]?.name || 'Unknown Role'}</option>
                    ))}
                  </select>
                </div>

                {/* Faculty Tags */}
                {selectedFaculties.length > 0 && (
                  <div className="mt-4">
                    <div className="text-sm text-gray-600 mb-2">Selected faculty members:</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedFaculties.map((user, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-purple-100 text-purple-800 rounded-full px-4 py-2 transition-all hover:bg-purple-200 w-full">
                          <span>{user.name}- {user.email}- <>
                            <span key={user._id} className="text-sm text-gray-600">
                              {roleMap[user.roleId]?.name || 'Unknown Role'}- {roleMap[user.roleId]?.description || ''}</span></></span>
                          <button
                            onClick={() => handleFacultyRemove(user._id)}
                            className="text-purple-700 hover:text-purple-900 transition-all"
                          >
                            <X size={16} />
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
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 font-medium transition-all"
          >
            <CheckCircle size={18} />
            <span>Create Batch</span>
          </button>
        </div>
      </div>
    </div>
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

export default CreateBatch;