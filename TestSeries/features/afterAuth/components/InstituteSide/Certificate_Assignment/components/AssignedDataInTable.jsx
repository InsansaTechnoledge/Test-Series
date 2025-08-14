import React, { useState, useMemo, useCallback } from 'react';
import { Pencil, Trash2, Search, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';

const AssignedDataInTable = ({ 
  AssignedExamsOrContest = [], 
  onEdit, 
  onDelete, 
  certificateTemplates = [] 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [activeTab, setActiveTab] = useState('exams');

  const ReturnCertificateName = useCallback((id) => {
    const template = certificateTemplates.find((e) => e?._id === id);
    return template?.name;
  }, [certificateTemplates]);

  // Memoized filtered and sorted data
  const processedData = useMemo(() => {
    const exams = AssignedExamsOrContest.filter(item => item.type === 'exam');
    const contests = AssignedExamsOrContest.filter(item => item.type === 'contest');
    
    const filterAndSort = (items) => {
      // Filter by search term
      let filtered = items.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ReturnCertificateName(item.certificate_template_mongo_id)?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Sort data
      if (sortConfig.key) {
        filtered.sort((a, b) => {
          let aValue = a[sortConfig.key];
          let bValue = b[sortConfig.key];
          
          if (sortConfig.key === 'certificateName') {
            aValue = ReturnCertificateName(a.certificate_template_mongo_id) || '';
            bValue = ReturnCertificateName(b.certificate_template_mongo_id) || '';
          }
          
          if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
          return 0;
        });
      }

      return filtered;
    };

    return {
      exams: filterAndSort(exams),
      contests: filterAndSort(contests)
    };
  }, [AssignedExamsOrContest, searchTerm, sortConfig, ReturnCertificateName]);

  // Get current page data
  const getCurrentPageData = (data) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const currentData = activeTab === 'exams' ? processedData.exams : processedData.contests;
  const paginatedData = getCurrentPageData(currentData);
  const totalPages = Math.ceil(currentData.length / itemsPerPage);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const clearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const TableHeader = ({ title, sortKey }) => (
    <th 
      className="px-4 py-3 border-b border-indigo-200 cursor-pointer hover:bg-indigo-100 transition-colors"
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium">{title}</span>
        {sortConfig.key === sortKey && (
          <span className="ml-1">
            {sortConfig.direction === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  );

  const TableRow = ({ item, index }) => (
    <tr key={item.id || index} className="hover:bg-indigo-50 transition-colors">
      <td className="px-4 py-3 border-b border-indigo-100">
        <div className="flex items-center">
          {ReturnCertificateName(item.certificate_template_mongo_id) ? (
            <span className="font-medium text-gray-900">
              {ReturnCertificateName(item.certificate_template_mongo_id)}
            </span>
          ) : (
            <span className="text-gray-400 italic">Not Assigned</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 border-b border-indigo-100">
        <span className="font-medium text-gray-900">{item.name}</span>
      </td>
      <td className="px-4 py-3 border-b border-indigo-100">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit?.(item)}
            className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 rounded-md transition-colors"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete?.(item)}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-md transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );

  const Pagination = () => (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-indigo-200">
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700">
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, currentData.length)} to{' '}
          {Math.min(currentPage * itemsPerPage, currentData.length)} of {currentData.length} results
        </span>
        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-md px-2 py-1 text-sm"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
          <option value={100}>100 per page</option>
        </select>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <div className="flex gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  currentPage === pageNum
                    ? 'bg-indigo-600 text-white'
                    : 'text-indigo-600 hover:bg-indigo-100'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto mt-12 mb-12">
        {/* Summary Stats */}
      <div className="mt-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border border-indigo-200">
          <div className="text-2xl font-bold text-indigo-600">{processedData.exams.length}</div>
          <div className="text-sm text-gray-600">Total Exams</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-indigo-200">
          <div className="text-2xl font-bold text-indigo-600">{processedData.contests.length}</div>
          <div className="text-sm text-gray-600">Total Contests</div>
        </div>
       
      </div>

      {/* Header Section */}
      <div className="bg-white rounded-t-lg border border-indigo-200 border-b-0">
        <div className="p-6 border-b border-indigo-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Assigned Exams & Contests</h2>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or certificate..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-indigo-200">
          <button
            onClick={() => handleTabChange('exams')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'exams'
                ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Exams ({processedData.exams.length})
          </button>
          <button
            onClick={() => handleTabChange('contests')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'contests'
                ? 'bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Contests ({processedData.contests.length})
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-indigo-200 border-t-0 rounded-b-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-indigo-50 text-left text-indigo-800">
              <tr>
                <TableHeader title="Certificate Name" sortKey="certificateName" />
                <TableHeader title={`${activeTab === 'exams' ? 'Exam' : 'Contest'} Name`} sortKey="name" />
                <th className="px-4 py-3 border-b border-indigo-200">
                  <span className="font-medium">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-100">
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <TableRow key={item.id || index} item={item} index={index} />
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-12">
                    <div className="text-gray-400">
                      <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">No {activeTab} found</p>
                      <p className="text-sm">
                        {searchTerm
                          ? `No ${activeTab} match your search criteria.`
                          : `No ${activeTab} have been assigned yet.`
                        }
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {paginatedData.length > 0 && totalPages > 1 && <Pagination />}
      </div>

      
    </div>
  );
};

export default AssignedDataInTable;