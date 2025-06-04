import React, { useState, useEffect } from 'react'
import { Search, Filter, Trash2, MoreHorizontal, Eye, Edit, UserX, Check, X, ChevronUp, ChevronDown } from 'lucide-react'
import { useCachedStudents } from '../../../../hooks/useCachedStudents';
import { deleteStudentById } from '../../../../utils/services/studentService';
import { useCachedBatches } from '../../../../hooks/useCachedBatches';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '../../../../contexts/currentUserContext';

const  StudentListPage= () => {
  const {user} = useUser();
  const {students, isLoading, isError} = useCachedStudents();
  const [showStudents, setShowStudents] = useState([]);
  const{batches,batchMap}=useCachedBatches();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBatch, setSelectedBatch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(null)
  const [selectedStudents, setSelectedStudents] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [studentsToDelete, setStudentsToDelete] = useState([])
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })

useEffect(() => {
    if (students.length > 0) {
      setShowStudents(students)
    }
}, [students]);

  // Filter students based on search and batch filter
  const filteredStudents = showStudents.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${student.phone}`.includes(searchTerm);

    const matchesBatch = selectedBatch ? student.batch?.currentBatch === selectedBatch : true;

    return matchesSearch && matchesBatch;
  });


  // Sort students
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1
    }
    return 0
  })

  // Handle sort
  const requestSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  // Handle dropdown toggle
  const toggleDropdown = (studentId) => {
    if (isDropdownOpen === studentId) {
      setIsDropdownOpen(null)
    } else {
      setIsDropdownOpen(studentId)
    }
  }

  // Handle checkbox selection
  const toggleStudentSelection = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId))
    } else {
      setSelectedStudents([...selectedStudents, studentId])
    }
  }

  // Handle select all
  useEffect(() => {
    if (selectAll) {
      setSelectedStudents(sortedStudents.map(student => student._id))
    } else {
      setSelectedStudents([])
    }
  }, [selectAll])

  // Confirm delete selected students
  const confirmDeleteSelected = () => {
    setStudentsToDelete(selectedStudents)
    setShowConfirmDelete(true)
  }

  // Delete students
  const deleteStudents =async () => {
    try{
      
        console.log("Deleting students:", studentsToDelete);
        const response=await deleteStudentById(studentsToDelete);
        if (response.status === 200) {
          console.log("Students deleted successfully:", response.data);
          await queryClient.invalidateQueries(["Students",user._id]);
        }

    }catch(error){
      console.error("Error deleting students:", error);

    }
        setSelectedStudents([])
    setSelectAll(false)
    setShowConfirmDelete(false)

  }

  const handleViewProfile = () => {
      
  };



  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
              <p className="text-gray-500 mt-1">View and manage students</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              {selectedStudents.length > 0 && (
                <button 
                  onClick={confirmDeleteSelected}
                  className="inline-flex items-center justify-center gap-2 bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2.5 rounded-lg transition font-medium"
                >
                  <Trash2 size={18} />
                  <span>Delete Selected ({selectedStudents.length})</span>
                </button>
              )}
              <button
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition font-medium"
                onClick={() => {
                  // Add new student logic here
                  console.log("Add new student clicked")
                  navigate('/institute/add-student');
                }}
              >
                Add New Student
              </button>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
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
                {selectedBatch && (
                  <span className="inline-flex items-center justify-center bg-blue-100 text-blue-800 text-xs font-medium h-5 w-5 rounded-full">
                    1
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="max-w-xs">
                <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="p-2.5 bg-gray-50 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Batches</option>
                  {batches.map((batch) => (
                    <option key={batch.id} value={batch.id}>{batch.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedStudents.length > 0 ? (
                  sortedStudents.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(student._id)}
                            onChange={() => toggleStudentSelection(student._id)}
                            className="w-4 h-4 rounded text-blue-600"
                          />
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{student.name}</span>
                            <div className="text-sm text-gray-500 mt-1">
                              {student.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {batchMap[student.batch?.currentBatch]?.name || 'N/A'}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="relative">
                          <button
                            onClick={() => toggleDropdown(student._id)}
                            className="inline-flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                          >
                            <MoreHorizontal size={18} />
                          </button>

                          {isDropdownOpen === student._id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                              <div className="py-1">
                                <button
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  onClick={() => navigate('/institute/student-detail', { state: { studentId: student._id } })}
                                  >
                                  <Eye size={16} />
                                  View Profile
                                </button>
                                <button
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  <Edit size={16} />
                                  Edit Student
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
                    <td colSpan="3" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <UserX size={48} className="text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No students found</h3>
                        <p className="text-gray-500">
                          {searchTerm || selectedBatch
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
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto mb-4">
                <Trash2 size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete {studentsToDelete.length > 1 ? 'Students' : 'Student'}</h3>
              <p className="text-gray-500 text-center mb-6">
                Are you sure you want to delete {studentsToDelete.length > 1 ? `${studentsToDelete.length} students` : 'this student'}? This action cannot be undone.
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
                  onClick={deleteStudents}
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
  )
}

export default StudentListPage