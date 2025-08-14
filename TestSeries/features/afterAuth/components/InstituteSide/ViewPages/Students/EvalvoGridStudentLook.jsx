import React from 'react'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Eye, Edit, Trash2 } from 'lucide-react';

const EvalvoGridStudentLook = ({
    theme,
    selectAll,
    setSelectAll,
    sortConfig,
    requestSort,
    totalPages,
    indexOfFirstStudent,
    indexOfLastStudent,
    sortedStudents,
    currentPage,
    paginate,
    getPageNumbers,
    currentStudents,
    selectedStudents,
    toggleStudentSelection,
    batchMap,
    canViewStudent,
    canEditStudent,
    canDeleteStudent,
    navigate,
    setStudentsToDelete,
    setShowConfirmDelete,
    searchTerm,
    setSearchTerm
}) => {
  return (
    <>
      {/* Search Bar */}
      <div className="my-6 flex justify-center">
        <div className="relative max-w-md w-full">
          <input
            type="text"
            placeholder="Search students..."
            className={`w-full px-6 py-3 rounded-2xl shadow-lg border-2 focus:outline-none focus:ring-2 transition-all duration-300 ${
              theme === 'light' 
                ? 'bg-white border-gray-200 text-gray-800 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-200' 
                : 'bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-indigo-400 focus:ring-indigo-800'
            }`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Sort Controls */}
      <div className={`${theme === 'light' ? 'bg-white border border-gray-100' : 'bg-gray-800 border border-gray-700'} rounded-2xl shadow-xl p-6 mb-6`}>
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
              className={`group flex items-center gap-2 ${theme === 'light' ? 'bg-gray-50 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600' : 'bg-gray-700 hover:bg-indigo-800 text-gray-200 hover:text-indigo-300'} px-4 py-2 rounded-xl font-medium transition-all duration-300`}
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
              className={`group flex items-center gap-2 ${theme === 'light' ? 'bg-gray-50 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600' : 'bg-gray-700 hover:bg-indigo-800 text-gray-200 hover:text-indigo-300'} px-4 py-2 rounded-xl font-medium transition-all duration-300`}
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

      {/* Students Table */}
      <div className={`overflow-x-auto max-w-7xl mx-auto rounded-2xl shadow-xl mb-6 ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}>
        <table className="min-w-full">
          <thead className={`${
            theme === "dark" 
              ? "bg-gradient-to-r from-gray-700 to-gray-600 text-white" 
              : "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-900"
          }`}>
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide border-b border-gray-300 dark:border-gray-600">
                Select
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide border-b border-gray-300 dark:border-gray-600">
                S.No.
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide border-b border-gray-300 dark:border-gray-600">
                Student Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide border-b border-gray-300 dark:border-gray-600">
                Student ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide border-b border-gray-300 dark:border-gray-600">
                Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide border-b border-gray-300 dark:border-gray-600">
                Phone
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide border-b border-gray-300 dark:border-gray-600">
                Batch Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide border-b border-gray-300 dark:border-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${
            theme === "dark" 
              ? "divide-gray-700 bg-gray-800 text-white" 
              : "divide-gray-200 bg-white text-gray-900"
          }`}>
            {currentStudents?.map((student, index) => (
              <tr
                key={student._id}
                className={`transition-all duration-200 ${
                  theme === "dark" 
                    ? "hover:bg-gray-700 hover:shadow-md" 
                    : "hover:bg-blue-50 hover:shadow-md"
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student._id)}
                    onChange={() => toggleStudentSelection(student._id)}
                    className="w-5 h-5 rounded-lg text-indigo-600 border-2 border-gray-300 focus:ring-indigo-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    theme === "dark" 
                      ? "bg-gray-700 text-gray-300" 
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {indexOfFirstStudent + index + 1}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-base">{student.name}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    theme === "dark"
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {student._id}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}>
                    {student.email}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}>
                    {student.phone || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    theme === "dark"
                      ? "bg-indigo-900 text-indigo-300"
                      : "bg-indigo-100 text-indigo-800"
                  }`}>
                    {batchMap[student.batch?.currentBatch]?.name || 'No Batch'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {canViewStudent && (
                      <button
                        className={`p-2.5 rounded-lg transition-all duration-200 ${
                          theme === "dark"
                            ? "text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 hover:ring-1 hover:ring-blue-700"
                            : "text-gray-500 hover:text-blue-600 hover:bg-blue-50 hover:ring-1 hover:ring-blue-200"
                        }`}
                        onClick={() => navigate('/institute/student-detail', { state: { studentId: student._id } })}
                        title="View Student"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}

                    {canEditStudent && (
                      <button
                        className={`p-2.5 rounded-lg transition-all duration-200 ${
                          theme === "dark"
                            ? "text-gray-400 hover:text-indigo-400 hover:bg-indigo-900/20 hover:ring-1 hover:ring-indigo-700"
                            : "text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 hover:ring-1 hover:ring-indigo-200"
                        }`}
                        onClick={() => navigate('/institute/student-edit', { state: { studentId: student._id } })}
                        title="Edit Student"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}

                    {canDeleteStudent && (
                      <button
                        className={`p-2.5 rounded-lg transition-all duration-200 ${
                          theme === "dark"
                            ? "text-gray-400 hover:text-red-400 hover:bg-red-900/20 hover:ring-1 hover:ring-red-700"
                            : "text-gray-500 hover:text-red-600 hover:bg-red-50 hover:ring-1 hover:ring-red-200"
                        }`}
                        onClick={() => {
                          setStudentsToDelete([student._id]);
                          setShowConfirmDelete(true);
                        }}
                        title="Delete Student"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className={`${theme === 'light' ? 'bg-white border border-gray-100' : 'bg-gray-800 border border-gray-700'} rounded-2xl shadow-xl p-6`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>
              Showing {indexOfFirstStudent + 1} to {Math.min(indexOfLastStudent, sortedStudents.length)} of {sortedStudents.length} students
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  currentPage === 1
                    ? (theme === 'light' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-700 text-gray-500 cursor-not-allowed')
                    : (theme === 'light' ? 'bg-gray-50 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600' : 'bg-gray-700 text-gray-200 hover:bg-indigo-800 hover:text-indigo-300')
                }`}
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <div className="flex items-center space-x-1">
                {getPageNumbers().map((pageNum, index) => (
                  <React.Fragment key={index}>
                    {pageNum === '...' ? (
                      <span className={`px-3 py-2 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>...</span>
                    ) : (
                      <button
                        onClick={() => paginate(pageNum)}
                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                          currentPage === pageNum
                            ? (theme === 'light' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-indigo-600 text-white shadow-lg')
                            : (theme === 'light' ? 'bg-gray-50 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600' : 'bg-gray-700 text-gray-200 hover:bg-indigo-800 hover:text-indigo-300')
                        }`}
                      >
                        {pageNum}
                      </button>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  currentPage === totalPages
                    ? (theme === 'light' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-700 text-gray-500 cursor-not-allowed')
                    : (theme === 'light' ? 'bg-gray-50 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600' : 'bg-gray-700 text-gray-200 hover:bg-indigo-800 hover:text-indigo-300')
                }`}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default EvalvoGridStudentLook