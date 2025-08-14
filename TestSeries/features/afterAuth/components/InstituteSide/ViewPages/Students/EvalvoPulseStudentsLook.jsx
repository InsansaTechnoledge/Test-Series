import React from 'react'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Eye, Edit, Trash2 } from 'lucide-react';

const EvalvoPulseStudentsLook = ({
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

         {/* search bar */}
         <div className="my-4 flex justify-center">
        <input
          type="text"
          placeholder="Search students..."
          className="border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div> 

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className={`${theme === 'light' ? 'bg-white border border-gray-100' : 'bg-gray-800 border border-gray-700'} rounded-3xl shadow-xl p-6 mb-8`}>
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

       {/* Student Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 ">
          {currentStudents?.map((student, idx) => (
            <div
              key={student._id || idx}
              className={`group relative ${theme === 'light' ? 'bg-white border-gray-100' : 'bg-gray-800 border-gray-700'} rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border overflow-hidden`}
              style={{
                animationDelay: `${idx * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              <div className={`h-16 ${theme === 'light' ? 'bg-gradient-to-r from-indigo-500 to-indigo-400' : 'bg-gradient-to-r from-indigo-600 to-indigo-700'} rounded-t-2xl relative overflow-hidden shadow-md`}>

              <div className={`inset-0 ${theme === 'light' ? 'bg-indigo-100' : 'bg-gray-800'} bg-opacity-5 backdrop-blur-sm -z-10 absolute  bg-opacity-10`}></div>


              <div className='flex justify-between items-center px-3  py-4 '>
              <div className="flex gap-2 justify-center items-center ">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student._id)}
                    onChange={() => toggleStudentSelection(student._id)}
                    className="w-5 h-5 z-10 cursor-pointer rounded-lg text-white bg-white bg-opacity-20 border-2 border-white focus:ring-white"
                  />
                    <h3 className="text-white font-bold text-md leading-snug line-clamp-2">
                    {student.name}
                    </h3>
              </div>
                 

              <div className="">
                <div className="bg-white text-indigo-700 text-xs font-bold px-2 py-1 rounded-full shadow backdrop-blur-md border border-white border-opacity-30 flex items-center gap-1">
                {batchMap[student.batch?.currentBatch]?.name || 'No Batch'}
                </div>
              </div>
</div>

</div>
             
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className={`${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'} px-3 py-1 rounded-full`}>
                      <span className={`text-xs font-bold ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>Student-ID: {student._id?.slice(-6)}</span>
                    </div>
                  </div>
                </div>

                
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

              
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-gray-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-3xl"></div>
            </div>
          ))}
        </div> 

    </>
  )
}

export default EvalvoPulseStudentsLook
