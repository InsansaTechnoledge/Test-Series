import React, { useState, useEffect } from 'react'
import { Search, Filter, Download, ChevronDown, ChevronUp, MoreHorizontal, Edit, Trash2, Eye, Mail, Phone, UserX, Check, X, ArrowLeft, ArrowRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useUser } from '../../../../contexts/currentUserContext'
import * as XLSX from 'xlsx'
import { useNavigate } from 'react-router-dom'
import { fetchStudents as fetchStudentData , deleteStudentById} from '../../../../utils/services/studentService'
// This would be replaced with your actual API service
const fetchStudents = async () => {
  // Simulating API call with mock data
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    status: 200,
    data: [
      {
        id: '1',
        name: 'Tanmay Seth',
        email: 'tanmay@gmail.com',
        phone: '1234567890',
        gender: 'Male',
        batch: 'Batch 2023-A',
        parentEmail: 'parent@gmail.com',
        parentPhone: '0987654321',
        status: 'Active',
        lastLogin: '2023-05-18T09:30:00',
        joinedOn: '2023-03-15T10:00:00'
      },
      {
        id: '2',
        name: 'Priya Sharma',
        email: 'priya@gmail.com',
        phone: '2345678901',
        gender: 'Female',
        batch: 'Batch 2023-B',
        parentEmail: 'priyaparent@gmail.com',
        parentPhone: '1234567890',
        status: 'Active',
        lastLogin: '2023-05-19T14:20:00',
        joinedOn: '2023-02-20T11:30:00'
      },
      {
        id: '3',
        name: 'Rahul Patel',
        email: 'rahul@gmail.com',
        phone: '3456789012',
        gender: 'Male',
        batch: 'Batch 2023-A',
        parentEmail: 'rahulparent@gmail.com',
        parentPhone: '2345678901',
        status: 'Inactive',
        lastLogin: '2023-04-25T16:45:00',
        joinedOn: '2023-01-10T09:15:00'
      },
      {
        id: '4',
        name: 'Anjali Mishra',
        email: 'anjali@gmail.com',
        phone: '4567890123',
        gender: 'Female',
        batch: 'Batch 2023-C',
        parentEmail: 'anjaliparent@gmail.com',
        parentPhone: '3456789012',
        status: 'Active',
        lastLogin: '2023-05-20T11:10:00',
        joinedOn: '2023-03-05T14:20:00'
      },
      {
        id: '5',
        name: 'Vikram Singh',
        email: 'vikram@gmail.com',
        phone: '5678901234',
        gender: 'Male',
        batch: 'Batch 2023-B',
        parentEmail: 'vikramparent@gmail.com',
        parentPhone: '4567890123',
        status: 'Active',
        lastLogin: '2023-05-19T09:30:00',
        joinedOn: '2023-02-15T10:45:00'
      },
      {
        id: '6',
        name: 'Neha Gupta',
        email: 'neha@gmail.com',
        phone: '6789012345',
        gender: 'Female',
        batch: 'Batch 2023-C',
        parentEmail: 'nehagupta@gmail.com',
        parentPhone: '5678901234',
        status: 'Inactive',
        lastLogin: '2023-05-15T15:30:00',
        joinedOn: '2023-01-20T09:00:00'
      },
      {
        id: '7',
        name: 'Arjun Kumar',
        email: 'arjun@gmail.com',
        phone: '7890123456',
        gender: 'Male',
        batch: 'Batch 2023-A',
        parentEmail: 'arjunparent@gmail.com',
        parentPhone: '6789012345',
        status: 'Active',
        lastLogin: '2023-05-20T10:15:00',
        joinedOn: '2023-03-10T11:30:00'
      },
      {
        id: '8',
        name: 'Kavita Joshi',
        email: 'kavita@gmail.com',
        phone: '8901234567',
        gender: 'Female',
        batch: 'Batch 2023-B',
        parentEmail: 'kavitaparent@gmail.com',
        parentPhone: '7890123456',
        status: 'Active',
        lastLogin: '2023-05-18T13:45:00',
        joinedOn: '2023-02-28T10:20:00'
      }
    ]
  };
};

// This would be replaced with your actual API service
const fetchBatches = async () => {
  // Simulating API call with mock data
  await new Promise(resolve => setTimeout(resolve, 300));
  
  
  return {
    status: 200,
    data: [
      { id: '1', name: 'Batch 2023-A' },
      { id: '2', name: 'Batch 2023-B' },
      { id: '3', name: 'Batch 2023-C' }
    ]
  };
};

const StudentListPage = () => {
  const { user } = useUser()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBatch, setSelectedBatch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [genderFilter, setGenderFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [isDropdownOpen, setIsDropdownOpen] = useState(null)
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })
  const [selectedStudents, setSelectedStudents] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  const navigate = useNavigate();

  // Fetch students data
  const { data: studentResponse, isLoading: studentsLoading, refetch: refetchStudents } = useQuery({
    queryKey: ['students'],
    queryFn: fetchStudentData,
    refetchOnWindowFocus: false,
  });

  // Fetch batch data
  const { data: batchesResponse, isLoading: batchesLoading } = useQuery({
    queryKey: ['batches'],
    queryFn: fetchBatches,
    refetchOnWindowFocus: false,
  })

  const students = studentResponse?.data || []
  const batches = batchesResponse?.data || []

  // Filter and sort students
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.phone.includes(searchTerm);
    
    const matchesBatch = selectedBatch ? student.batch === selectedBatch : true;
    const matchesStatus = statusFilter ? student.status === statusFilter : true;
    const matchesGender = genderFilter ? student.gender === genderFilter : true;
    
    return matchesSearch && matchesBatch && matchesStatus && matchesGender;
  });

  // Sort students
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = sortedStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedStudents.length / itemsPerPage);

  // Handle sort
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handle dropdown toggle
  const toggleDropdown = (studentId) => {
    if (isDropdownOpen === studentId) {
      setIsDropdownOpen(null);
    } else {
      setIsDropdownOpen(studentId);
    }
  };

  // Handle checkbox selection
  const toggleStudentSelection = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  // Handle select all
  useEffect(() => {
    if (selectAll) {
      setSelectedStudents(currentStudents.map(student => student.id));
    } else {
      setSelectedStudents([]);
    }
  }, [selectAll, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedBatch, statusFilter, genderFilter]);

  // Download student data as Excel
  const downloadStudentData = () => {
    const dataToExport = selectedStudents.length > 0 
      ? sortedStudents.filter(student => selectedStudents.includes(student.id))
      : sortedStudents;

    const worksheet = XLSX.utils.json_to_sheet(dataToExport.map(student => ({
      'Name': student.name,
      'Email': student.email,
      'Phone': student.phone,
      'Gender': student.gender,
      'Batch': student.batch,
      'Parent Email': student.parentEmail,
      'Parent Phone': student.parentPhone,
      'Status': student.status,
      'Last Login': new Date(student.lastLogin).toLocaleString(),
      'Joined On': new Date(student.joinedOn).toLocaleString()
    })));
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    XLSX.writeFile(workbook, 'student_data.xlsx');
  };

  // Delete confirmation
  const confirmDelete = (student) => {
    setStudentToDelete(student);
    setShowConfirmDelete(true);
  };

  // Delete student
  const deleteStudent = async () => {
    try {
      await deleteStudentById(studentToDelete._id || studentToDelete.id);
      setShowConfirmDelete(false);
      setStudentToDelete(null);
      refetchStudents();
    } catch (err) {
      console.error("Failed to delete student", err);
      alert("Something went wrong while deleting the student");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate time since last login
  const getTimeSince = (dateString) => {
    const lastLogin = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - lastLogin);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
      }
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  };

  if (studentsLoading || batchesLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
              <p className="text-gray-500 mt-1">View and manage all students in the system</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={downloadStudentData}
                className="inline-flex items-center justify-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2.5 rounded-lg transition font-medium"
              >
                <Download size={18} />
                <span>{selectedStudents.length > 0 ? `Export (${selectedStudents.length})` : 'Export All'}</span>
              </button>
              <button
                onClick={() => navigate('/institute/add-student')}
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition font-medium"
              >
                Add New Student
              </button>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, email or phone"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 p-3 bg-gray-50 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 px-4 py-2.5 rounded-lg transition"
              >
                <Filter size={18} className="text-gray-500" />
                <span className="text-gray-700 font-medium">Filters</span>
                {(selectedBatch || statusFilter || genderFilter) && (
                  <span className="inline-flex items-center justify-center bg-blue-100 text-blue-800 text-xs font-medium h-5 w-5 rounded-full">
                    {(selectedBatch ? 1 : 0) + (statusFilter ? 1 : 0) + (genderFilter ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="p-2.5 bg-gray-50 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Batches</option>
                  {batches.map((batch) => (
                    <option key={batch.id} value={batch.name}>{batch.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="p-2.5 bg-gray-50 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="p-2.5 bg-gray-50 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3.5 text-left">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={() => setSelectAll(!selectAll)}
                        className="w-4 h-4 rounded text-blue-600"
                      />
                      <button 
                        onClick={() => requestSort('name')} 
                        className="group flex items-center gap-1 font-medium text-gray-700"
                      >
                        Student
                        <span className="text-gray-400 group-hover:text-gray-600">
                          {sortConfig.key === 'name' && sortConfig.direction === 'asc' ? (
                            <ChevronUp size={16} />
                          ) : sortConfig.key === 'name' && sortConfig.direction === 'desc' ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronDown size={16} className="opacity-0 group-hover:opacity-100" />
                          )}
                        </span>
                      </button>
                    </div>
                  </th>
                  <th className="px-6 py-3.5 text-left">
                    <button 
                      onClick={() => requestSort('batch')} 
                      className="group flex items-center gap-1 font-medium text-gray-700"
                    >
                      Batch
                      <span className="text-gray-400 group-hover:text-gray-600">
                        {sortConfig.key === 'batch' && sortConfig.direction === 'asc' ? (
                          <ChevronUp size={16} />
                        ) : sortConfig.key === 'batch' && sortConfig.direction === 'desc' ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronDown size={16} className="opacity-0 group-hover:opacity-100" />
                        )}
                      </span>
                    </button>
                  </th>
                  <th className="px-6 py-3.5 text-left">
                    <button 
                      onClick={() => requestSort('status')} 
                      className="group flex items-center gap-1 font-medium text-gray-700"
                    >
                      Status
                      <span className="text-gray-400 group-hover:text-gray-600">
                        {sortConfig.key === 'status' && sortConfig.direction === 'asc' ? (
                          <ChevronUp size={16} />
                        ) : sortConfig.key === 'status' && sortConfig.direction === 'desc' ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronDown size={16} className="opacity-0 group-hover:opacity-100" />
                        )}
                      </span>
                    </button>
                  </th>
                  <th className="px-6 py-3.5 text-left">
                    <button 
                      onClick={() => requestSort('lastLogin')} 
                      className="group flex items-center gap-1 font-medium text-gray-700"
                    >
                      Last Login
                      <span className="text-gray-400 group-hover:text-gray-600">
                        {sortConfig.key === 'lastLogin' && sortConfig.direction === 'asc' ? (
                          <ChevronUp size={16} />
                        ) : sortConfig.key === 'lastLogin' && sortConfig.direction === 'desc' ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronDown size={16} className="opacity-0 group-hover:opacity-100" />
                        )}
                      </span>
                    </button>
                  </th>
                  <th className="px-6 py-3.5 text-left">
                    <button 
                      onClick={() => requestSort('joinedOn')} 
                      className="group flex items-center gap-1 font-medium text-gray-700"
                    >
                      Joined On
                      <span className="text-gray-400 group-hover:text-gray-600">
                        {sortConfig.key === 'joinedOn' && sortConfig.direction === 'asc' ? (
                          <ChevronUp size={16} />
                        ) : sortConfig.key === 'joinedOn' && sortConfig.direction === 'desc' ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronDown size={16} className="opacity-0 group-hover:opacity-100" />
                        )}
                      </span>
                    </button>
                  </th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentStudents.length > 0 ? (
                  currentStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student.id)}
                            onChange={() => toggleStudentSelection(student.id)}
                            className="w-4 h-4 rounded text-blue-600"
                          />
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{student.name}</span>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                              <div className="flex items-center gap-1">
                                <Mail size={14} />
                                <span>{student.email}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone size={14} />
                                <span>{student.phone}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {student.batch}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {student.status === 'Active' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {getTimeSince(student.lastLogin)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(student.joinedOn)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative">
                          <button
                            onClick={() => toggleDropdown(student.id)}
                            className="inline-flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                          >
                            <MoreHorizontal size={18} />
                          </button>
                          
                          {isDropdownOpen === student.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                              <div className="py-1">
                                <button
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  onClick={() => console.log(`View student: ${student.id}`)}
                                >
                                  <Eye size={16} />
                                  View Profile
                                </button>
                                <button
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  onClick={() => console.log(`Edit student: ${student.id}`)}
                                >
                                  <Edit size={16} />
                                  Edit Student
                                </button>
                                <button
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                                  onClick={() => {
                                    confirmDelete(student);
                                    setIsDropdownOpen(null);
                                  }}
                                >
                                  <Trash2 size={16} />
                                  Delete Student
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <UserX size={48} className="text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No students found</h3>
                        <p className="text-gray-500">
                          {searchTerm || selectedBatch || statusFilter || genderFilter 
                            ? "Try adjusting your filters or search term" 
                            : "Get started by adding a new student"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {sortedStudents.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">
                  {Math.min(indexOfLastItem, sortedStudents.length)}
                </span> of <span className="font-medium">{sortedStudents.length}</span> results
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-500">Show</label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <label className="text-sm text-gray-500">entries</label>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`inline-flex items-center justify-center p-2 rounded-md ${
                      currentPage === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ArrowLeft size={16} />
                  </button>
                  
                  {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                    const pageNumber = currentPage <= 2
                      ? i + 1
                      : currentPage >= totalPages - 1
                        ? totalPages - 2 + i
                        : currentPage - 1 + i;
                        
                    if (pageNumber <= totalPages) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`inline-flex items-center justify-center h-8 w-8 rounded-md ${
                            currentPage === pageNumber
                              ? 'bg-blue-50 text-blue-600 font-medium'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    }
                    return null;
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`inline-flex items-center justify-center p-2 rounded-md ${
                      currentPage === totalPages
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* No students message */}
        {students.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 flex flex-col items-center justify-center">
            <UserX size={64} className="text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Students Found</h2>
            <p className="text-gray-500 mb-6 text-center max-w-md">
              There are no students in the system yet. Get started by adding your first student.
            </p>
            <button
              onClick={() => window.location.href = '/add-student'}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition font-medium"
            >
              Add New Student
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto mb-4">
                <Trash2 size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Student</h3>
              <p className="text-gray-500 text-center mb-6">
                Are you sure you want to delete {studentToDelete?.name}? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="flex-1 inline-flex items-center justify-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg transition font-medium"
                >
                  <X size={18} />
                  Cancel
                </button>
                <button
                  onClick={deleteStudent}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg transition font-medium"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentListPage;