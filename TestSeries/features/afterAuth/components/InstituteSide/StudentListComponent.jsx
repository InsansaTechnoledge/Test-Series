import React, { useState, useEffect } from 'react'
import { Search, Filter, Trash2, MoreHorizontal, Eye, Edit, UserX, Check, X, ChevronUp, ChevronDown, Users, GraduationCap, Sparkles, Target, PlusSquare } from 'lucide-react'
import { useCachedStudents } from '../../../../hooks/useCachedStudents';
import { deleteStudentById } from '../../../../utils/services/studentService';
import { useCachedBatches } from '../../../../hooks/useCachedBatches';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '../../../../contexts/currentUserContext';
import Banner from "../../../../assests/Institute/student list.svg"
import { usePageAccess } from '../../../../contexts/PageAccessContext';
import { useTheme } from '../../../../hooks/useTheme';

const StudentListPage = () => {

  const canAccessPage  = usePageAccess();
  
  
          if (!canAccessPage) {
            return (
              <div className="flex items-center justify-center ">
                <div className="text-center bg-red-100 px-4 py-3 my-auto">
                  <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
                  <p className="text-gray-600">You do not have permission to view this page.</p>
                </div>
              </div>
            );
          }

  const { user ,hasRoleAccess} = useUser();
  const { students, isLoading, isError } = useCachedStudents();
  const [showStudents, setShowStudents] = useState([]);
  const { batches, batchMap } = useCachedBatches();
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
  const { theme } = useTheme();
  const location = useLocation();

  const canAddStudent= hasRoleAccess({
    keyFromPageOrAction: 'actions.addStudent',
    location: location.pathname
  });
  const canDeleteStudent = hasRoleAccess({
    keyFromPageOrAction: 'actions.deleteStudent',
    location: location.pathname
  });
  const canEditStudent = hasRoleAccess({
    keyFromPageOrAction: 'actions.editStudent',
    location: location.pathname
  });

  const canViewStudent = hasRoleAccess({
    keyFromPageOrAction: 'actions.viewStudent',
    location: location.pathname
  });



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
  const deleteStudents = async () => {
    try {

      const response = await deleteStudentById(studentsToDelete);
      if (response.status === 200) {

        await queryClient.invalidateQueries(["Students", user._id]);
      }
    } catch (error) {
      console.error("Error deleting students:", error);
    }
    setSelectedStudents([])
    setSelectAll(false)
    setShowConfirmDelete(false)
  }

  return (
    <div className={`min-h-screen`}>

      {/* Hero Header */}

      <div className="relative overflow-hidden rounded-xl h-80">

        <img
          src={Banner}
          alt="Upload Banner"
          className="absolute  w-full h-full object-cover"
        />

        <div className={`absolute inset-0 ${
          theme === 'dark' 
            ? 'bg-gray-900/60' 
            : 'bg-black/20'
        }`}></div>

        <div className="absolute "></div>

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center h-full px-6 text-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
              All Students
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              View, manage, and organize students
            </p>
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} rounded-3xl p-6 shadow-xl border-l-4 border-indigo-600 transform hover:scale-105 transition-all duration-300`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-600' : 'text-gray-200'} uppercase tracking-wide`}>Total Students</p>
                <p className={`text-4xl font-black ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-200'}`}>{filteredStudents?.length}</p>
              </div>
              <div className={`${theme === 'light' ? 'bg-indigo-100' : 'bg-indigo-400'} p-3 rounded-2xl`}>
                <Users className={`w-8 h-8 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-800'}`} />
              </div>
            </div>
          </div>

          <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} rounded-3xl p-6 shadow-xl border-l-4 border-gray-600 transform hover:scale-105 transition-all duration-300`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-600' : 'text-gray-200'} uppercase tracking-wide`}>Selected</p>
                <p className={`text-4xl font-black ${theme === 'light' ? 'text-gray-600' : 'text-gray-200'}`}>{selectedStudents.length}</p>
              </div>
              <div className={`${theme === 'light' ? 'bg-gray-100' : 'bg-gray-400'} p-3 rounded-2xl`}>
                <Check className={`w-8 h-8 ${theme === 'light' ? 'text-gray-600' : 'text-gray-800'}`} />
              </div>
            </div>
          </div>

          <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} rounded-3xl p-6 shadow-xl border-l-4 border-indigo-600 transform hover:scale-105 transition-all duration-300`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-semibold ${theme === 'light' ? 'text-gray-600' : 'text-gray-200'} uppercase tracking-wide`}>Search Results</p>
                <p className={`text-4xl font-black ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-200'}`}>{sortedStudents.length}</p>
              </div>
              <div className={`${theme === 'light' ? 'bg-indigo-100' : 'bg-indigo-400'} p-3 rounded-2xl`}>
                <Search className={`w-8 h-8 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-800'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className={`${theme === 'light' ? 'bg-white border border-gray-100' : 'bg-gray-800 border border-gray-700'} rounded-3xl shadow-xl p-6 mb-8`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${theme === 'light' ? 'text-gray-400' : 'text-gray-300'} w-5 h-5`} />
                <input
                  className={`${theme === 'light' ? 'bg-gray-50 border-2 border-gray-200 text-gray-900 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400' : 'bg-gray-700 border-2 border-gray-600 text-gray-100 focus:ring-4 focus:ring-indigo-400 focus:border-indigo-400'} rounded-2xl pl-12 pr-6 py-3 transition-all duration-300 w-80`}
                  placeholder="Search by name, email or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`${theme === 'light' ? 'bg-gray-50 border-2 border-gray-200 text-gray-900 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400' : 'bg-gray-700 border-2 border-gray-600 text-gray-100 focus:ring-4 focus:ring-indigo-400 focus:border-indigo-400'} rounded-2xl px-6 py-3 transition-all duration-300 font-medium flex items-center space-x-2`}
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
                {selectedBatch && (
                  <span className="inline-flex items-center justify-center bg-indigo-100 text-indigo-800 text-xs font-medium h-5 w-5 rounded-full">
                    1
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center space-x-3">
              {(selectedStudents.length > 0 && canDeleteStudent) && (
                <button
                  disabled={!canDeleteStudent}
                  onClick={confirmDeleteSelected}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center space-x-2"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Delete Selected ({selectedStudents.length})</span>
                </button>
              )}

             {canAddStudent && ( <button
                disabled={!canAddStudent}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-bold transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center space-x-3 transform"
                onClick={() => navigate('/institute/add-student')}
              >
                <PlusSquare className="w-5 h-5" />
                <span>Add New Student</span>
              </button>)}
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="max-w-xs">
                <label className={`block text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'} mb-2`}>Batch Filter</label>
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className={`${theme === 'light' ? 'bg-gray-50 border-2 border-gray-200 text-gray-900 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400' : 'bg-gray-700 border-2 border-gray-600 text-gray-100 focus:ring-4 focus:ring-indigo-400 focus:border-indigo-400'} rounded-2xl px-4 py-3 transition-all duration-300 w-full font-medium`}
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

        {/* Sort Controls */}
        <div className={`${theme === 'light' ? 'bg-white border border-gray-100' : 'bg-gray-800 border border-gray-700'} rounded-3xl shadow-xl p-6 mb-8`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={() => setSelectAll(!selectAll)}
                className="w-5 h-5 rounded-lg text-indigo-600 border-2 border-gray-300 focus:ring-indigo-500"
              />
              <span className={`font-bold ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>Select All Students</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => requestSort('name')}
                className={`group flex items-center gap-2 ${theme === 'light' ? 'bg-gray-50 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600' : 'bg-gray-700 hover:bg-indigo-800 text-gray-200 hover:text-indigo-300'} px-4 py-2 rounded-2xl font-medium transition-all duration-300`}
              >
                Sort by Name
                <span className={`${theme === 'light' ? 'text-gray-400 group-hover:text-indigo-600' : 'text-gray-400 group-hover:text-indigo-300'} transition-colors`}>
                  {sortConfig.key === 'name' && sortConfig.direction === 'asc' ? (
                    <ChevronUp size={18} />
                  ) : sortConfig.key === 'name' && sortConfig.direction === 'desc' ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronDown size={18} className="opacity-0 group-hover:opacity-100" />
                  )}
                </span>
              </button>
              <button
                onClick={() => requestSort('batch')}
                className={`group flex items-center gap-2 ${theme === 'light' ? 'bg-gray-50 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600' : 'bg-gray-700 hover:bg-indigo-800 text-gray-200 hover:text-indigo-300'} px-4 py-2 rounded-2xl font-medium transition-all duration-300`}
              >
                Sort by Batch
                <span className={`${theme === 'light' ? 'text-gray-400 group-hover:text-indigo-600' : 'text-gray-400 group-hover:text-indigo-300'} transition-colors`}>
                  {sortConfig.key === 'batch' && sortConfig.direction === 'asc' ? (
                    <ChevronUp size={18} />
                  ) : sortConfig.key === 'batch' && sortConfig.direction === 'desc' ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronDown size={18} className="opacity-0 group-hover:opacity-100" />
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Student Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {sortedStudents?.map((student, idx) => (
            <div
              key={student._id || idx}
              className={`group relative ${theme === 'light' ? 'bg-white border-gray-100' : 'bg-gray-800 border-gray-700'} rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border overflow-hidden`}
              style={{
                animationDelay: `${idx * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              {/* Gradient Header */}
        
<div className={`h-16 ${theme === 'light' ? 'bg-gradient-to-r from-indigo-500 to-indigo-400' : 'bg-gradient-to-r from-indigo-600 to-indigo-700'} rounded-t-2xl relative overflow-hidden shadow-md`}>

<div className={`inset-0 ${theme === 'light' ? 'bg-indigo-100' : 'bg-gray-800'} bg-opacity-5 backdrop-blur-sm -z-10 absolute  bg-opacity-10`}></div>


<div className='flex justify-between items-center p-6  '>
<div className="flex gap-2 justify-center items-center ">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student._id)}
                    onChange={() => toggleStudentSelection(student._id)}
                    className="w-5 h-5 z-10 cursor-pointer rounded-lg text-white bg-white bg-opacity-20 border-2 border-white focus:ring-white"
                  />
                    <h3 className="text-white font-bold text-xl leading-snug line-clamp-2">
  {student.name}
  </h3>
                </div>
<div className="">

</div>

<div className="">
  <div className="bg-white text-indigo-700 text-xs font-bold px-3 py-1 rounded-full shadow backdrop-blur-md border border-white border-opacity-30 flex items-center gap-1">
  {batchMap[student.batch?.currentBatch]?.name || 'No Batch'}
  </div>
</div>





</div>



</div>
              {/* Card Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className={`${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'} px-3 py-1 rounded-full`}>
                      <span className={`text-xs font-bold ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>Student-ID: {student._id?.slice(-6)}</span>
                    </div>
                  </div>
                </div>

                {/* Student Details */}
                <div className="mb-6">
                  <div className={`flex items-center space-x-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} mb-2`}>
                    <span className="text-sm font-medium">Email:</span>
                    <span className={`text-sm ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'} font-semibold`}>{student.email}</span>
                  </div>
                  {student.phone && (
                    <div className={`flex items-center space-x-2 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                      <span className="text-sm font-medium">Phone:</span>
                      <span className={`text-sm ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'} font-semibold`}>{student.phone}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-3">
                 {canViewStudent &&( <button
                 disabled={!canViewStudent}
                    className={`flex-1 z-10 cursor-pointer ${theme === 'light' ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'} p-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2`}
                    onClick={() => navigate('/institute/student-detail', { state: { studentId: student._id } })}
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="font-medium text-sm">View</span>
                  </button>)}

                 { canEditStudent && (<button
                    className={`flex-1 z-10 cursor-pointer ${theme === 'light' ? 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700' : 'bg-indigo-800 hover:bg-indigo-700 text-indigo-200'} p-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2`}
                    onClick={() => navigate('/institute/student-edit', { state: { studentId: student._id } })}
                    title="Edit Student"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="font-medium text-sm">Edit</span>
                  </button>)
}
                  {canDeleteStudent && (<button
                    className={`${theme === 'light' ? 'bg-red-100 hover:bg-red-200 text-red-700' : 'bg-red-800 hover:bg-red-700 text-red-200'} z-10 cursor-pointer p-3 rounded-xl transition-all duration-300 hover:scale-105`}
                    onClick={() => {
                      setStudentsToDelete([student._id]);
                      setShowConfirmDelete(true);
                    }}
                    title="Delete Student"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>)}
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-gray-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-3xl"></div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {sortedStudents?.length === 0 && (
          <div className="text-center py-20">
            <div className={`w-32 h-32 mx-auto ${theme === 'light' ? 'bg-gradient-to-r from-indigo-100 to-gray-100' : 'bg-gradient-to-r from-indigo-800 to-gray-700'} rounded-full flex items-center justify-center mb-8 animate-bounce`}>
              <UserX size={48} className={`${theme === 'light' ? 'text-indigo-400' : 'text-indigo-300'}`} />
            </div>
            <h3 className={`text-3xl font-black ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'} mb-4`}>No students found</h3>
            <p className={`text-xl ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} mb-8 max-w-md mx-auto`}>
              {selectedBatch ? `No students found for the selected batch` : searchTerm ? `No students match "${searchTerm}"` : 'Get started by adding your first student'}
            </p>
           {canAddStudent &&( <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl font-bold transition-all duration-300 hover:shadow-2xl hover:scale-105 inline-flex items-center space-x-3"
              onClick={() => navigate('/institute/add-student')}
            >
              <PlusSquare className="w-5 h-5" />
              <span>Add First Student</span>
            </button>)}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} rounded-3xl shadow-2xl max-w-md w-full transform animate-pulse`}>
            <div className="p-8">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-100 text-red-600 mx-auto mb-6">
                <Trash2 size={32} />
              </div>
              <h3 className={`text-2xl font-black ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'} text-center mb-3`}>
                Delete {studentsToDelete.length > 1 ? 'Students' : 'Student'}
              </h3>
              <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-400'} text-center mb-8 text-lg`}>
                Are you sure you want to delete {studentsToDelete.length > 1 ? `${studentsToDelete.length} students` : 'this student'}? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className={`flex-1 inline-flex items-center justify-center gap-3 border-2 ${theme === 'light' ? 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700' : 'border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-200'} px-6 py-4 rounded-2xl transition-all duration-300 font-bold hover:scale-105`}
                >
                  <X size={20} />
                  Cancel
                </button>
                <button
                  onClick={deleteStudents}
                  className="flex-1 inline-flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-2xl transition-all duration-300 font-bold hover:scale-105 hover:shadow-2xl"
                >
                  <Trash2 size={20} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
      `}</style>
    </div>
  )
}

export default StudentListPage