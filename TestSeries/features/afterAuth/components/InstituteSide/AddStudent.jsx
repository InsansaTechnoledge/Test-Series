import { useState } from 'react'
import HeadingUtil from '../../utility/HeadingUtil'
import { generatePassword } from '../../utility/GenerateRandomPassword'
import * as XLSX from 'xlsx'
import { addSingleStudent, fetchStudents, updateStudentsBatch, uploadStudentExcel } from '../../../../utils/services/studentService'
import { useCachedBatches } from '../../../../hooks/useCachedBatches'
import { RefreshCcw, Upload, Download, Plus, Trash2, Eye, EyeOff, Users, FileSpreadsheet, CheckCircle, FileDown, Sparkles, Zap, Target, AlertTriangle } from 'lucide-react'
import NeedHelpComponent from './components/NeedHelpComponent'
import { QueryClient } from '@tanstack/react-query'
import { useUser } from '../../../../contexts/currentUserContext'
import { useEffect } from 'react'
import  Banner from "../../../../assests/Institute/add student.svg"
import { usePageAccess } from '../../../../contexts/PageAccessContext'
import useLimitAccess from '../../../../hooks/useLimitAccess'
import { useLocation } from 'react-router-dom'
import { useCachedOrganization } from '../../../../hooks/useCachedOrganization'
const AddStudent = () => {
  const { user , getFeatureKeyFromLocation } = useUser();
  const [batch, setBatch] = useState('')
  const [students, setStudents] = useState([getEmptyStudent()])
  const [showPassword, setShowPassword] = useState({})
  const [excelData, setExcelData] = useState([])
  const [activeTab, setActiveTab] = useState('manual') // 'manual' or 'bulk'
  const { batches, isLoading } = useCachedBatches();
  const [errors, setErrors] = useState([]);
  const queryClient = new QueryClient();
  const [importBatch, setImportBatch] = useState('');
  const [importedStudents, setImportedStudents] = useState([]);
  const location = useLocation();
  const organization = user.role !== 'organization'
    ? useCachedOrganization({ userId: user._id, orgId: user.organizationId._id })?.organization
    : null;

  const canAddMoreStudents = useLimitAccess(getFeatureKeyFromLocation(location.pathname), "totalStudents")
  
  const Total_students =  user?.role === 'organization' 
    ? user.metaData?.totalBatches 
    :  (    
      organization?.metaData?.totalBatches
    );


  const Creation_limit = user?.planFeatures?.student_feature?.value
  const Available_limit = Creation_limit - Total_students
  console.log(canAddMoreStudents , Total_students , Creation_limit , Available_limit)

  const canAccessPage = usePageAccess();

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
  },[importBatch]);

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
        updatedErrors[index].cpassword='';
        return '';
      case 'cpassword':
        if(value===students[index]?.password){
          updatedErrors[index].password='';
          return '';
        }
        else{
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

  const handleStudentChange = (index, field, value) => {
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
  };

  const handleImportedStudents = async () => {
    try{
    const response = await fetchStudents(importBatch);
    console.log(response);
    if (response.status === 200) {
      console.log(response.data);
      setImportedStudents(response.data);
    }
  }catch(error){
      if(error.response && error.response.status === 404) {
        alert('Student not found');
      }
      else{
        console.error('Error fetching students:', error);
        alert('Something went wrong while fetching students');
      }
  }
  }

  // Add a new student form
  const addStudentForm = () => {
    setStudents([...students, getEmptyStudent()])
  }

  // Remove a student form
  const removeStudentForm = (index) => {
    if (students.length > 1) {
      const updatedStudents = students.filter((_, i) => i !== index)
      setStudents(updatedStudents)
    }
  }

  // Toggle password visibility
  const togglePasswordVisibility = (index, field) => {
    setShowPassword(prev => ({
      ...prev,
      [`${index}-${field}`]: !prev[`${index}-${field}`]
    }))
  }

  // Generate random password for a specific student
  const generateRandomPasswordForStudent = (index) => {
    const password = generatePassword()
    const updatedStudents = [...students]
    updatedStudents[index] = {
      ...updatedStudents[index],
      password,
      cpassword: password
    }
    setStudents(updatedStudents)
  }

  // Handle Excel file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const data = XLSX.utils.sheet_to_json(worksheet)

        // Process the data to match student structure
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
        }))

        setExcelData(processedData)
      } catch (error) {
        console.error('Error parsing Excel file:', error)
        alert('Error parsing Excel file. Please check the format.')
      }
    }
    reader.readAsBinaryString(file)
  }

  // example Excel template
  const downloadExcelTemplate = () => {
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
  }

  // Submit form data
  const handleSubmit = async () => {
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

        const res = await addSingleStudent(preparedStudents);
        alert('Students added successfully!');
        console.log(res);
        setStudents([getEmptyStudent()]);
        setErrors('')
        queryClient.invalidateQueries(['Students', user._id])
      }

      if (activeTab === 'bulk') {
        if (!excelData.length) return alert('No Excel data to upload');

        const fileInput = document.getElementById('excel-upload');
        if (!fileInput.files[0]) return alert('No file selected');
  
        const res = await uploadStudentExcel(fileInput.files[0], batch);
        alert('Excel uploaded successfully!');
        console.log(res);
      }

      if (activeTab === 'import') {
        if(!importedStudents.length) return alert('No students to import from the selected batch');

        const preparedStudents = importedStudents.map(s=>s._id);
        const currentBatchId = batch;
        const previousBatchId = importBatch;
        const response = await updateStudentsBatch({
          studentIds: preparedStudents,
          currentBatchId,
          previousBatchId
        })
        console.log(response);
        if(response.status === 200) {
          alert('Students imported successfully!');
          setImportedStudents([]);
          setImportBatch('');
        };
        await queryClient.invalidateQueries(['Students', user._id]);
      };
    } catch (error) {
      console.error('Submission failed:', error);
      alert( 'Something went wrong during submission');
    }
  };

  const question = "How to add multiple students?"
  const answer = "You can add students one by one using the manual entry form or upload an Excel file with multiple students at once."

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50">

      {/* Hero Header */}
     
      
      <div className="relative overflow-hidden rounded-xl h-80">
   
    <img 
        src={Banner} 
        alt="Upload Banner"
        className="absolute  w-full h-full object-cover"
    />
    
  
    <div className="absolute "></div>
    
    {/* Content */}
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
        </div>

        {/* Batch Selection Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-indigo-100 p-3 rounded-2xl">
              {/* <Target className="w-6 h-6 text-indigo-600" /> */}
            </div>
            <h2 className="text-2xl font-black text-gray-800">Select Target Batch</h2>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <span className="text-gray-700 font-bold whitespace-nowrap text-lg">Batch</span>
            <select
              onChange={(e) => setBatch(e.target.value)}
              className="flex-grow bg-gray-50 border-2 border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 font-medium text-lg"
            >
              <option value="">Select a batch</option>
              {batches.map((batch, idx) => (
                <option key={idx} value={batch.id}>{batch.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-gray-100">
          <div className="grid grid-cols-3 border-b-2 border-gray-100">
            <button
              className={`flex items-center justify-center gap-3 py-6 font-bold text-lg transition-all duration-300 ${
                activeTab === 'manual' 
                  ? 'text-indigo-600 border-b-4 border-indigo-600 bg-indigo-50' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('manual')}
            >
              <Users size={24} />
              <span>Manual Entry</span>
            </button>
            <button
              className={`flex items-center justify-center gap-3 py-6 font-bold text-lg transition-all duration-300 ${
                activeTab === 'bulk' 
                  ? 'text-indigo-600 border-b-4 border-indigo-600 bg-indigo-50' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('bulk')}
            >
              <FileSpreadsheet size={24} />
              <span>Bulk Upload</span>
            </button>
            <button
              className={`flex items-center justify-center gap-3 py-6 font-bold text-lg transition-all duration-300 ${
                activeTab === 'import' 
                  ? 'text-indigo-600 border-b-4 border-indigo-600 bg-indigo-50' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
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
                <div key={index} className="mb-12 border-2 border-gray-100 rounded-3xl p-8 bg-gradient-to-br from-gray-50 to-white shadow-lg">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-black text-lg">
                        {index + 1}
                      </div>
                      <h3 className="text-2xl font-black text-gray-800">Student Details</h3>
                    </div>
                    {students.length > 1 && (
                      <button
                        onClick={() => removeStudentForm(index)}
                        className="text-red-500 hover:text-red-700 flex items-center gap-2 text-lg font-bold bg-red-50 px-4 py-2 rounded-2xl hover:bg-red-100 transition-all duration-300"
                      >
                        <Trash2 size={20} />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>

                  {/* Personal Info */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-blue-100 p-2 rounded-xl">
                        {/* <Sparkles className="w-5 h-5 text-blue-600" /> */}
                      </div>
                      <h4 className="text-lg font-black text-gray-700 uppercase tracking-wider">Personal Information</h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="flex flex-col gap-3">
                        <label className="text-lg font-bold text-gray-700">First Name<span className="text-red-600">*</span></label>
                        <input
                          type="text"
                          value={student.fname}
                          onChange={(e) => handleStudentChange(index, 'fname', e.target.value)}
                          className="p-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 text-lg"
                          placeholder="Enter first name"
                        />
                        {errors[index]?.fname && <p className="text-red-500 font-medium">{errors[index].fname}</p>}
                      </div>

                      <div className="flex flex-col gap-3">
                        <label className="text-lg font-bold text-gray-700">Last Name<span className="text-red-600">*</span></label>
                        <input
                          type="text"
                          value={student.lname}
                          onChange={(e) => handleStudentChange(index, 'lname', e.target.value)}
                          className="p-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 text-lg"
                          placeholder="Enter last name"
                        />
                        {errors[index]?.lname && <p className="text-red-500 font-medium">{errors[index].lname}</p>}
                      </div>

                      <div className="flex flex-col gap-3">
                        <label className="text-lg font-bold text-gray-700">Gender<span className="text-red-600">*</span></label>
                        <select
                          value={student.gender}
                          onChange={(e) => handleStudentChange(index, 'gender', e.target.value)}
                          className="p-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 text-lg"
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors[index]?.gender && <p className="text-red-500 font-medium">{errors[index].gender}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-green-100 p-2 rounded-xl">
                        {/* <Zap className="w-5 h-5 text-green-600" /> */}
                      </div>
                      <h4 className="text-lg font-black text-gray-700 uppercase tracking-wider">Contact Information</h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="flex flex-col gap-3">
                        <label className="text-lg font-bold text-gray-700">Phone Number<span className="text-red-600">*</span></label>
                        <input
                          type="tel"
                          value={student.number}
                          onChange={(e) => handleStudentChange(index, 'number', e.target.value)}
                          className="p-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 text-lg"
                          placeholder="Enter phone number"
                        />
                        {errors[index]?.number && <p className="text-red-500 font-medium">{errors[index].number}</p>}
                      </div>

                      <div className="flex flex-col gap-3">
                        <label className="text-lg font-bold text-gray-700">Email<span className="text-red-600">*</span></label>
                        <input
                          type="email"
                          value={student.email}
                          onChange={(e) => handleStudentChange(index, 'email', e.target.value)}
                          className="p-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 text-lg"
                          placeholder="Enter email"
                        />
                        {errors[index]?.email && <p className="text-red-500 font-medium">{errors[index].email}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-purple-100 p-2 rounded-xl">
                        {/* <Target className="w-5 h-5 text-purple-600" /> */}
                      </div>
                      <h4 className="text-lg font-black text-gray-700 uppercase tracking-wider">Account Information</h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="flex flex-col gap-3">
                        <label className="text-lg font-bold text-gray-700">Password<span className="text-red-600">*</span></label>
                        <div className="flex gap-3">
                          <div className="relative flex-grow">
                            <input
                              type={showPassword[`${index}-password`] ? 'text' : 'password'}
                              value={student.password}
                              onChange={(e) => handleStudentChange(index, 'password', e.target.value)}
                              className="p-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 w-full pr-14 text-lg"
                              placeholder="Enter password"
                            />
                            
                            <div
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                              onClick={() => togglePasswordVisibility(index, 'password')}
                            >
                              {showPassword[`${index}-password`] ? <EyeOff size={24} /> : <Eye size={24} />}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => generateRandomPasswordForStudent(index)}
                            className="bg-gradient-to-r from-indigo-100 to-purple-100 hover:from-indigo-200 hover:to-purple-200 p-4 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-105"
                            title="Generate random password"
                          >
                            <RefreshCcw size={22} />
                          </button>
                        </div>
                        {errors[index]?.password && <p className="text-red-500 font-medium">{errors[index].password}</p>}
                      </div>
                      <div className="flex flex-col gap-3">
                        <label className="text-lg font-bold text-gray-700">Confirm Password<span className="text-red-600">*</span></label>
                        <div className="relative w-full">
                          <input
                            type={showPassword[`${index}-cpassword`] ? 'text' : 'password'}
                            value={student.cpassword}
                            onChange={(e) => handleStudentChange(index, 'cpassword', e.target.value)}
                            className="p-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 w-full pr-14 text-lg"
                            placeholder="Confirm password"
                          />
                          
                          <div
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                            onClick={() => togglePasswordVisibility(index, 'cpassword')}
                          >
                            {showPassword[`${index}-cpassword`] ? <EyeOff size={24} /> : <Eye size={24} />}
                          </div>
                        </div>
                        {errors[index]?.cpassword && <p className="text-red-500 font-medium">{errors[index].cpassword}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Parent Info */}
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-orange-100 p-2 rounded-xl">
                        {/* <Users className="w-5 h-5 text-orange-600" /> */}
                      </div>
                      <h4 className="text-lg font-black text-gray-700 uppercase tracking-wider">Parent Information</h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="flex flex-col gap-3">
                        <label className="text-lg font-bold text-gray-700">Parent's Phone Number<span className="text-red-600">*</span></label>
                        <input
                          type="tel"
                          value={student.pnumber}
                          onChange={(e) => handleStudentChange(index, 'pnumber', e.target.value)}
                          className="p-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 text-lg"
                          placeholder="Enter parent's phone number"
                        />
                        {errors[index]?.pnumber && <p className="text-red-500 font-medium">{errors[index].pnumber}</p>}
                      </div>

                      <div className="flex flex-col gap-3">
                        <label className="text-lg font-bold text-gray-700">Parent's Email<span className="text-red-600">*</span></label>
                        <input
                          type="email"
                          value={student.pemail}
                          onChange={(e) => handleStudentChange(index, 'pemail', e.target.value)}
                          className="p-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300 text-lg"
                          placeholder="Enter parent's email"
                        />
                        {errors[index]?.pemail && <p className="text-red-500 font-medium">{errors[index].pemail}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Another Button */}
              <div className="flex justify-center mt-8">
                <button
                  onClick={addStudentForm}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl py-4 px-8 flex items-center gap-3 transition-all duration-300 hover:shadow-2xl hover:scale-105 font-bold text-lg"
                >
                  <Plus size={22} />
                  Add Another Student
                </button>
              </div>
            </div>
          )}

          {/* Bulk Upload */}
          {activeTab === 'bulk' && (
            <div className="p-8">
              <div className="flex flex-col gap-8">
                {/* Template Download */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-100 rounded-3xl p-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <button
                      onClick={downloadExcelTemplate}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 px-8 rounded-2xl flex items-center gap-3 whitespace-nowrap transition-all duration-300 hover:shadow-2xl hover:scale-105 font-bold text-lg"
                    >
                      <Download size={22} />
                      Download Template
                    </button>
                    <div>
                      <p className="text-xl font-bold text-gray-800 mb-2">Start with our template</p>
                      <p className="text-gray-600">Download and fill out this template for bulk student uploads</p>
                    </div>
                  </div>
                </div>

                {/* File Upload Area */}
               {/* File Upload Area */}
               <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 shadow-lg">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="bg-green-100 p-3 rounded-2xl">
                        <Upload className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-black text-gray-800">Upload Excel File</h3>
                    </div>
                    <p className="text-gray-600 text-lg">Select your Excel file to upload student data</p>
                  </div>
                  
                  <div className="flex flex-col items-center gap-6">
                    <input
                      type="file"
                      id="excel-upload"
                      accept=".xlsx,.xls"
                      onChange={handleFileUpload}
                      className="w-full p-4 border-2 border-dashed border-gray-300 rounded-2xl text-lg font-medium hover:border-indigo-400 transition-all duration-300 cursor-pointer"
                    />
                    
                    {excelData.length > 0 && (
                      <div className="w-full bg-green-50 border-2 border-green-200 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                          <span className="text-lg font-bold text-green-800">
                            {excelData.length} students loaded successfully!
                          </span>
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-green-200">
                                <th className="text-left p-2 font-bold text-green-800">Name</th>
                                <th className="text-left p-2 font-bold text-green-800">Email</th>
                                <th className="text-left p-2 font-bold text-green-800">Phone</th>
                                <th className="text-left p-2 font-bold text-green-800">Gender</th>
                              </tr>
                            </thead>
                            <tbody>
                              {excelData.map((student, idx) => (
                                <tr key={idx} className="border-b border-green-100">
                                  <td className="p-2 text-green-700">{student.fname} {student.lname}</td>
                                  <td className="p-2 text-green-700">{student.email}</td>
                                  <td className="p-2 text-green-700">{student.number}</td>
                                  <td className="p-2 text-green-700">{student.gender}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
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
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-100 rounded-3xl p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-blue-100 p-3 rounded-2xl">
                      <FileDown className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-800">Import Students from Another Batch</h3>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <span className="text-gray-700 font-bold whitespace-nowrap text-lg">Source Batch</span>
                    <select
                      value={importBatch}
                      onChange={(e) => setImportBatch(e.target.value)}
                      className="flex-grow bg-white border-2 border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-300 font-medium text-lg"
                    >
                      <option value="">Select source batch</option>
                      {batches.filter(b => b.id !== batch).map((batch, idx) => (
                        <option key={idx} value={batch.id}>{batch.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleImportedStudents}
                      disabled={!importBatch}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-8 rounded-2xl flex items-center gap-3 whitespace-nowrap transition-all duration-300 hover:shadow-2xl hover:scale-105 font-bold text-lg disabled:cursor-not-allowed"
                    >
                      <RefreshCcw size={22} />
                      Load Students
                    </button>
                  </div>
                </div>

                {/* Imported Students Display */}
                {importedStudents.length > 0 && (
                  <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <h3 className="text-2xl font-black text-gray-800">
                        {importedStudents.length} Students Ready to Import
                      </h3>
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto">
                      <div className="grid gap-4">
                        {importedStudents.map((student, idx) => (
                          <div key={idx} className="bg-gradient-to-r from-gray-50 to-white border-2 border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                            <div className="grid md:grid-cols-4 gap-4">
                              <div>
                                <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">Name</span>
                                <p className="text-lg font-bold text-gray-800">{student.name}</p>
                              </div>
                              <div>
                                <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">Email</span>
                                <p className="text-lg text-gray-700">{student.email}</p>
                              </div>
                              <div>
                                <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">Phone</span>
                                <p className="text-lg text-gray-700">{student.phone}</p>
                              </div>
                              <div>
                                <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">Gender</span>
                                <p className="text-lg text-gray-700">{student.gender}</p>
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
            disabled={!batch || canAccessPage === false || canAddMoreStudents === false}
            className={` text-white py-6 px-12 rounded-3xl text-2xl font-black transition-all duration-300 hover:shadow-2xl hover:scale-105 disabled:cursor-not-allowed disabled:transform-none
              ${canAccessPage === false || canAddMoreStudents === false
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-105 hover:shadow-2xl'}
              `}
          >
          {canAddMoreStudents === false || canAccessPage && activeTab === 'manual' ?(
            <span>Add Students</span>
          ) : <span className='text-red-600'>{canAddMoreStudents ? "Limit exceeded" : "Access denied"}</span>}

          {canAccessPage && activeTab === 'bulk' && (
            <span>Upload Excel Data</span>
          )}

          {canAccessPage && activeTab === 'import' && (
            <span>Import Students</span>
          )}

          </button>
        </div>
      </div>
    </div>
  )
}

export default AddStudent