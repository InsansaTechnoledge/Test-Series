import { useState, useMemo, useCallback, useEffect } from 'react'
import { generatePassword } from '../../utility/GenerateRandomPassword'
import * as XLSX from 'xlsx'
import { addSingleStudent, fetchStudents, updateStudentsBatch, uploadStudentExcel } from '../../../../utils/services/studentService'
import { useCachedBatches } from '../../../../hooks/useCachedBatches'
import { RefreshCcw, Upload, Download, Plus, Trash2, Eye, EyeOff, Users, FileSpreadsheet, CheckCircle, FileDown, Sparkles, Zap, Target, AlertTriangle } from 'lucide-react'
import NeedHelpComponent from './components/NeedHelpComponent'
import { QueryClient } from '@tanstack/react-query'
import { useUser } from '../../../../contexts/currentUserContext'
import Banner from "../../../../assests/Institute/add student.svg"
import { usePageAccess } from '../../../../contexts/PageAccessContext'
import useLimitAccess from '../../../../hooks/useLimitAccess'
import { useLocation } from 'react-router-dom'
import { useCachedOrganization } from '../../../../hooks/useCachedOrganization'
import { useTheme } from '../../../../hooks/useTheme'

const AddStudent = () => {
  const { user, getFeatureKeyFromLocation } = useUser();
  const [batch, setBatch] = useState('')
  const [students, setStudents] = useState([getEmptyStudent()])
  const [showPassword, setShowPassword] = useState({})
  const [excelData, setExcelData] = useState([])
  const [activeTab, setActiveTab] = useState('manual')
  const { batches } = useCachedBatches();
  const [errors, setErrors] = useState([]);
  const queryClient = new QueryClient();
  const [importBatch, setImportBatch] = useState('');
  const [importedStudents, setImportedStudents] = useState([]);
  const location = useLocation();
  const organization = user.role !== 'organization'
    ? useCachedOrganization({ userId: user._id, orgId: user.organizationId._id })?.organization
    : null;

  const canAddMoreStudents = useLimitAccess(getFeatureKeyFromLocation(location.pathname), "totalStudents")

  console.log(batch)

  useEffect(() => {
    // Auto-select batch if there's only one option and no batch is currently selected
    if (batches.length === 1 && !batch) {
      setBatch(batches[0].id);
    }
  }, [batches, batch]);

  // Memoized derived values for limits
  const Total_students = useMemo(() => (
    user?.role === 'organization'
      ? user.metaData?.totalStudents
      : organization?.metaData?.totalStudents 
  ), [user, organization]);

  const Creation_limit = useMemo(() => user?.planFeatures?.student_feature?.value, [user]);
  const Available_limit = useMemo(() => Creation_limit - Total_students, [Creation_limit, Total_students]);
  const canAccessPage = usePageAccess();

  // Memoized limit checks
  const studentLimitExceeded = useMemo(() => {
    if (activeTab === 'manual') return students.length + Total_students > Creation_limit;
    if (activeTab === 'bulk') return excelData.length + Total_students > Creation_limit;
    if (activeTab === 'import') return Total_students > Creation_limit;
    return false;
  }, [activeTab, students.length, excelData.length, Total_students, Creation_limit]);

  const canSubmit = useMemo(() => (
    canAccessPage && !studentLimitExceeded && batch  
  ), [canAccessPage, studentLimitExceeded, batch]);
  

  // Button label logic
  const submitButtonLabel = useMemo(() => {
    if (!canAccessPage) return 'Access Denied';
    if (studentLimitExceeded) return 'Student limit exceeded';
    if (!batch) return 'Select a batch';  
    if (activeTab === 'manual') return 'Add Students';
    if (activeTab === 'bulk') return 'Upload Excel Data';
    if (activeTab === 'import') return 'Import Students';
    return 'Submit';
  }, [canAccessPage, studentLimitExceeded, batch, activeTab]);

  // Error message logic
  const submitError = useMemo(() => {
    if (!canAccessPage) return 'Access denied';
    if (Total_students >= Creation_limit) return 'Limit exceeded';
    return '';
  }, [canAccessPage, Total_students, Creation_limit]);

  // Generate empty student object
  function getEmptyStudent() {
    return {
      fname: '',
      lname: '',
      number: '',
      email: '',
      password: '',
      cpassword: '',
      pnumber: '',
      pemail: '',
      gender: ''
    }
  }

  useEffect(() => {
    setImportedStudents([]);
  }, [importBatch]);

  // Validation logic (unchanged)
  const validateField = (name, value, index, updatedErrors) => {
    switch (name) {
      case 'fname':
      case 'lname':
        return value.length >= 3 && value.length <= 32 ? '' : 'Name must be between 3-32 characters';
      case 'email':
      case 'pemail':
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) &&
          value.length >= 10 && value.length <= 60 ? '' : 'Please enter a valid email address';
      case 'password':
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumbers = /\d/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        const isLongEnough = value.length >= 8;
        if (!isLongEnough || !hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
          return 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
        }
        if (students[index]?.cpassword && value !== students[index]?.cpassword) {
          return 'Passwords do not match';
        }
        updatedErrors[index].cpassword = '';
        return '';
      case 'cpassword':
        if (value === students[index]?.password) {
          updatedErrors[index].password = '';
          return '';
        }
        else {
          return 'Passwords do not match';
        }
      case 'number':
      case 'pnumber':
        return /^(\+\d{1,3}[- ]?)?\d{10}$/.test(value) ? '' : 'Please enter a valid phone number';
      case 'gender':
        return value ? '' : 'Please select the gender';
      default:
        return '';
    }
  };

  // Handlers (useCallback for optimization)
  const handleStudentChange = useCallback((index, field, value) => {
    const updatedStudents = [...students];
    updatedStudents[index] = { ...updatedStudents[index], [field]: value };
    setStudents(updatedStudents);

    const updatedErrors = [...errors];
    const errorMessage = validateField(field, value, index, updatedErrors);
    updatedErrors[index] = {
      ...updatedErrors[index],
      [field]: errorMessage
    };
    setErrors(updatedErrors);
  }, [students, errors]);

  const handleImportedStudents = useCallback(async () => {
    try {
      const response = await fetchStudents(importBatch);
      if (response.status === 200) {
        setImportedStudents(response.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert('Student not found');
      }
      else {
        console.error('Error fetching students:', error);
        alert('Something went wrong while fetching students');
      }
    }
  }, [importBatch]);

  const addStudentForm = useCallback(() => {
    setStudents([...students, getEmptyStudent()])
  }, [students]);

  const removeStudentForm = useCallback((index) => {
    if (students.length > 1) {
      const updatedStudents = students.filter((_, i) => i !== index)
      setStudents(updatedStudents)
    }
  }, [students]);

  const togglePasswordVisibility = useCallback((index, field) => {
    setShowPassword(prev => ({
      ...prev,
      [`${index}-${field}`]: !prev[`${index}-${field}`]
    }))
  }, []);

  const generateRandomPasswordForStudent = useCallback((index) => {
    const password = generatePassword()
    const updatedStudents = [...students]
    updatedStudents[index] = {
      ...updatedStudents[index],
      password,
      cpassword: password
    }
    setStudents(updatedStudents)
  }, [students]);

  const handleFileUpload = useCallback((e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const data = XLSX.utils.sheet_to_json(worksheet)
        const processedData = data.map(item => ({
          fname: item.FirstName || '',
          lname: item.LastName || '',
          number: item.PhoneNumber || '',
          email: item.Email || '',
          password: item.Password || generatePassword(),
          cpassword: item.Password || generatePassword(),
          pnumber: item.ParentPhone || '',
          pemail: item.ParentEmail || '',
          gender: item.Gender || ''
        }));
        setExcelData(processedData);
      } catch (error) {
        console.error('Error parsing Excel file:', error)
        alert('Error parsing Excel file. Please check the format.')
      }
    }
    reader.readAsBinaryString(file)
  }, []);

  const downloadExcelTemplate = useCallback(() => {
    const template = [
      {
        FirstName: 'tanmay',
        LastName: 'seth',
        PhoneNumber: '1234567890',
        Email: 'tanmay@gmail.com',
        Password: 'Tanmay@1234',
        ParentPhone: '0987654321',
        ParentEmail: 'parent@gmail.com',
        Gender: 'Male'
      }
    ]
    const worksheet = XLSX.utils.json_to_sheet(template)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students')
    XLSX.writeFile(workbook, 'example_student_template.xlsx')
  }, []);

  // Submit form data
  const handleSubmit = useCallback(async () => {
    try {
      if (!batch) {
        alert('Please select a batch before submitting.');
        return;
      }
      if (activeTab === 'manual') {
        const preparedStudents = students.map(s => ({
          name: `${s.fname} ${s.lname}`,
          email: s.email,
          password: s.password,
          phone: s.number,
          gender: s.gender || 'Male',
          batchId: batch,
          parentEmail: s.pemail,
          parentPhone: s.pnumber
        }));
        await addSingleStudent(preparedStudents);
        alert('Students added successfully!');
        setStudents([getEmptyStudent()]);
        setErrors('')
        queryClient.invalidateQueries(['Students', user._id])
      }
      if (activeTab === 'bulk') {
        if (!excelData.length) return alert('No Excel data to upload');
        const fileInput = document.getElementById('excel-upload');
        if (!fileInput.files[0]) return alert('No file selected');
        await uploadStudentExcel(fileInput.files[0], batch);
        alert('Excel uploaded successfully!');
      }
      if (activeTab === 'import') {
        if (!importedStudents.length) return alert('No students to import from the selected batch');
        const preparedStudents = importedStudents.map(s => s._id);
        const currentBatchId = batch;
        const previousBatchId = importBatch;
        const response = await updateStudentsBatch({
          studentIds: preparedStudents,
          currentBatchId,
          previousBatchId
        })
        if (response.status === 200) {
          alert('Students imported successfully!');
          setImportedStudents([]);
          setImportBatch('');
        };
        await queryClient.invalidateQueries(['Students', user._id]);
      };
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Something went wrong during submission');
    }
  }, [batch, activeTab, students, excelData, importedStudents, importBatch, user, queryClient]);

  // FAQ
  const question = "How to add multiple students?"
  const answer = "You can add students one by one using the manual entry form or upload an Excel file with multiple students at once."

  const {theme} = useTheme();

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-xl h-80">
        <img src={Banner} alt="Upload Banner" className="absolute  w-full h-full object-cover" />
        <div className={`absolute inset-0 ${
          theme === 'dark' 
            ? 'bg-gray-900/60' 
            : 'bg-black/20'
        }`}></div>
        <div className="absolute "></div>
        <div className="relative z-10 flex items-center justify-center h-full px-6 text-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
              Add Students
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Create students and assign them to batches with our powerful management system
            </p>
            <div>
              <div className="flex items-center justify-center">
                <p className="mt-8 text-indigo-700 bg-indigo-50 border border-indigo-100 px-5 py-4 rounded-2xl text-base flex items-center gap-3 shadow-sm backdrop-blur-sm">
                  <AlertTriangle className="w-5 h-5 text-indigo-400" />
                  <span>
                    <span className="font-semibold">Note:</span> For your current plan, you have an available limit of
                    <span className={`font-bold ${Available_limit > 0 ? "text-green-600" : "text-red-600"} mx-1`}>
                      {Available_limit}
                    </span>
                    Students
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        {/* Help Component */}
        <div className="mb-8">
          <NeedHelpComponent
            heading="Adding Students ?"
            about="create students in one/many/bulk"
            question={question}
            answer={answer}
          />
          {!canAddMoreStudents && (
           <p className={`mt-4 text-center ${theme === 'light' ? 'bg-red-100 border text-red-600 border-red-200' : 'bg-red-600 text-gray-100'} text-sm  px-4 py-2 rounded-xl shadow-sm backdrop-blur-sm`}>
              You've reached your batch creation limit. <br className="sm:hidden" />
              <span className="font-medium">Upgrade your plan</span> to continue.
            </p>
          )}
        </div>
        {/* Batch Selection Card */}  
        <div className={` ${theme === 'light' ? 'border border-gray-100' : 'bg-gray-800'} rounded-3xl shadow-xl p-8 mb-8 `}>
          <div className="flex items-center space-x-4 mb-6">
            <div className={`${theme === 'light' ? 'bg-indigo-100' : 'bg-indigo-500'} p-3 rounded-2xl`}></div>
            <h2 className={` ${theme === 'light' ? ' text-gray-800' : 'text-indigo-100'} text-2xl font-black`}>Select Target Batch</h2>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <span className={` ${theme === 'light' ? 'text-gray-700' : 'text-indigo-100'} font-bold whitespace-nowrap text-lg`}>Batch</span>
            <select
              onChange={(e) => setBatch(e.target.value)}
              className={`flex-grow rounded-2xl px-6 py-4 font-medium text-lg duration-300
                ${theme === 'light' 
                  ? 'bg-gray-50 text-gray-800 border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400' 
                  : 'bg-gray-700 text-indigo-100 border border-gray-600 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-500'}
              `}
            >
              <option value="" disabled className="text-gray-400">Select a batch</option>
              {batches.map((batch, idx) => (
                <option key={idx} value={batch.id} className={theme === 'light' ? 'text-gray-800' : 'text-indigo-100'}>
                  {batch.name}
                </option>
              ))}
            </select>

          </div>
        </div>
        {/* Tab Selection */}
        <div className={`${theme === 'light' ? 'border-gray-100' : 'bg-gray-800'} rounded-3xl shadow-xl overflow-hidden mb-8 border `}>
          <div className={`grid grid-cols-3 border-b-2 ${theme === 'light' ? 'border-gray-100' : 'border-indigo-100'} `}>
          <button
            className={`flex items-center justify-center gap-3 py-6 font-bold text-lg transition-all duration-300
               ${activeTab === 'manual'
                ? (theme === 'light'
                    ? 'text-indigo-600 border-b-4 border-indigo-600 bg-indigo-50'
                    : 'text-gray-900 border-b-4 border-indigo-400 bg-indigo-400')
                : (theme === 'light'
                    ? 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white')}
            `}
            onClick={() => setActiveTab('manual')}
          >
            <Users size={24} />
            <span>Manual Entry</span>
          </button>
            <button
              className={`flex items-center justify-center gap-3 py-6 font-bold text-lg transition-all duration-300
                ${activeTab === 'bulk'
                 ? (theme === 'light'
                     ? 'text-indigo-600 border-b-4 border-indigo-600 bg-indigo-50'
                     : 'text-gray-900 border-b-4 border-indigo-400 bg-indigo-400')
                 : (theme === 'light'
                     ? 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                     : 'text-gray-400 hover:bg-gray-800 hover:text-white')}
             `}
              onClick={() => setActiveTab('bulk')}
            >
              <FileSpreadsheet size={24} />
              <span>Bulk Upload</span>
            </button>
            <button
              className={`flex items-center justify-center gap-3 py-6 font-bold text-lg transition-all duration-300
                ${activeTab === 'import'
                 ? (theme === 'light'
                     ? 'text-indigo-600 border-b-4 border-indigo-600 bg-indigo-50'
                     : 'text-gray-900 border-b-4 border-indigo-400 bg-indigo-400')
                 : (theme === 'light'
                     ? 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                     : 'text-gray-400 hover:bg-gray-800 hover:text-white')}
             `}
              onClick={() => setActiveTab('import')}
            >
              <FileDown size={24} />
              <span>Import from Batch</span>
            </button>
          </div>


          {/* Manual Entry Form */}
          {activeTab === 'manual' && (
              <div className="p-8">
                {students.map((student, index) => (
                  <div
                    key={index}
                    className={`mb-12 rounded-3xl p-8 shadow-lg ${
                      theme === 'light'
                        ? 'bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100'
                        : 'bg-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center gap-4">
                        <div
                          className={`rounded-full w-12 h-12 flex items-center justify-center font-black text-lg ${
                            theme === 'light' ? 'bg-indigo-600 text-white' : 'bg-indigo-400 text-white'
                          }`}
                        >
                          {index + 1}
                        </div>
                        <h3 className={`text-2xl font-black ${theme === 'light' ? 'text-gray-800' : 'text-indigo-100'}`}>
                          Student Details
                        </h3>
                      </div>
                      {students.length > 1 && (
                        <button
                          onClick={() => removeStudentForm(index)}
                          className={`flex items-center gap-2 text-lg font-bold px-4 py-2 rounded-2xl transition-all duration-300
                            ${
                              theme === 'light'
                                ? 'text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100'
                                : 'text-red-100 hover:text-red-200 bg-red-600 hover:bg-red-700'
                            }`}
                        >
                          <Trash2 size={20} />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    {/* === Section Block Template === */}
                    {[
                      { title: 'Personal Information', fields: ['fname', 'lname', 'gender'] },
                      { title: 'Contact Information', fields: ['number', 'email'] },
                      { title: 'Account Information', fields: ['password', 'cpassword'] },
                      { title: 'Parent Information', fields: ['pnumber', 'pemail'] },
                    ].map((section, secIdx) => (
                      <div className="mb-8" key={secIdx}>
                        <div className="flex items-center gap-3 mb-6">
                          <h4
                            className={`text-lg font-black uppercase tracking-wider ${
                              theme === 'light' ? 'text-gray-700' : 'text-indigo-100'
                            }`}
                          >
                            {section.title}
                          </h4>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                          {section.fields.map((field) => {
                            const label =
                              field === 'fname'
                                ? "First Name"
                                : field === 'lname'
                                ? "Last Name"
                                : field === 'gender'
                                ? "Gender"
                                : field === 'number'
                                ? "Phone Number"
                                : field === 'email'
                                ? "Email"
                                : field === 'password'
                                ? "Password"
                                : field === 'cpassword'
                                ? "Confirm Password"
                                : field === 'pnumber'
                                ? "Parent's Phone Number"
                                : "Parent's Email";

                            const isPassword = field === 'password' || field === 'cpassword';

                            const inputCommon = `p-4 rounded-2xl transition-all duration-300 text-lg w-full pr-14 ${
                              theme === 'light'
                                ? 'bg-white text-gray-900 border-2 border-gray-200 focus:ring-indigo-200 focus:border-indigo-400 placeholder-gray-400'
                                : 'bg-gray-800 text-indigo-100 border-2 border-gray-600 focus:ring-indigo-500 focus:border-indigo-300 placeholder-indigo-300'
                            }`;

                            return (
                              <div className="flex flex-col gap-3" key={field}>
                                <label
                                  className={`text-lg font-bold ${
                                    theme === 'light' ? 'text-gray-700' : 'text-indigo-200'
                                  }`}
                                >
                                  {label} <span className="text-red-600">*</span>
                                </label>

                                {field === 'gender' ? (
                                  <select
                                    value={student.gender}
                                    onChange={(e) => handleStudentChange(index, 'gender', e.target.value)}
                                    className={inputCommon}
                                  >
                                    <option value="">Select gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                  </select>
                                ) : isPassword ? (
                                  <div className="relative w-full flex gap-3">
                                    <div className="relative flex-grow">
                                      <input
                                        type={showPassword[`${index}-${field}`] ? 'text' : 'password'}
                                        value={student[field]}
                                        onChange={(e) => handleStudentChange(index, field, e.target.value)}
                                        className={inputCommon}
                                        placeholder={`Enter ${label.toLowerCase()}`}
                                      />
                                      <div
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                                        onClick={() => togglePasswordVisibility(index, field)}
                                      >
                                        {showPassword[`${index}-${field}`] ? <EyeOff size={24} /> : <Eye size={24} />}
                                      </div>
                                    </div>
                                    {field === 'password' && (
                                      <button
                                        onClick={() => generateRandomPasswordForStudent(index)}
                                        className="bg-gradient-to-r from-indigo-100 to-purple-100 hover:from-indigo-200 hover:to-purple-200 p-4 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-105"
                                        title="Generate random password"
                                      >
                                        <RefreshCcw size={22} />
                                      </button>
                                    )}
                                  </div>
                                ) : (
                                  <input
                                    type={field.includes('email') ? 'email' : field.includes('number') ? 'tel' : 'text'}
                                    value={student[field]}
                                    onChange={(e) => handleStudentChange(index, field, e.target.value)}
                                    className={inputCommon}
                                    placeholder={`Enter ${label.toLowerCase()}`}
                                  />
                                )}
                                {errors[index]?.[field] && (
                                  <p className="text-red-500 font-medium">{errors[index][field]}</p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}

                {/* Add Another Button */}
                <div className="flex justify-center mt-8">
                  <button
                    onClick={addStudentForm}
                    disabled={studentLimitExceeded || !canAccessPage}
                    className={`rounded-2xl py-4 px-8 flex items-center gap-3 font-bold text-lg transition-all duration-300
                      ${
                        !canAccessPage || studentLimitExceeded
                          ? theme === 'light'
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : theme === 'light'
                          ? 'bg-indigo-600 text-white hover:shadow-2xl hover:scale-105'
                          : 'bg-indigo-500 text-white hover:bg-indigo-600 hover:shadow-indigo-800'
                      }`}
                  >
                    <Plus size={22} />
                    {submitButtonLabel}
                  </button>
                </div>
              </div>
            )}



          {/* Bulk Upload */}
          {activeTab === 'bulk' && (
              <div className="p-8">
                <div className="flex flex-col gap-8">

                  {/* Template Download */}
                  <div className={`rounded-3xl p-8 border-2 ${theme === 'light' 
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100' 
                    : 'bg-gray-700 border-gray-600'}`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                      <button
                        onClick={downloadExcelTemplate}
                        className={`py-4 px-8 rounded-2xl flex items-center gap-3 whitespace-nowrap font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105
                          ${theme === 'light'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                            : 'bg-indigo-400 text-gray-700'}
                        `}
                      >
                        <Download size={22} />
                        Download Template
                      </button>
                      <div>
                        <p className={`text-xl font-bold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                          Start with our template
                        </p>
                        <p className={theme === 'light' ? 'text-gray-600' : 'text-gray-300'}>
                          Download and fill out this template for bulk student uploads
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* File Upload Area */}
                  <div className={`rounded-3xl p-8 shadow-lg border-2 ${theme === 'light' 
                    ? 'bg-white border-gray-200' 
                    : 'bg-gray-800 border-gray-600'}`}>
                    <div className="text-center mb-6">
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <div className={`p-3 rounded-2xl ${theme === 'light' ? 'bg-green-100' : 'bg-green-900'}`}>
                          <Upload className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className={`text-2xl font-black ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                          Upload Excel File
                        </h3>
                      </div>
                      <p className={`text-lg ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                        Select your Excel file to upload student data
                      </p>
                    </div>

                    <div className="flex flex-col items-center gap-6">
                      <input
                        type="file"
                        id="excel-upload"
                        accept=".xlsx,.xls"
                        onChange={handleFileUpload}
                        className={`w-full p-4 text-lg font-medium rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
                          ${theme === 'light'
                            ? 'border-gray-300 hover:border-indigo-400 text-gray-800'
                            : 'border-gray-500 hover:border-indigo-400 text-indigo-100 bg-gray-900'}`}
                      />

                      {excelData.length > 0 && (
                        <div className={`w-full rounded-2xl p-6 border-2 ${theme === 'light'
                          ? 'bg-green-50 border-green-200'
                          : 'bg-green-950 border-green-700'}`}>
                          <div className="flex items-center gap-3 mb-4">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <span className={`text-lg font-bold ${theme === 'light' ? 'text-green-800' : 'text-green-300'}`}>
                              {excelData.length} students loaded successfully!
                            </span>
                          </div>

                          <div className="max-h-60 overflow-y-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className={`border-b ${theme === 'light' ? 'border-green-200' : 'border-green-600'}`}>
                                  <th className={`text-left p-2 font-bold ${theme === 'light' ? 'text-green-800' : 'text-green-300'}`}>Name</th>
                                  <th className={`text-left p-2 font-bold ${theme === 'light' ? 'text-green-800' : 'text-green-300'}`}>Email</th>
                                  <th className={`text-left p-2 font-bold ${theme === 'light' ? 'text-green-800' : 'text-green-300'}`}>Phone</th>
                                  <th className={`text-left p-2 font-bold ${theme === 'light' ? 'text-green-800' : 'text-green-300'}`}>Gender</th>
                                  {(excelData.length + Total_students > Creation_limit) && (
                                    <th className={`text-left p-2 font-bold ${theme === 'light' ? 'text-green-800' : 'text-green-300'}`}>Actions</th>
                                  )}
                                </tr>
                              </thead>
                              <tbody>
                                {excelData.map((student, idx) => (
                                  <tr key={idx} className={`border-b ${theme === 'light' ? 'border-green-100' : 'border-green-700'}`}>
                                    <td className={`p-2 ${theme === 'light' ? 'text-green-700' : 'text-green-200'}`}>{student.fname} {student.lname}</td>
                                    <td className={`p-2 ${theme === 'light' ? 'text-green-700' : 'text-green-200'}`}>{student.email}</td>
                                    <td className={`p-2 ${theme === 'light' ? 'text-green-700' : 'text-green-200'}`}>{student.number}</td>
                                    <td className={`p-2 ${theme === 'light' ? 'text-green-700' : 'text-green-200'}`}>{student.gender}</td>
                                    {(excelData.length + Total_students > Creation_limit) && (
                                      <td className="p-2">
                                        <button
                                          onClick={() => {
                                            const updatedExcelData = excelData.filter((_, i) => i !== idx);
                                            setExcelData(updatedExcelData);
                                          }}
                                        >
                                          <Trash2 className="w-5 h-5 text-red-500 hover:text-red-700 transition-all duration-300" />
                                        </button>
                                      </td>
                                    )}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {(excelData.length + Total_students > Creation_limit) && (
                        <div className={`w-full rounded-2xl p-6 border-2 ${theme === 'light'
                          ? 'bg-red-50 border-red-200'
                          : 'bg-red-900 border-red-600'}`}>
                          <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                            <span className={`text-lg font-bold ${theme === 'light' ? 'text-red-800' : 'text-red-300'}`}>
                              You've reached your limit of {Creation_limit} students. Please upgrade your plan to add more
                            </span>
                          </div>
                          <p className={theme === 'light' ? 'text-red-700' : 'text-red-400'}>
                            You can only add {Creation_limit - Total_students} more students.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

          {/* Import from Batch */}
          {activeTab === 'import' && (
            <div className="p-8">
              <div className="flex flex-col gap-8">

                {/* Batch Selection for Import */}
                <div className={`rounded-3xl p-8 border-2 ${theme === 'light' 
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100' 
                  : 'bg-gray-700 border-gray-600'}`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`${theme === 'light' ? 'bg-blue-100' : 'bg-blue-900'} p-3 rounded-2xl`}>
                      <FileDown className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className={`text-2xl font-black ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                      Import Students from Another Batch
                    </h3>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <span className={`font-bold whitespace-nowrap text-lg ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Source Batch</span>
                    <select
                      value={importBatch}
                      onChange={(e) => setImportBatch(e.target.value)}
                      className={`flex-grow rounded-2xl px-6 py-4 border-2 transition-all duration-300 font-medium text-lg focus:outline-none focus:ring-4
                        ${theme === 'light'
                          ? 'bg-white border-gray-200 text-gray-800 focus:ring-blue-200 focus:border-blue-400'
                          : 'bg-gray-800 border-gray-600 text-indigo-100 placeholder:text-gray-400 focus:ring-indigo-300 focus:border-indigo-500'}
                      `}
                    >
                      <option value="">Select source batch</option>
                      {batches.filter(b => b.id !== batch).map((batch, idx) => (
                        <option key={idx} value={batch.id}>{batch.name}</option>
                      ))}
                    </select>

                    <button
                      onClick={handleImportedStudents}
                      disabled={!importBatch}
                      className={`py-4 px-8 rounded-2xl flex items-center gap-3 whitespace-nowrap font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 disabled:cursor-not-allowed
                        ${!importBatch
                          ? (theme === 'light'
                              ? 'from-gray-400 to-gray-500 text-white bg-gradient-to-r'
                              : 'from-gray-700 to-gray-600 text-gray-300 bg-gradient-to-r')
                          : (theme === 'light'
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                              : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white')}
                      `}
                    >
                      <RefreshCcw size={22} />
                      Load Students
                    </button>
                  </div>
                </div>

                {/* Imported Students Display */}
                {importedStudents.length > 0 && (
                  <div className={`rounded-3xl p-8 shadow-lg border-2 ${theme === 'light'
                    ? 'bg-white border-gray-200'
                    : 'bg-gray-800 border-gray-600'}`}>
                    <div className="flex items-center gap-3 mb-6">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <h3 className={`text-2xl font-black ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                        {importedStudents.length} Students Ready to Import
                      </h3>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      <div className="grid gap-4">
                        {importedStudents.map((student, idx) => (
                          <div key={idx} className={`rounded-2xl p-6 transition-all duration-300 border-2 hover:shadow-lg
                            ${theme === 'light'
                              ? 'bg-gradient-to-r from-gray-50 to-white border-gray-100'
                              : 'bg-gradient-to-r from-gray-700 to-gray-800 border-gray-600'}`}>
                            <div className="grid md:grid-cols-4 gap-4">
                              <div>
                                <span className={`text-sm font-bold uppercase tracking-wide ${theme === 'light' ? 'text-gray-500' : 'text-indigo-300'}`}>Name</span>
                                <p className={`text-lg font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>{student.name}</p>
                              </div>
                              <div>
                                <span className={`text-sm font-bold uppercase tracking-wide ${theme === 'light' ? 'text-gray-500' : 'text-indigo-300'}`}>Email</span>
                                <p className={`text-lg ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{student.email}</p>
                              </div>
                              <div>
                                <span className={`text-sm font-bold uppercase tracking-wide ${theme === 'light' ? 'text-gray-500' : 'text-indigo-300'}`}>Phone</span>
                                <p className={`text-lg ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{student.phone}</p>
                              </div>
                              <div>
                                <span className={`text-sm font-bold uppercase tracking-wide ${theme === 'light' ? 'text-gray-500' : 'text-indigo-300'}`}>Gender</span>
                                <p className={`text-lg ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{student.gender}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
        {/* Submit Button */}
        <div className="text-center mb-12">
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`py-6 px-12 rounded-3xl text-2xl font-black transition-all duration-300 hover:shadow-2xl hover:scale-105 disabled:cursor-not-allowed disabled:transform-none
              ${!canSubmit
                ? (theme === 'light'
                    ? 'bg-gray-300 text-gray-500'
                    : 'bg-gray-700 text-gray-400')
                : (theme === 'light'
                    ? 'text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                    : 'text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700')}
            `}
          >
            {canSubmit ? (
              <span>{submitButtonLabel}</span>
            ) : (
              <span className="text-red-600">{submitButtonLabel}</span>
            )}
          </button>
        </div>

      </div>
    </div>
  )
}

export default AddStudent