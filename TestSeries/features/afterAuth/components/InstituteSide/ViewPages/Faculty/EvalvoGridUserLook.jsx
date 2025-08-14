import React from 'react';
import {
  Search,
  PlusSquare,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Shield,
  AlertTriangle,
  Eye,
  Edit,
  Trash,
  Users
} from 'lucide-react';
import RefreshButton from '../../../../utility/RefreshButton';

const EvalvoGridUserLook = ({
  theme,
  searchTerm,
  setSearchTerm,
  batches,
  selectedBatch,
  setSelectedBatch,
  refreshFunction,
  canCreateUser,
  navigate,
  totalPages,
  indexOfFirstUser,
  indexOfLastUser,
  filteredUsers,
  currentpage,
  paginate,
  getPageNumbers,
  currentUsers,
  roleMap,
  expandedUsers,
  handleExpandedUsers,
  batchMap,
  canViewUser,
  canEditUser,
  canDeleteUser,
  setShowDeleteModal,
  setUserIdToDelete
}) => {
  return (
    <>
      {/* Control Panel */}
      <div
        className={`${
          theme === 'light'
            ? 'bg-white border border-gray-200'
            : 'bg-gray-800 border border-gray-700'
        } rounded-xl shadow-lg p-6 mb-6`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search + Filter */}
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  theme === 'light' ? 'text-gray-400' : 'text-gray-300'
                } w-4 h-4`}
              />
              <input
                className={`${
                  theme === 'light'
                    ? 'bg-gray-50 border border-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                    : 'bg-gray-700 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                } rounded-lg pl-10 pr-4 py-2.5 transition-all duration-200 w-80`}
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Batch Filter */}
            <select
              className={`${
                theme === 'light'
                  ? 'bg-gray-50 border border-gray-200 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  : 'bg-gray-700 border border-gray-600 text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              } rounded-lg px-4 py-2.5 transition-all duration-200 font-medium`}
              onChange={(e) => setSelectedBatch(e.target.value)}
              value={selectedBatch}
            >
              <option value="">All Batches</option>
              {batches?.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.name}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <RefreshButton refreshFunction={refreshFunction} />
            {canCreateUser && (
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 hover:shadow-lg flex items-center space-x-2"
                onClick={() => navigate('/institute/create-user')}
              >
                <PlusSquare className="w-4 h-4" />
                <span>Add User</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div
        className={`${
          theme === 'light'
            ? 'bg-white border border-gray-200'
            : 'bg-gray-800 border border-gray-700'
        } rounded-xl shadow-lg overflow-hidden`}
      >
        {/* Table Header */}
        <div
          className={`${
            theme === 'light'
              ? 'bg-gray-50 border-b border-gray-200'
              : 'bg-gray-700 border-b border-gray-600'
          } px-6 py-4`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className={`w-5 h-5 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`} />
              <h2 className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>
                User Management
              </h2>
            </div>
            {totalPages > 0 && (
              <div
                className={`text-sm font-medium ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                }`}
              >
                Showing {indexOfFirstUser + 1} to{' '}
                {Math.min(indexOfLastUser, filteredUsers.length)} of{' '}
                {filteredUsers.length} users
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className={`${
                  theme === 'light'
                    ? 'bg-gray-50 border-b border-gray-200'
                    : 'bg-gray-700 border-b border-gray-600'
                }`}
              >
                <th
                  className={`text-left px-6 py-3 text-xs font-medium ${
                    theme === 'light' ? 'text-gray-500' : 'text-gray-300'
                  } uppercase tracking-wider`}
                >
                  Name
                </th>
                <th
                  className={`text-left px-6 py-3 text-xs font-medium ${
                    theme === 'light' ? 'text-gray-500' : 'text-gray-300'
                  } uppercase tracking-wider`}
                >
                  Role
                </th>
                <th
                  className={`text-left px-6 py-3 text-xs font-medium ${
                    theme === 'light' ? 'text-gray-500' : 'text-gray-300'
                  } uppercase tracking-wider`}
                >
                  Assigned Batches
                </th>
                <th
                  className={`text-left px-6 py-3 text-xs font-medium ${
                    theme === 'light' ? 'text-gray-500' : 'text-gray-300'
                  } uppercase tracking-wider`}
                >
                  Type
                </th>
                <th
                  className={`text-center px-6 py-3 text-xs font-medium ${
                    theme === 'light' ? 'text-gray-500' : 'text-gray-300'
                  } uppercase tracking-wider`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              className={`${
                theme === 'light' ? 'bg-white divide-y divide-gray-200' : 'bg-gray-800 divide-y divide-gray-700'
              }`}
            >
              {currentUsers?.map((userItem, idx) => (
                <tr
                  key={userItem._id || idx}
                  className={`${
                    theme === 'light'
                      ? 'hover:bg-gray-50'
                      : 'hover:bg-gray-700'
                  } transition-colors duration-150`}
                >
                  {/* Name */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full ${
                          theme === 'light'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-blue-900 text-blue-300'
                        } flex items-center justify-center font-semibold text-sm mr-3`}
                      >
                        {userItem.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div
                          className={`text-sm font-medium ${
                            theme === 'light' ? 'text-gray-900' : 'text-gray-100'
                          }`}
                        >
                          {userItem.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {roleMap[userItem?.roleId] ? (
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 mr-2 text-blue-500" />
                        <span
                          className={`text-sm font-medium ${
                            theme === 'light' ? 'text-gray-900' : 'text-gray-100'
                          }`}
                        >
                          {roleMap[userItem.roleId].name}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
                        <span
                          className={`text-sm ${
                            theme === 'light' ? 'text-red-600' : 'text-red-400'
                          }`}
                        >
                          No role assigned
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Assigned Batches */}
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {userItem.batch?.length > 0 ? (
                        expandedUsers[userItem._id] ? (
                          <>
                            {userItem.batch.map((batch, batchIdx) => (
                              <span
                                key={batchIdx}
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  theme === 'light'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-blue-900 text-blue-200'
                                }`}
                              >
                                {batchMap[batch]?.name} - {batchMap[batch]?.year}
                              </span>
                            ))}
                            {userItem.batch.length > 3 && (
                              <button
                                className={`text-xs ${
                                  theme === 'light'
                                    ? 'text-blue-600 hover:text-blue-800'
                                    : 'text-blue-400 hover:text-blue-200'
                                } font-medium underline ml-1`}
                                onClick={() => handleExpandedUsers(userItem._id)}
                              >
                                Show less
                              </button>
                            )}
                          </>
                        ) : (
                          <>
                            {userItem.batch.slice(0, 3).map((batch, batchIdx) => (
                              <span
                                key={batchIdx}
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  theme === 'light'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-blue-900 text-blue-200'
                                }`}
                              >
                                {batchMap[batch]?.name} - {batchMap[batch]?.year}
                              </span>
                            ))}
                            {userItem.batch.length > 3 && (
                              <button
                                className={`text-xs ${
                                  theme === 'light'
                                    ? 'text-blue-600 hover:text-blue-800'
                                    : 'text-blue-400 hover:text-blue-200'
                                } font-medium underline ml-1`}
                                onClick={() => handleExpandedUsers(userItem._id)}
                              >
                                +{userItem.batch.length - 3} more
                              </button>
                            )}
                          </>
                        )
                      ) : (
                        <span
                          className={`text-sm italic ${
                            theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                          }`}
                        >
                          No batches assigned
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Type */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        theme === 'light'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-green-900 text-green-200'
                      }`}
                    >
                      <UserCheck className="w-3 h-3 mr-1" />
                      Faculty
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2">
                      {canViewUser && (
                        <button
                          onClick={() =>
                            navigate('/institute/user-detail', {
                              state: { userId: userItem._id }
                            })
                          }
                          className={`p-2 rounded-lg transition-colors duration-200 ${
                            theme === 'light'
                              ? 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                              : 'text-gray-300 hover:bg-gray-600 hover:text-gray-100'
                          }`}
                          title="View User"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}

                      {canEditUser && (
                        <button
                          onClick={() =>
                            navigate(`/institute/user-edit/${userItem._id}`)
                          }
                          className={`p-2 rounded-lg transition-colors duration-200 ${
                            theme === 'light'
                              ? 'text-blue-600 hover:bg-blue-100 hover:text-blue-800'
                              : 'text-blue-400 hover:bg-blue-900 hover:text-blue-200'
                          }`}
                          title="Edit User"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}

                      {canDeleteUser && (
                        <button
                          onClick={() => {
                            setShowDeleteModal(true);
                            setUserIdToDelete(userItem._id);
                          }}
                          className={`p-2 rounded-lg transition-colors duration-200 ${
                            theme === 'light'
                              ? 'text-red-600 hover:bg-red-100 hover:text-red-800'
                              : 'text-red-400 hover:bg-red-900 hover:text-red-200'
                          }`}
                          title="Delete User"
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
        </div>

        {/* Empty State */}
        {(!currentUsers || currentUsers.length === 0) && (
          <div className="text-center py-12">
            <Users
              className={`mx-auto h-12 w-12 ${
                theme === 'light' ? 'text-gray-400' : 'text-gray-500'
              }`}
            />
            <h3
              className={`mt-2 text-sm font-medium ${
                theme === 'light' ? 'text-gray-900' : 'text-gray-100'
              }`}
            >
              No users found
            </h3>
            <p
              className={`mt-1 text-sm ${
                theme === 'light' ? 'text-gray-500' : 'text-gray-400'
              }`}
            >
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div
          className={`${
            theme === 'light'
              ? 'bg-white border border-gray-200'
              : 'bg-gray-800 border border-gray-700'
          } rounded-xl shadow-lg mt-6 p-4`}
        >
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              {/* Prev */}
              <button
                onClick={() => paginate(currentpage - 1)}
                disabled={currentpage === 1}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentpage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : theme === 'light'
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                }`}
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {getPageNumbers().map((pageNum, index) => (
                  <React.Fragment key={index}>
                    {pageNum === '...' ? (
                      <span
                        className={`px-3 py-2 ${
                          theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                        }`}
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        onClick={() => paginate(pageNum)}
                        className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                          currentpage === pageNum
                            ? 'bg-blue-600 text-white shadow-lg'
                            : theme === 'light'
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Next */}
              <button
                onClick={() => paginate(currentpage + 1)}
                disabled={currentpage === totalPages}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentpage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : theme === 'light'
                    ? 'bg-indigo-600 text-gray-700 hover:bg-gray-200'
                    : 'bg-indigo-400 text-gray-200 hover:bg-gray-600'
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

export default EvalvoGridUserLook;