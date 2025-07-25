import React, { useState, useMemo } from 'react';
import ChartContainer from './constants/ChartContainer';


const SummaryTable = ({ data = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('count');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showTopN, setShowTopN] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const subjectData = useMemo(() => {
    if (!data || data.length === 0) return { all: [], filtered: [], paginated: [] };
    
    const counts = {};
    data.forEach(q => {
      const subject = q.subject || 'Unknown';
      counts[subject] = (counts[subject] || 0) + 1;
    });
    
    const allSubjects = Object.entries(counts)
      .map(([subject, count]) => ({ 
        subject, 
        count,
        percentage: ((count / data.length) * 100).toFixed(1)
      }))
      .sort((a, b) => {
        let compareValue = 0;
        if (sortBy === 'count') {
          compareValue = a.count - b.count;
        } else if (sortBy === 'subject') {
          compareValue = a.subject.localeCompare(b.subject);
        } else if (sortBy === 'percentage') {
          compareValue = parseFloat(a.percentage) - parseFloat(b.percentage);
        }
        return sortOrder === 'asc' ? compareValue : -compareValue;
      });
    
    // Filter by search term
    const filtered = searchTerm 
      ? allSubjects.filter(item => 
          item.subject.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : allSubjects.slice(0, showTopN);
    
    // Pagination
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);
    
    return {
      all: allSubjects,
      filtered: filtered,
      paginated: paginated,
      totalPages: totalPages
    };
  }, [data, searchTerm, sortBy, sortOrder, showTopN, currentPage]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (subjectData.totalPages <= 1) return null;
    
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(subjectData.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    return (
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-700">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, subjectData.filtered.length)} of {subjectData.filtered.length} entries
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          
          {startPage > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                1
              </button>
              {startPage > 2 && <span className="px-2 text-gray-500">...</span>}
            </>
          )}
          
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 text-sm border rounded-md ${
                currentPage === page 
                  ? 'bg-indigo-600 text-white border-indigo-600' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          {endPage < subjectData.totalPages && (
            <>
              {endPage < subjectData.totalPages - 1 && <span className="px-2 text-gray-500">...</span>}
              <button
                onClick={() => handlePageChange(subjectData.totalPages)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {subjectData.totalPages}
              </button>
            </>
          )}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === subjectData.totalPages}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  if (!data || data.length === 0) {
    return (
      <ChartContainer title="Subject Summary">
        <div className="flex items-center justify-center h-32 text-gray-500">
          No data available
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer title={`Subject Summary (${data.length} total questions)`}>
      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Search:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Filter subjects..."
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        {!searchTerm && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Show Top:</label>
            <select 
              value={showTopN} 
              onChange={(e) => {
                setShowTopN(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
              <option value={500}>All</option>
            </select>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                onClick={() => handleSort('subject')}
              >
                <div className="flex items-center gap-1">
                  Subject {getSortIcon('subject')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                onClick={() => handleSort('count')}
              >
                <div className="flex items-center gap-1">
                  Question Count {getSortIcon('count')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                onClick={() => handleSort('percentage')}
              >
                <div className="flex items-center gap-1">
                  Percentage {getSortIcon('percentage')}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-indigo-600 uppercase tracking-wider">
                Visual
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subjectData.paginated.map((item, index) => (
              <tr key={`${item.subject}-${index}`} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  <div className="max-w-xs truncate" title={item.subject}>
                    {item.subject}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-medium">
                  {item.count.toLocaleString()}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-medium">
                  {item.percentage}%
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2 max-w-24">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min(parseFloat(item.percentage), 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {renderPagination()}

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-indigo-600">Total Subjects</div>
          <div className="text-2xl font-bold text-indigo-900">{subjectData.all.length}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-green-600">
            {searchTerm ? 'Matching' : 'Showing'}
          </div>
          <div className="text-2xl font-bold text-green-900">{subjectData.filtered.length}</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-purple-600">Total Questions</div>
          <div className="text-2xl font-bold text-purple-900">{data.length.toLocaleString()}</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-orange-600">Avg per Subject</div>
          <div className="text-2xl font-bold text-orange-900">
            {subjectData.all.length > 0 ? Math.round(data.length / subjectData.all.length) : 0}
          </div>
        </div>
      </div>
    </ChartContainer>
  );
};

export default SummaryTable;