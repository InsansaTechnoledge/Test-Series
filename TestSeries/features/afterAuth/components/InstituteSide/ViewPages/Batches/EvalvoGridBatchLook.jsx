import React from 'react';
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
  Calendar,
  Hash,
  BookOpen,
  Users,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

const EvalvoGridBatchLook = ({
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
  const [sortField, setSortField] = React.useState('name');
  const [sortDirection, setSortDirection] = React.useState('asc');

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort the current batch data
  const sortedCurrentBatch = React.useMemo(() => {
    return [...currentBatch].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle string sorting
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [currentBatch, sortField, sortDirection]);

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return <ChevronUp className="w-4 h-4 opacity-30" />;
    }
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4 text-indigo-600" /> : 
      <ChevronDown className="w-4 h-4 text-indigo-600" />;
  };

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

      {/* Table Container */}
      <div
        className={`${
          theme === "light"
            ? "bg-white border border-gray-100"
            : "bg-gray-800 border border-gray-700"
        } rounded-3xl shadow-xl overflow-hidden mb-8`}
      >
        {/* Table Header Info */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
                Batch Directory
              </h2>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                Showing {indexOfFirstBatch + 1} to {Math.min(indexOfLastBatch, filteredBatches.length)} of {filteredBatches.length} batches
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                Sort by:
              </span>
              <span className={`text-sm font-bold ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-400'} capitalize`}>
                {sortField} ({sortDirection})
              </span>
            </div>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700/50'}`}>
              <tr>
                <th 
                  className={`px-6 py-4 text-left text-xs font-bold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors`}
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Batch Name</span>
                    <SortIcon field="name" />
                  </div>
                </th>
                <th 
                  className={`px-6 py-4 text-left text-xs font-bold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors`}
                  onClick={() => handleSort('year')}
                >
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Year</span>
                    <SortIcon field="year" />
                  </div>
                </th>
                <th className={`px-6 py-4 text-left text-xs font-bold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} uppercase tracking-wider`}>
                  <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4" />
                    <span>Batch ID</span>
                  </div>
                </th>
                <th className={`px-6 py-4 text-center text-xs font-bold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} uppercase tracking-wider`}>
                  <div className="flex items-center justify-center space-x-2">
                    <NotepadText className="w-4 h-4" />
                    <span>Syllabus</span>
                  </div>
                </th>
                <th className={`px-6 py-4 text-center text-xs font-bold ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} uppercase tracking-wider`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`${theme === 'light' ? 'bg-white' : 'bg-gray-800'} divide-y ${theme === 'light' ? 'divide-gray-200' : 'divide-gray-700'}`}>
              {sortedCurrentBatch.map((batch, idx) => (
                <tr 
                  key={batch._id || batch.id || idx}
                  className={`${theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-700/50'} transition-colors duration-200`}
                >
                  {/* Batch Name */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 ${theme === 'light' ? 'bg-indigo-100' : 'bg-indigo-900'} rounded-xl flex items-center justify-center mr-4`}>
                        <BookOpen className={`w-6 h-6 ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-300'}`} />
                      </div>
                      <div>
                        <div className={`text-sm font-bold ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>
                          {batch.name}
                        </div>
                        <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                          Created batch
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Year */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      theme === 'light' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-green-900 text-green-300'
                    }`}>
                      <Calendar className="w-4 h-4 mr-2" />
                      {batch.year}
                    </div>
                  </td>

                  {/* Batch ID */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-mono ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'} px-3 py-1 rounded-lg inline-block`}>
                      {batch._id || batch.id}
                    </div>
                  </td>

                  {/* Syllabus Status */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {batch.syllabus_id ? (
                      <button
                        onClick={() => navigate(`/institute/syllabus/${batch.syllabus_id}`)}
                        className={`inline-flex items-center space-x-2 ${
                          theme === "light"
                            ? "text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100"
                            : "text-indigo-300 hover:text-indigo-100 bg-indigo-900 hover:bg-indigo-800"
                        } transition-colors px-3 py-2 rounded-xl text-sm font-medium`}
                      >
                        <NotepadText className="w-4 h-4" />
                        <span>Available</span>
                      </button>
                    ) : (
                      <div
                        className={`inline-flex items-center space-x-2 ${
                          theme === "light"
                            ? "text-gray-600 bg-gray-50"
                            : "text-gray-300 bg-gray-700"
                        } px-3 py-2 rounded-xl text-sm font-medium`}
                      >
                        <AlertTriangle className="w-4 h-4" />
                        <span>Not Available</span>
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2">
                      {canViewBatch && (
                        <button
                          disabled={!canViewBatch}
                          className={`${
                            theme === "light"
                              ? "bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:bg-gray-50 disabled:text-gray-400"
                              : "bg-gray-700 hover:bg-gray-600 text-gray-200 disabled:bg-gray-800 disabled:text-gray-500"
                          } p-2 rounded-xl transition-all duration-300 hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed`}
                          onClick={() => handleViewBatch(batch._id || batch.id)}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}

                      {canEditBatch && (
                        <button
                          disabled={!canEditBatch}
                          className={`${
                            theme === "light"
                              ? "bg-indigo-100 hover:bg-indigo-200 text-indigo-700 disabled:bg-gray-50 disabled:text-gray-400"
                              : "bg-indigo-800 hover:bg-indigo-700 text-indigo-200 disabled:bg-gray-800 disabled:text-gray-500"
                          } p-2 rounded-xl transition-all duration-300 hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed`}
                          onClick={() => handleEditBatch(batch._id || batch.id)}
                          title="Edit Batch"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}

                      {canDeleteBatch && (
                        <button
                          disabled={!canDeleteBatch}
                          className={`${
                            theme === "light"
                              ? "bg-red-100 hover:bg-red-200 text-red-700 disabled:bg-gray-50 disabled:text-gray-400"
                              : "bg-red-800 hover:bg-red-700 text-red-200 disabled:bg-gray-800 disabled:text-gray-500"
                          } p-2 rounded-xl transition-all duration-300 hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed`}
                          onClick={() => handleDeleteBatch(batch._id || batch.id)}
                          title="Delete Batch"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty State for Table */}
          {sortedCurrentBatch.length === 0 && (
            <div className="text-center py-16">
              <div className={`w-20 h-20 mx-auto ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-700'} rounded-full flex items-center justify-center mb-4`}>
                <Search className={`w-8 h-8 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              <h3 className={`text-lg font-medium ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'} mb-2`}>
                No batches found
              </h3>
              <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination - Only show if there are batches and multiple pages */}
      {filteredBatches.length > 0 && totalPages > 1 && (
        <div className={`${theme === 'light' ? 'bg-white border border-gray-100' : 'bg-gray-800 border border-gray-700'} rounded-3xl shadow-xl p-6`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>
              Page {currentpage} of {totalPages} • {filteredBatches.length} total batches
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
    </>
  );
};

export default EvalvoGridBatchLook