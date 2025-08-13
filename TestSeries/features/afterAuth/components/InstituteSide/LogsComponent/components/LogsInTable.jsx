import React, { useState, useMemo } from 'react';
import { Search, User, GraduationCap, Clock, Mail, Users, ChevronLeft, ChevronRight } from 'lucide-react';

const LogsInTable = ({ users = [], students = []}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all'); // all, faculty, student
  const [sortBy, setSortBy] = useState('name'); // name, email, lastLogin, status
  const [sortOrder, setSortOrder] = useState('asc'); // asc, desc
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Time formatting functions
  const formatISTTime = (utcTime) => {
    if (!utcTime) return "N/A";
    return new Date(utcTime).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true
    });
  };

  const timeAgo = (updatedAtUTC) => {
    if (!updatedAtUTC) return "N/A";

    const nowIST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    const updatedIST = new Date(new Date(updatedAtUTC).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

    const diffMs = nowIST - updatedIST;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);
    const diffMonth = Math.floor(diffDay / 30);

    if (diffSec < 60) return `${diffSec}s ago`;
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 30) return `${diffDay}d ago`;
    return `${diffMonth}mo ago`;
  };

  // Combine and format data
  const combinedData = useMemo(() => {
    const formattedUsers = users.map(user => ({
      ...user,
      role: 'Faculty',
      batch: 'N/A',
      type: 'user'
    }));

    console.log("tr", students)
    const formattedStudents = students.map(student => ({
      ...student,
      role: 'Student',
      batch: student.batch || 'Unknown Batch',
      type: 'student'
    }));

    return [...formattedUsers, ...formattedStudents];
  }, [users, students]);

  // Filter and search
  const filteredData = useMemo(() => {
    let filtered = combinedData;

    // Role filter
    if (filterRole !== 'all') {
      filtered = filtered.filter(item => 
        filterRole === 'faculty' ? item.type === 'user' : item.type === 'student'
      );
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.batch?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          break;
        case 'email':
          aValue = a.email?.toLowerCase() || '';
          bValue = b.email?.toLowerCase() || '';
          break;
        case 'lastLogin':
          aValue = new Date(a.lastLogin || 0);
          bValue = new Date(b.lastLogin || 0);
          break;
        case 'status':
          aValue = a.online ? 1 : 0;
          bValue = b.online ? 1 : 0;
          break;
        default:
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [combinedData, searchTerm, filterRole, sortBy, sortOrder]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRole, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const getPaginationRange = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, email, or batch..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Items per page */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Show:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* Role Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterRole('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterRole === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({combinedData.length})
              </button>
              <button
                onClick={() => setFilterRole('faculty')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterRole === 'faculty'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Faculty ({users.length})
              </button>
              <button
                onClick={() => setFilterRole('student')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterRole === 'student'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Students ({students.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Name {getSortIcon('name')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center gap-2">
                    Email {getSortIcon('email')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-2">
                    Status {getSortIcon('status')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('lastLogin')}
                >
                  <div className="flex items-center gap-2">
                    Last Login {getSortIcon('lastLogin')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-1">No users found</p>
                    <p className="text-sm">Try adjusting your search or filter criteria</p>
                  </td>
                </tr>
              ) : (
                paginatedData.map((item) => (
                  <tr key={`${item.type}-${item.id}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {item.type === 'student' ? (
                            <GraduationCap className="w-8 h-8 text-blue-500" />
                          ) : (
                            <User className="w-8 h-8 text-indigo-500" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.name || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {item.email || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.type === 'student' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {item.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.role === 'Faculty' ? <span className='text-red-600'>Not applicable</span> :  item.batch}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          item.online ? 'bg-green-400' : 'bg-gray-300'
                        }`}></div>
                        <span className={`text-sm font-medium ${
                          item.online ? 'text-green-800' : 'text-gray-500'
                        }`}>
                          {item.online ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        <div>
                          <div className="font-medium">{timeAgo(item.lastLogin)}</div>
                          <div className="text-xs text-gray-500">
                            {formatISTTime(item.lastLogin)}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredData.length > 0 && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Results info */}
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} results
              </div>

              {/* Pagination controls */}
              <div className="flex items-center space-x-2">
                {/* Previous button */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg border transition-colors ${
                    currentPage === 1
                      ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page numbers */}
                {totalPages <= 7 ? (
                  // Show all pages if total is 7 or less
                  Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))
                ) : (
                  // Show smart pagination for more than 7 pages
                  getPaginationRange().map((page, index) => (
                    page === '...' ? (
                      <span key={`dots-${index}`} className="px-3 py-2 text-gray-500">...</span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          currentPage === page
                            ? 'bg-indigo-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  ))
                )}

                {/* Next button */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg border transition-colors ${
                    currentPage === totalPages
                      ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer with total results count */}
      {filteredData.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          Total: {filteredData.length} of {combinedData.length} users
        </div>
      )}
    </div>
  );
};



export default LogsInTable;