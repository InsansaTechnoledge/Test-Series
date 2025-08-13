import React from 'react'
import {
    Search,
    PlusSquare,
    ChevronLeft,
    ChevronRight,
    NotepadText,
    AlertTriangle,
    Eye,
    Edit,
    Trash,
  } from "lucide-react";

const EvalvoPulseBatchLook = ({
    theme,
    searchTerm,
    setSearchTerm,
    selectedYear,
    setSelectedYear,
    uniqueYears,
    canCreateBatch,
    navigate,
    totalPages,
    indexOfFirstBatch,
    indexOfLastBatch,
    filteredBatches,
    currentpage,
    paginate,
    getPageNumbers,
    currentBatch,
    canViewBatch,
    handleViewBatch,
    canEditBatch,
    handleEditBatch,
    canDeleteBatch,
    handleDeleteBatch,
  }) => {
  return (
    <>
     {/* Control Panel */}
     <div
       className={`${
         theme === "light"
           ? "bg-white border border-gray-100"
           : "bg-gray-800 border border-gray-700"
       } rounded-3xl shadow-xl p-6 mb-8`}
     >
       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
         <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
           <div className="relative w-full sm:w-auto">
             <Search
               className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                 theme === "light" ? " text-gray-400" : " text-gray-300"
               } w-5 h-5`}
             />
             <input
               className={`${
                 theme === "light"
                   ? "bg-gray-50 border-2 border-gray-200 text-gray-900 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300"
                   : "bg-gray-700 border-2 border-gray-600 text-gray-100 focus:ring-4 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-300"
               } rounded-2xl pl-12 pr-6 py-3 w-full sm:w-80`}
               placeholder="Search batches..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>

           <select
             className={`${
               theme === "light"
                 ? "bg-gray-50 border-2 border-gray-200 text-gray-900 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-300"
                 : "bg-gray-700 text-gray-100 border-2 border-gray-600 focus:ring-4 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-300"
             } rounded-2xl px-6 py-3 font-medium w-full sm:w-auto`}
             onChange={(e) => setSelectedYear(e.target.value)}
             value={selectedYear}
           >
             <option value="">All Years</option>
             {uniqueYears.map((year) => (
               <option key={year} value={year}>
                 {year}
               </option>
             ))}
           </select>
         </div>

         {canCreateBatch && (
           <button
             disabled={!canCreateBatch}
             className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-2xl font-bold transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center justify-center space-x-3 transform w-full sm:w-auto"
             onClick={() => navigate("/institute/create-batch")}
           >
             <PlusSquare className="w-5 h-5" />
             <span>Create Batch</span>
           </button>
         )}
       </div>
     </div>

     {/* Pagination Info and Controls - Only show if there are batches */}
     {filteredBatches.length > 0 && totalPages > 1 && (
       <div className={`${theme === 'light' ? 'bg-white border border-gray-100' : 'bg-gray-800 border border-gray-700'} rounded-3xl shadow-xl p-6 mb-8`}>
         <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
           <div className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>
             Showing {indexOfFirstBatch + 1} to {Math.min(indexOfLastBatch, filteredBatches.length)} of {filteredBatches.length} Batches
           </div>
           
           <div className="flex items-center space-x-2">
            
             <button
               onClick={() => paginate(currentpage - 1)}
               disabled={currentpage === 1}
               className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                 currentpage === 1
                   ? `${theme === 'light' ? 'bg-gray-100 text-gray-400' : 'bg-gray-700 text-gray-500'} cursor-not-allowed`
                   : `${theme === 'light' ? 'bg-gray-50 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600' : 'bg-gray-700 text-gray-200 hover:bg-indigo-600 hover:text-white'}`
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
                         currentpage === pageNum
                           ? 'bg-indigo-600 text-white shadow-lg'
                           : `${theme === 'light' ? 'bg-gray-50 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600' : 'bg-gray-700 text-gray-200 hover:bg-indigo-600 hover:text-white'}`
                       }`}
                     >
                       {pageNum}
                     </button>
                   )}
                 </React.Fragment>
               ))}
             </div>

             
             <button
               onClick={() => paginate(currentpage + 1)}
               disabled={currentpage === totalPages}
               className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                 currentpage === totalPages
                   ? `${theme === 'light' ? 'bg-gray-100 text-gray-400' : 'bg-gray-700 text-gray-500'} cursor-not-allowed`
                   : `${theme === 'light' ? 'bg-gray-50 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600' : 'bg-gray-700 text-gray-200 hover:bg-indigo-600 hover:text-white'}`
               }`}
             >
               Next
               <ChevronRight size={16} />
             </button>

           </div>
         </div>
       </div>
     )}

     {/* Batch Cards Grid */}
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
       {currentBatch?.map((batch, idx) => (
         <div
           key={batch._id || batch.id || idx}
           className={`group relative ${
             theme === "light"
               ? "bg-white border-gray-100"
               : "bg-gray-800 border-gray-700"
           } rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border overflow-hidden`}
           style={{
             animationDelay: `${idx * 100}ms`,
             animation: "fadeInUp 0.6s ease-out forwards",
           }}
         >
          
           <div
             className={`h-20 ${
               theme === "light"
                 ? "bg-gradient-to-r from-indigo-500 to-indigo-400"
                 : "bg-gradient-to-r from-indigo-600 to-indigo-700"
             } relative overflow-hidden shadow-md`}
           >
             <div className="flex justify-between items-center p-6 h-full">
               <div className="flex-1 min-w-0">
                 <h3 className="text-white font-bold text-xl leading-tight truncate">
                   {batch.name}
                 </h3>
               </div>

               <div className="flex-shrink-0 ml-4">
                 <div className="bg-white text-indigo-700 text-xs font-bold px-3 py-1 rounded-full shadow backdrop-blur-md border border-white border-opacity-30">
                   {batch.year}
                 </div>
               </div>
             </div>
           </div>

         
           <div
             className={`p-6 ${
               theme === "light" ? "bg-white" : "bg-gray-800"
             }`}
           >
             <div className="flex items-center justify-between mb-4">
               <div className="flex items-center space-x-2">
                 <div
                   className={`${
                     theme === "light" ? "bg-gray-100" : "bg-gray-700"
                   } px-3 py-1 rounded-full`}
                 >
                   <span
                     className={`text-xs font-bold ${
                       theme === "light" ? "text-gray-600" : "text-gray-300"
                     }`}
                   >
                     ID: {batch._id || batch.id}
                   </span>
                 </div>
               </div>
             </div>

           
             <div className="mb-6">
               {batch.syllabus_id ? (
                 <button
                   onClick={() => navigate(`/institute/syllabus/${batch.syllabus_id}`)}
                   className={`inline-flex items-center space-x-2 ${
                     theme === "light"
                       ? "text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100"
                       : "text-indigo-300 hover:text-indigo-100 bg-indigo-900 hover:bg-indigo-800"
                   } transition-colors px-4 py-2 rounded-xl w-full justify-center`}
                 >
                   <NotepadText className="w-4 h-4" />
                   <span className="text-sm font-bold">View Syllabus</span>
                 </button>
               ) : (
                 <div
                   className={`inline-flex items-center space-x-2 ${
                     theme === "light"
                       ? "text-gray-600 bg-gray-50"
                       : "text-gray-300 bg-gray-700"
                   } px-4 py-2 rounded-xl w-full justify-center`}
                 >
                   <AlertTriangle className="w-4 h-4" />
                   <div className="text-center">
                     <span className="text-sm font-bold block">
                       No Syllabus
                     </span>
                     <p
                       className={`text-xs ${
                         theme === "light"
                           ? "text-gray-400"
                           : "text-gray-500"
                       }`}
                     >
                       Subject-only batch
                     </p>
                   </div>
                 </div>
               )}
             </div>

            
             <div className="flex justify-center space-x-2">
               {canViewBatch && (
                 <button
                   disabled={!canViewBatch}
                   className={`flex-1 z-10 cursor-pointer ${
                     theme === "light"
                       ? "bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:bg-gray-50 disabled:text-gray-400"
                       : "bg-gray-700 hover:bg-gray-600 text-gray-200 disabled:bg-gray-800 disabled:text-gray-500"
                   } p-3 rounded-xl transition-all duration-300 hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
                   onClick={() => handleViewBatch(batch._id || batch.id)}
                   title="View Details"
                 >
                   <Eye className="w-4 h-4" />
                   <span className="font-medium text-sm">View</span>
                 </button>
               )}

               {canEditBatch && (
                 <button
                   disabled={!canEditBatch}
                   className={`flex-1 z-10 cursor-pointer ${
                     theme === "light"
                       ? "bg-indigo-100 hover:bg-indigo-200 text-indigo-700 disabled:bg-gray-50 disabled:text-gray-400"
                       : "bg-indigo-800 hover:bg-indigo-700 text-indigo-200 disabled:bg-gray-800 disabled:text-gray-500"
                   } p-3 rounded-xl transition-all duration-300 hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
                   onClick={() => handleEditBatch(batch._id || batch.id)}
                   title="Edit Batch"
                 >
                   <Edit className="w-4 h-4" />
                   <span className="font-medium text-sm">Edit</span>
                 </button>
               )}

               {canDeleteBatch && (
                 <button
                   disabled={!canDeleteBatch}
                   className={`${
                     theme === "light"
                       ? "bg-red-100 hover:bg-red-200 text-red-700 disabled:bg-gray-50 disabled:text-gray-400"
                       : "bg-red-800 hover:bg-red-700 text-red-200 disabled:bg-gray-800 disabled:text-gray-500"
                   } z-10 cursor-pointer p-3 rounded-xl transition-all duration-300 hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center`}
                   onClick={() => handleDeleteBatch(batch._id || batch.id)}
                   title="Delete Batch"
                 >
                   <Trash className="w-4 h-4" />
                 </button>
               )}
             </div>
           </div>

           
           <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-gray-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-3xl pointer-events-none"></div>
         </div>
       ))}
     </div>
    </>
  )
}

export default EvalvoPulseBatchLook