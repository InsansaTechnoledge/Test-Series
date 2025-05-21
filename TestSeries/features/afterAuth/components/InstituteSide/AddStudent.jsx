import  { useState } from 'react'
import HeadingUtil from '../../utility/HeadingUtil'
import { RefreshCcw, Upload, Download, Plus, Trash2, Eye, EyeOff } from 'lucide-react'
import { generatePassword } from '../../utility/GenerateRandomPassword'
import GuiderComponent from './components/GuiderComponent'
import * as XLSX from 'xlsx'
import { addSingleStudent , uploadStudentExcel } from '../../../../utils/services/studentService'
import { useCachedBatches } from '../../../../hooks/useCachedBatches'

const AddStudent = () => {
  const [batch, setBatch] = useState('')
  const [students, setStudents] = useState([getEmptyStudent()])
  const [showPassword, setShowPassword] = useState({})
  const [excelData, setExcelData] = useState([])
  const [activeTab, setActiveTab] = useState('manual') // 'manual' or 'bulk'
  const {batches,isLoading}=useCachedBatches();

  // Generate empty student object
  function getEmptyStudent() {
    const password = generatePassword()
    return {
      fname: '',
      lname: '',
      number: '',
      email: '',
      password,
      cpassword: password,
      pnumber: '',
      pemail: ''
    }
  }

  // Handle form field changes for each student
  const handleStudentChange = (index, field, value) => {
    const updatedStudents = [...students]
    updatedStudents[index] = { ...updatedStudents[index], [field]: value }
    setStudents(updatedStudents)
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
          pemail: item.ParentEmail || ''
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
          gender: 'Male', 
          batchId: batch, 
          parentEmail: s.pemail,
          parentPhone: s.pnumber
        }));
  
        const res = await addSingleStudent(preparedStudents);
        alert('Students added successfully!');
        console.log(res);
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

  const question = "How to add multiple students?"
  const answer = "You can add students one by one using the manual entry form or upload an Excel file with multiple students at once."

  return (
    <div className='flex flex-col'>
      <div>
        <HeadingUtil heading="Add Students" description="Add new students to any batch" />
        <GuiderComponent question={question} answer={answer} />
      </div>
      
      {/* Batch Selection */}
      <div className='mb-5 flex justify-center items-center gap-4'>
        <p className='font-medium'>Select Batch</p>
        <select 
          onChange={(e) => setBatch(e.target.value)}
          className='bg-gray-200 rounded-md px-4 py-2'
          value={batch}
        >
          <option value="">Select a batch</option>
          {batches.map((batch, idx) => (
            <option key={idx} value={batch.name}>{batch.name}</option>
          ))}
        </select>
      </div>
      
      {/* Tab Selection */}
      <div className='flex gap-2 mb-4'>
        <button 
          className={`px-4 py-2 rounded-t-lg ${activeTab === 'manual' ? 'bg-gray-200 font-semibold' : 'bg-gray-100'}`}
          onClick={() => setActiveTab('manual')}
        >
          Manual Entry
        </button>
        <button 
          className={`px-4 py-2 rounded-t-lg ${activeTab === 'bulk' ? 'bg-gray-200 font-semibold' : 'bg-gray-100'}`}
          onClick={() => setActiveTab('bulk')}
        >
          Bulk Upload
        </button>
      </div>

      {/* Manual Entry Form */}
      {activeTab === 'manual' && (
        <div className='bg-gray-200 p-6 rounded-lg'>
          {students.map((student, index) => (
            <div key={index} className='mb-8 border-b pb-6 border-gray-300 last:border-0'>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='text-lg font-semibold'>Student #{index + 1}</h3>
                {students.length > 1 && (
                  <button 
                    onClick={() => removeStudentForm(index)}
                    className='bg-red-500 text-white p-2 rounded-full'
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              
              <div className='grid lg:grid-cols-2 gap-x-6 gap-y-4'>
                <div className='flex flex-col gap-2'>
                  <label className='text-lg font-semibold'>First name<span className='text-red-600'>*</span></label>
                  <input 
                    type='text'
                    value={student.fname}
                    onChange={(e) => handleStudentChange(index, 'fname', e.target.value)}
                    className='p-2 bg-white rounded-md'
                    placeholder='Enter first name'
                  />
                </div>

                <div className='flex flex-col gap-2'>
                  <label className='text-lg font-semibold'>Last name<span className='text-red-600'>*</span></label>
                  <input 
                    type='text'
                    value={student.lname}
                    onChange={(e) => handleStudentChange(index, 'lname', e.target.value)}
                    className='p-2 bg-white rounded-md'
                    placeholder='Enter last name'
                  />
                </div>

                <div className='flex flex-col gap-2'>
                  <label className='text-lg font-semibold'>Phone number<span className='text-red-600'>*</span></label>
                  <input 
                    type='number'
                    value={student.number}
                    onChange={(e) => handleStudentChange(index, 'number', e.target.value)}
                    className='p-2 bg-white rounded-md'
                    placeholder='Enter phone number'
                  />
                </div>

                <div className='flex flex-col gap-2'>
                  <label className='text-lg font-semibold'>Email<span className='text-red-600'>*</span></label>
                  <input 
                    type='email'
                    value={student.email}
                    onChange={(e) => handleStudentChange(index, 'email', e.target.value)}
                    className='p-2 bg-white rounded-md'
                    placeholder='Enter email'
                  />
                </div>

                <div className='flex flex-col gap-2'>
                  <label className='text-lg font-semibold'>Password<span className='text-red-600'>*</span></label>
                  <div className='flex gap-2'>
                    <div className="relative w-full">
                      <input
                        type={showPassword[`${index}-password`] ? 'text' : 'password'}
                        value={student.password}
                        onChange={(e) => handleStudentChange(index, 'password', e.target.value)}
                        className='p-2 bg-white rounded-md w-full pr-10'
                        placeholder='Enter password'
                      />
                      <div
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
                        onClick={() => togglePasswordVisibility(index, 'password')}
                      >
                        {showPassword[`${index}-password`] ? <EyeOff size={20} /> : <Eye size={20} />}
                      </div>
                    </div>

                    <button
                      onClick={() => generateRandomPasswordForStudent(index)}
                      className='bg-white hover:cursor-pointer rounded-md px-2'>
                      <RefreshCcw className='w-6 h-6' />
                    </button>
                  </div>
                </div>
                <div className='flex flex-col gap-2'>
                  <label className='text-lg font-semibold'>Confirm password<span className='text-red-600'>*</span></label>
                  <div className='relative w-full'>
                    <input
                      type={showPassword[`${index}-cpassword`] ? 'text' : 'password'}
                      value={student.cpassword}
                      onChange={(e) => handleStudentChange(index, 'cpassword', e.target.value)}
                      className='p-2 bg-white rounded-md w-full pr-10'
                      placeholder='Confirm password'
                    />
                    <div
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
                      onClick={() => togglePasswordVisibility(index, 'cpassword')}
                    >
                      {showPassword[`${index}-cpassword`] ? <EyeOff size={20} /> : <Eye size={20} />}
                    </div>
                  </div>
                </div>

                <div className='flex flex-col gap-2'>
                  <label className='text-lg font-semibold'>Parent's phone number<span className='text-red-600'>*</span></label>
                  <input 
                    type='number'
                    value={student.pnumber}
                    onChange={(e) => handleStudentChange(index, 'pnumber', e.target.value)}
                    className='p-2 bg-white rounded-md'
                    placeholder='Enter parent phone number'
                  />
                </div>

                <div className='flex flex-col gap-2'>
                  <label className='text-lg font-semibold'>Parent's Email<span className='text-red-600'>*</span></label>
                  <input 
                    type='email'
                    value={student.pemail}
                    onChange={(e) => handleStudentChange(index, 'pemail', e.target.value)}
                    className='p-2 bg-white rounded-md'
                    placeholder='Enter parent email'
                  />
                </div>
              </div>

              <div className='flex mt-5 flex-col w-1/2 gap-2'>
              <label className='text-lg font-semibold'> select Student's Gender<span className='text-red-600'>*</span></label>
                <select 
                  value={student.gender}
                  onChange={(e) => handleStudentChange(index, 'gender', e.target.value)}
                  className='p-2 bg-white rounded-md'
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                </div>

            </div>
          ))}
          
          <div className='flex justify-center gap-4 mt-6'>
            <button 
              onClick={addStudentForm}
              className='flex items-center gap-2 bg-green-600 rounded-md text-white py-2 px-4'
            >
              <Plus size={20} /> Add Another Student
            </button>
          </div>
        </div>
      )}

      {/* Bulk Upload */}
      {activeTab === 'bulk' && (
        <div className='bg-gray-200 p-6 rounded-lg'>
          <div className='flex flex-col items-center gap-6'>
            <div className="w-full flex flex-col items-center gap-4">
              <div className="flex items-center gap-4">
                <button 
                  onClick={downloadExcelTemplate}
                  className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md"
                >
                  <Download size={18} /> Download Template
                </button>
                <p className="text-gray-700">Download the Excel template first</p>
              </div>
              
              <div className="w-full max-w-md flex flex-col gap-2">
                <label className="block font-semibold">Upload Excel File</label>
                <div className="border-2 border-dashed border-gray-400 p-8 rounded-lg text-center">
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="excel-upload"
                  />
                  <label 
                    htmlFor="excel-upload" 
                    className="flex flex-col items-center gap-2 cursor-pointer"
                  >
                    <Upload size={36} className="text-blue-600" />
                    <span className="text-lg font-medium">Click to upload Excel file</span>
                    <span className="text-sm text-gray-500">or drag and drop</span>
                  </label>
                </div>
              </div>
            </div>
            
            {excelData.length > 0 && (
              <div className="w-full">
                <h3 className="text-lg font-semibold mb-2">Preview ({excelData.length} students)</h3>
                <div className="bg-white rounded-md p-4 max-h-60 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">First Name</th>
                        <th className="text-left p-2">Last Name</th>
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {excelData.map((student, idx) => (
                        <tr key={idx} className="border-b last:border-0">
                          <td className="p-2">{student.fname}</td>
                          <td className="p-2">{student.lname}</td>
                          <td className="p-2">{student.email}</td>
                          <td className="p-2">{student.number}</td>
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

      {/* Submit Button */}
      <div className='flex justify-center mt-6'>
        <button 
          onClick={handleSubmit}
          disabled={
            !batch || 
            (activeTab === 'manual' && students.some(s => !s.fname || !s.lname || !s.email)) ||
            (activeTab === 'bulk' && excelData.length === 0)
          }
          className='bg-blue-900 rounded-md text-white py-2 px-8 font-medium disabled:bg-gray-400'
        >
          Submit
        </button>
      </div>
    </div>
  )
}

export default AddStudent