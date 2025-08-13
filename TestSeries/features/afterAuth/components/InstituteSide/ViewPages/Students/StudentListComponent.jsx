import React, { useState, useEffect } from 'react'
import { Search, Filter, Trash2, MoreHorizontal, Eye, Edit, UserX, Check, X, ChevronUp, ChevronDown, Users, GraduationCap, Sparkles, Target, PlusSquare, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCachedStudents } from '../../../../../../hooks/useCachedStudents';
import { deleteStudentById } from '../../../../../../utils/services/studentService';
import { useCachedBatches } from '../../../../../../hooks/useCachedBatches';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '../../../../../../contexts/currentUserContext';
import Banner from "../../../../../../assests/Institute/student list.svg"
import { usePageAccess } from '../../../../../../contexts/PageAccessContext';
import { useTheme } from '../../../../../../hooks/useTheme';
import EvalvoPulseStudentsLook from './EvalvoPulseStudentsLook';
import EvalvoGridStudentLook from './EvalvoGridStudentLook';
import { useEvalvoTheme } from '../../../../../../hooks/EvalvoThemeContext';

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
    const { evalvoTheme } = useEvalvoTheme();


  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(12);

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


  console.log("sdf",students)

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

  // Calculate pagination based on filtered results
  const totalPages = Math.ceil(sortedStudents.length / studentsPerPage);
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = sortedStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedBatch]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push('...');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

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

  // Handle select all for current page
  const toggleSelectAllCurrentPage = () => {
    if (selectAll) {
      // Deselect all students from current page
      const currentPageStudentIds = currentStudents.map(student => student._id);
      setSelectedStudents(prev => prev.filter(id => !currentPageStudentIds.includes(id)));
      setSelectAll(false);
    } else {
      // Select all students from current page
      const currentPageStudentIds = currentStudents.map(student => student._id);
      setSelectedStudents(prev => [...new Set([...prev, ...currentPageStudentIds])]);
      setSelectAll(true);
    }
  };

  // Update selectAll state based on current page selection
  useEffect(() => {
    const currentPageStudentIds = currentStudents.map(student => student._id);
    const allCurrentPageSelected = currentPageStudentIds.length > 0 && 
      currentPageStudentIds.every(id => selectedStudents.includes(id));
    setSelectAll(allCurrentPageSelected);
  }, [selectedStudents, currentStudents]);

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

        {
          evalvoTheme === 'EvalvoPulse' ? (
            <EvalvoPulseStudentsLook
              theme={theme}
              selectAll={selectAll}
              setSelectAll={setSelectAll}
              sortConfig={sortConfig}
              requestSort={requestSort}
              totalPages={totalPages}
              indexOfFirstStudent={indexOfFirstStudent}
              indexOfLastStudent={indexOfLastStudent}
              sortedStudents={sortedStudents}
              currentPage={currentPage}
              paginate={paginate}
              getPageNumbers={getPageNumbers}
              currentStudents={currentStudents}
              selectedStudents={selectedStudents}
              toggleStudentSelection={toggleStudentSelection}
              batchMap={batchMap}
              canViewStudent={canViewStudent}
              canEditStudent={canEditStudent}
              canDeleteStudent={canDeleteStudent}
              navigate={navigate}
              setStudentsToDelete={setStudentsToDelete}
              setShowConfirmDelete={setShowConfirmDelete}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          ) : (
            <EvalvoGridStudentLook
              theme={theme}
              selectAll={selectAll}
              setSelectAll={setSelectAll}
              sortConfig={sortConfig}
              requestSort={requestSort}
              totalPages={totalPages}
              indexOfFirstStudent={indexOfFirstStudent}
              indexOfLastStudent={indexOfLastStudent}
              sortedStudents={sortedStudents}
              currentPage={currentPage}
              paginate={paginate}
              getPageNumbers={getPageNumbers}
              currentStudents={currentStudents}
              selectedStudents={selectedStudents}
              toggleStudentSelection={toggleStudentSelection}
              batchMap={batchMap}
              canViewStudent={canViewStudent}
              canEditStudent={canEditStudent}
              canDeleteStudent={canDeleteStudent}
              navigate={navigate}
              setStudentsToDelete={setStudentsToDelete}
              setShowConfirmDelete={setShowConfirmDelete}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          )
        }
      

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