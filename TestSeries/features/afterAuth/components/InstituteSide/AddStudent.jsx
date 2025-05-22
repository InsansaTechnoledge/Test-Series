import  { useState } from 'react'
import HeadingUtil from '../../utility/HeadingUtil'
import { generatePassword } from '../../utility/GenerateRandomPassword'
import * as XLSX from 'xlsx'
import { addSingleStudent , uploadStudentExcel } from '../../../../utils/services/studentService'
import { useCachedBatches } from '../../../../hooks/useCachedBatches'
import { RefreshCcw, Upload, Download, Plus, Trash2, Eye, EyeOff, Users, FileSpreadsheet, CheckCircle } from 'lucide-react'
import NeedHelpComponent from './components/NeedHelpComponent'


const AddStudent = () => {
  const [batch, setBatch] = useState('')
  const [students, setStudents] = useState([getEmptyStudent()])
  const [showPassword, setShowPassword] = useState({})
  const [excelData, setExcelData] = useState([])
  const [activeTab, setActiveTab] = useState('manual') // 'manual' or 'bulk'
  const {batches,isLoading}=useCachedBatches();
  const [errors, setErrors] = useState([])

  // Generate empty student object
  function getEmptyStudent() {
    return {
      fname: '',
      lname: '',
      number: '',
      email: '',
      password:'',
      cpassword:'',
      pnumber: '',
      pemail: '',
      gender: ''
    }
  }

  const validateField = (name, value,index) => {
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
        return '';
      case 'cpassword':
        return value === students[index]?.password ? '' : 'Passwords do not match';
      case 'number' :
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

  const errorMessage = validateField(field, value,index);
  const updatedErrors = [...errors];
  updatedErrors[index] = {
    ...updatedErrors[index],
    [field]: errorMessage
  };
  setErrors(updatedErrors);
};

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


      // Reset the form after submission
      }
  
      if (activeTab === 'bulk') {
        if (!excelData.length) return alert('No Excel data to upload');
  
        // You'll need to keep track of the uploaded file
        const fileInput = document.getElementById('excel-upload');
        if (!fileInput.files[0]) return alert('No file selected');
  
        const res = await uploadStudentExcel(fileInput.files[0]);
        alert('Excel uploaded successfully!');
        console.log(res);

      }
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Something went wrong during submission');
    }
  };

  // Help content
  const question = "How to add multiple students?"
  const answer = "You can add students one by one using the manual entry form or upload an Excel file with multiple students at once."

  return (
    <div className="min-h-screenp-4 md:p-6">
      {/* Header Section */}

      <HeadingUtil heading="Add students" description="In add student section , you can create students and assign them to batches"/>
      <div className="max-w-6xl mx-auto">
        <NeedHelpComponent heading="Adding Students ?" about="create students in one/many/bulk" question={question} answer={answer}/>

        {/* Batch Selection */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <span className="text-gray-700 font-medium whitespace-nowrap">Select Batch</span>
            <select 
              onChange={(e) => setBatch(e.target.value)}
              className="flex-grow bg-white border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="">Select a batch</option>
              {batches.map((batch, idx) => (
                <option key={idx} value={batch.id}>{batch.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Tab Selection */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="grid grid-cols-2 border-b">
            <button 
              className={`flex items-center justify-center gap-2 py-4 font-medium ${activeTab === 'manual' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('manual')}
            >
              <Users size={20} />
              <span>Manual Entry</span>
            </button>
            <button 
              className={`flex items-center justify-center gap-2 py-4 font-medium ${activeTab === 'bulk' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}
              onClick={() => setActiveTab('bulk')}
            >
              <FileSpreadsheet size={20} />
              <span>Bulk Upload</span>
            </button>
          </div>

          {/* Manual Entry Form */}
          {activeTab === 'manual' && (
            <div className="p-6">
              {students.map((student, index) => (
                <div key={index} className="mb-8 border-b border-gray-200 pb-8 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">Student Details</h3>
                    </div>
                    {students.length > 1 && (
                      <button 
                        onClick={() => removeStudentForm(index)}
                        className="text-red-500 hover:text-red-700 flex items-center gap-1.5 text-sm font-medium"
                      >
                        <Trash2 size={16} />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                  
                  {/* Personal Info */}
                  <div className="mb-6">
                    <h4 className="text-sm text-gray-500 uppercase tracking-wider mb-3">Personal Information</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">First Name<span className="text-red-600">*</span></label>
                        <input 
                          type="text"
                          value={student.fname}
                          onChange={(e) => handleStudentChange(index, 'fname', e.target.value)}
                          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter first name"
                        />
                        {errors[index]?.fname && <p className="text-red-500">{errors[index].fname}</p>}

                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Last Name<span className="text-red-600">*</span></label>
                        <input 
                          type="text"
                          value={student.lname}
                          onChange={(e) => handleStudentChange(index, 'lname', e.target.value)}
                          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter last name"
                        />
                             {errors[index]?.lname && <p className="text-red-500">{errors[index].lname}</p>}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Gender<span className="text-red-600">*</span></label>
                        <select 
                          value={student.gender}
                          onChange={(e) => handleStudentChange(index, 'gender', e.target.value)}
                          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                             {errors[index]?.gender && <p className="text-red-500">{errors[index].gender}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="mb-6">
                    <h4 className="text-sm text-gray-500 uppercase tracking-wider mb-3">Contact Information</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Phone Number<span className="text-red-600">*</span></label>
                        <input 
                          type="tel"
                          value={student.number}
                          onChange={(e) => handleStudentChange(index, 'number', e.target.value)}
                          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter phone number"
                        />
                             {errors[index]?.number && <p className="text-red-500">{errors[index].number}</p>}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Email<span className="text-red-600">*</span></label>
                        <input 
                          type="email"
                          value={student.email}
                          onChange={(e) => handleStudentChange(index, 'email', e.target.value)}
                          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter email"
                        />
                             {errors[index]?.email && <p className="text-red-500">{errors[index].email}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Account Info */}
                  <div className="mb-6">
                    <h4 className="text-sm text-gray-500 uppercase tracking-wider mb-3">Account Information</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Password<span className="text-red-600">*</span></label>
                        <div className="flex gap-2">
                          <div className="relative flex-grow">
                            <input
                              type={showPassword[`${index}-password`] ? 'text' : 'password'}
                              value={student.password}
                              onChange={(e) => handleStudentChange(index, 'password', e.target.value)}
                              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full pr-10"
                              placeholder="Enter password"
                            />
                                 {errors[index]?.password && <p className="text-red-500">{errors[index].password}</p>}
                            <div
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                              onClick={() => togglePasswordVisibility(index, 'password')}
                            >
                              {showPassword[`${index}-password`] ? <EyeOff size={20} /> : <Eye size={20} />}
                            </div>
                          </div>

                          <button
                            onClick={() => generateRandomPasswordForStudent(index)}
                            className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg flex items-center justify-center transition"
                            title="Generate random password"
                          >
                            <RefreshCcw size={18} />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Confirm Password<span className="text-red-600">*</span></label>
                        <div className="relative w-full">
                          <input
                            type={showPassword[`${index}-cpassword`] ? 'text' : 'password'}
                            value={student.cpassword}
                            onChange={(e) => handleStudentChange(index, 'cpassword', e.target.value)}
                            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full pr-10"
                            placeholder="Confirm password"
                          />
                               {errors[index]?.cpassword && <p className="text-red-500">{errors[index].cpassword}</p>}
                          <div
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                            onClick={() => togglePasswordVisibility(index, 'cpassword')}
                          >
                            {showPassword[`${index}-cpassword`] ? <EyeOff size={20} /> : <Eye size={20} />}
                          </div>
                        </div>
                        
                      </div>
                    </div>
                  </div>

                  {/* Parent Info */}
                  <div>
                    <h4 className="text-sm text-gray-500 uppercase tracking-wider mb-3">Parent Information</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Parent's Phone Number<span className="text-red-600">*</span></label>
                        <input 
                          type="tel"
                          value={student.pnumber}
                          onChange={(e) => handleStudentChange(index, 'pnumber', e.target.value)}
                          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter parent's phone number"
                        />
                         {errors[index]?.pnumber && <p className="text-red-500">{errors[index].pnumber}</p>}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Parent's Email<span className="text-red-600">*</span></label>
                        <input 
                          type="email"
                          value={student.pemail}
                          onChange={(e) => handleStudentChange(index, 'pemail', e.target.value)}
                          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter parent's email"
                        />
                         {errors[index]?.pemail && <p className="text-red-500">{errors[index].pemail}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Add Another Button */}
              <div className="flex justify-center mt-6">
                <button 
                  onClick={addStudentForm}
                  className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg py-2.5 px-4 flex items-center gap-2 transition font-medium"
                >
                  <Plus size={18} />
                  Add Another Student
                </button>
              </div>
            </div>
          )}

          {/* Bulk Upload */}
          {activeTab === 'bulk' && (
            <div className="p-6">
              <div className="flex flex-col gap-6">
                {/* Template Download */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <button 
                      onClick={downloadExcelTemplate}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg flex items-center gap-2 whitespace-nowrap transition"
                    >
                      <Download size={18} /> 
                      Download Template
                    </button>
                    <p className="text-gray-700">Download and fill out this template for bulk student uploads</p>
                  </div>
                </div>
                
                {/* File Upload Area */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="max-w-xl mx-auto">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Upload Student Data</h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                      <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="excel-upload"
                      />
                      <label 
                        htmlFor="excel-upload" 
                        className="flex flex-col items-center gap-3 cursor-pointer"
                      >
                        <div className="bg-blue-100 rounded-full p-3">
                          <Upload size={26} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-gray-800">Click to upload Excel file</p>
                          <p className="text-sm text-gray-500 mt-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Supported formats: .xlsx, .xls</p>
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Preview Section */}
                {excelData.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-800">Preview</h3>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                        {excelData.length} students
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-3 text-left text-gray-700 font-medium">First Name</th>
                            <th className="px-4 py-3 text-left text-gray-700 font-medium">Last Name</th>
                            <th className="px-4 py-3 text-left text-gray-700 font-medium">Email</th>
                            <th className="px-4 py-3 text-left text-gray-700 font-medium">Phone</th>
                            <th className="px-4 py-3 text-left text-gray-700 font-medium">Gender</th>
                          </tr>
                        </thead>
                        <tbody>
                          {excelData.map((student, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="px-4 py-3 border-t border-gray-200">{student.fname}</td>
                              <td className="px-4 py-3 border-t border-gray-200">{student.lname}</td>
                              <td className="px-4 py-3 border-t border-gray-200">{student.email}</td>
                              <td className="px-4 py-3 border-t border-gray-200">{student.number}</td>
                              <td className="px-4 py-3 border-t border-gray-200">{student.gender}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button 
            onClick={handleSubmit}
            disabled={
              !batch || 
              (activeTab === 'manual' && students.some(s => !s.fname || !s.lname || !s.email)) ||
              (activeTab === 'bulk' && excelData.length === 0)
            }
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-8 rounded-lg font-medium text-base shadow-sm transition min-w-[200px]"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddStudent