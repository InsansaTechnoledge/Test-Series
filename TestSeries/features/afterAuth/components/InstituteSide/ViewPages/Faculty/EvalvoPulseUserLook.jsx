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
  Trash
} from 'lucide-react';
import RefreshButton from '../../../../utility/RefreshButton';
// import RefreshButton from './RefreshButton'; 
RefreshButton

const EvalvoPulseUserLook = ({
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
            ? 'bg-white border border-gray-100'
            : 'bg-gray-800 border border-gray-700'
        } rounded-3xl shadow-xl p-6 mb-8`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Search + Filter */}
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <Search
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                  theme === 'light' ? 'text-gray-400' : 'text-gray-300'
                } w-5 h-5`}
              />
              <input
                className={`${
                  theme === 'light'
                    ? 'bg-gray-50 border-2 border-gray-200 text-gray-900 focus:ring-4 focus:ring-blue-200 focus:border-blue-400'
                    : 'bg-gray-700 border-2 border-gray-600 text-gray-100 focus:ring-4 focus:ring-blue-400 focus:border-blue-400'
                } rounded-2xl pl-12 pr-6 py-3 transition-all duration-300 w-80`}
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Batch Filter */}
            <select
              className={`${
                theme === 'light'
                  ? 'bg-gray-50 border-2 border-gray-200 text-gray-900 focus:ring-4 focus:ring-blue-200 focus:border-blue-400'
                  : 'bg-gray-700 border-2 border-gray-600 text-gray-100 focus:ring-4 focus:ring-blue-400 focus:border-blue-400'
              } rounded-2xl px-6 py-3 transition-all duration-300 font-medium`}
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
          <div className="flex items-center space-x-4">
            <RefreshButton refreshFunction={refreshFunction} />
            {canCreateUser && (
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center space-x-3 transform"
                onClick={() => navigate('/institute/create-user')}
              >
                <PlusSquare className="w-5 h-5" />
                <span>Add User</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div
          className={`${
            theme === 'light'
              ? 'bg-white border border-gray-100'
              : 'bg-gray-800 border border-gray-700'
          } rounded-3xl shadow-xl p-6 mb-8`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div
              className={`text-sm font-medium ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-200'
              }`}
            >
              Showing {indexOfFirstUser + 1} to{' '}
              {Math.min(indexOfLastUser, filteredUsers.length)} of{' '}
              {filteredUsers.length} students
            </div>

            <div className="flex items-center space-x-2">
              {/* Prev */}
              <button
                onClick={() => paginate(currentpage - 1)}
                disabled={currentpage === 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  currentpage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-50 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
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
                      <span className="px-3 py-2 text-gray-500">...</span>
                    ) : (
                      <button
                        onClick={() => paginate(pageNum)}
                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                          currentpage === pageNum
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'bg-gray-50 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
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
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  currentpage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-50 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                }`}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {currentUsers?.map((userItem, idx) => (
          <div
            key={userItem._id || idx}
            className={`group relative ${
              theme === 'light'
                ? 'bg-white border-gray-100'
                : 'bg-gray-800 border-gray-700'
            } rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border overflow-hidden`}
            style={{
              animationDelay: `${idx * 100}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
          >
            {/* Header */}
            <div
              className={`h-16 ${
                theme === 'light'
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-400'
                  : 'bg-gradient-to-r from-indigo-600 to-indigo-700'
              } rounded-t-2xl relative overflow-hidden shadow-md`}
            >
              <div className="flex justify-between items-center p-6">
                <h3 className="text-white font-bold text-xl leading-snug line-clamp-2">
                  {userItem.name}
                </h3>
                <div className="bg-white text-indigo-700 text-xs font-bold px-3 py-1 rounded-full shadow border border-white border-opacity-30 flex items-center gap-1">
                  <UserCheck className="w-4 h-4" /> faculty
                </div>
              </div>
            </div>

            {/* Role */}
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div
                  className={`${
                    theme === 'light'
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200'
                      : 'bg-gradient-to-r from-blue-900 to-blue-800 border-blue-700'
                  } px-4 py-2 rounded-full border`}
                >
                  {roleMap[userItem?.roleId] ? (
                    <span
                      className={`text-sm font-bold ${
                        theme === 'light' ? 'text-blue-700' : 'text-blue-200'
                      } flex items-center`}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      {roleMap[userItem.roleId].name}
                    </span>
                  ) : (
                    <span
                      className={`text-sm font-bold ${
                        theme === 'light' ? 'text-red-500' : 'text-red-400'
                      } flex items-center`}
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      No role assigned
                    </span>
                  )}
                </div>
              </div>

              {/* Assigned Batches */}
              <div className="mb-6">
                <p
                  className={`text-sm font-semibold ${
                    theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                  } mb-3`}
                >
                  Assigned Batches:
                </p>
                <div className="flex justify-center flex-wrap gap-2">
                  {userItem.batch?.length > 0 ? (
                    expandedUsers[userItem._id] ? (
                      <>
                        {userItem.batch.map((batch, batchIdx) => (
                          <div
                            key={batchIdx}
                            className={`${
                              theme === 'light'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-blue-900 text-blue-200 border-blue-700'
                            } px-3 py-1 rounded-full text-xs font-medium border`}
                          >
                            {batchMap[batch]?.name} - {batchMap[batch]?.year}
                          </div>
                        ))}
                        {userItem.batch.length > 2 && (
                          <button
                            className={`text-xs ${
                              theme === 'light'
                                ? 'text-blue-600 hover:text-blue-800'
                                : 'text-blue-400 hover:text-blue-200'
                            } font-medium underline`}
                            onClick={() => handleExpandedUsers(userItem._id)}
                          >
                            Show less
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        {userItem.batch.slice(0, 2).map((batch, batchIdx) => (
                          <div
                            key={batchIdx}
                            className={`${
                              theme === 'light'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-blue-900 text-blue-200 border-blue-700'
                            } px-3 py-1 rounded-full text-xs font-medium border`}
                          >
                            {batchMap[batch]?.name} - {batchMap[batch]?.year}
                          </div>
                        ))}
                        {userItem.batch.length > 2 && (
                          <button
                            className={`text-xs ${
                              theme === 'light'
                                ? 'text-blue-600 hover:text-blue-800'
                                : 'text-blue-400 hover:text-blue-200'
                            } font-medium underline`}
                            onClick={() => handleExpandedUsers(userItem._id)}
                          >
                            +{userItem.batch.length - 2} more
                          </button>
                        )}
                      </>
                    )
                  ) : (
                    <div
                      className={`${
                        theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                      } text-sm italic`}
                    >
                      No batches assigned
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-3">
                {canViewUser && (
                  <button
                    onClick={() =>
                      navigate('/institute/user-detail', {
                        state: { userId: userItem._id }
                      })
                    }
                    className={`flex-1 z-10 ${
                      theme === 'light'
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                    } p-3 rounded-xl flex items-center justify-center gap-2`}
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">View</span>
                  </button>
                )}

                {canEditUser && (
                  <button
                    onClick={() =>
                      navigate(`/institute/user-edit/${userItem._id}`)
                    }
                    className={`flex-1 z-10 ${
                      theme === 'light'
                        ? 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                        : 'bg-blue-800 hover:bg-blue-700 text-blue-200'
                    } p-3 rounded-xl flex items-center justify-center gap-2`}
                  >
                    <Edit className="w-4 h-4" />
                    <span className="text-sm font-medium">Edit</span>
                  </button>
                )}

                {canDeleteUser && (
                  <button
                    onClick={() => {
                      setShowDeleteModal(true);
                      setUserIdToDelete(userItem._id);
                    }}
                    className={`z-10 ${
                      theme === 'light'
                        ? 'bg-red-100 hover:bg-red-200 text-red-700'
                        : 'bg-red-800 hover:bg-red-700 text-red-200'
                    } p-3 rounded-xl hover:scale-105`}
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default EvalvoPulseUserLook;
