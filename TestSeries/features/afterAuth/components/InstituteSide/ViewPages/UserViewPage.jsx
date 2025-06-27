import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCachedUser } from '../../../../../hooks/useCachedUser';
import { useCachedRoleGroup } from '../../../../../hooks/useCachedRoleGroup';
import { useCachedBatches } from '../../../../../hooks/useCachedBatches';
import { User, Mail, Users, BookOpen, Shield, Hash, Edit, Trash, ArrowLeft, Crown, Sparkles, Calendar, MapPin } from 'lucide-react';
import BackButton from '../../../../constants/BackButton';
import { useState } from 'react';
import DeleteUserModal from '../../../utility/DeleteUserModal';
import { useTheme } from '../../../../../hooks/useTheme';
import { useUser } from '../../../../../contexts/currentUserContext';

const UserViewPage = () => {
  const location = useLocation();
  const userId = location.state.userId

  const { userMap } = useCachedUser();
  const { roleMap } = useCachedRoleGroup();
  const { batchMap } = useCachedBatches();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { hasRoleAccess } = useUser();
  const canEditUser = hasRoleAccess({ keyFromPageOrAction: 'actions.editUser', location: location.pathname });
  const canDeleteUser = hasRoleAccess({ keyFromPageOrAction: 'actions.deleteUser', location: location.pathname });


  const userData = userMap[userId]

  const { theme } = useTheme();

  const batchNames = userData.batch.map((batchId) => {
    const batch = batchMap?.[batchId];
    return batch ? batch.name : "Unknown Batch";
  })

  return (
    <div className={'min-h-screen'}>
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0"></div>
        <div className="absolute inset-0 "></div>

        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className={theme === 'light' ? 'absolute top-10 right-10 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-xl animate-pulse' : 'absolute top-10 right-10 w-64 h-64 bg-gray-600 rounded-full mix-blend-overlay filter blur-xl animate-pulse'}></div>
          <div className={theme === 'light' ? 'absolute bottom-10 left-10 w-80 h-80 bg-blue-300 rounded-full mix-blend-overlay filter blur-xl animate-pulse delay-1000' : 'absolute bottom-10 left-10 w-80 h-80 bg-blue-800 rounded-full mix-blend-overlay filter blur-xl animate-pulse delay-1000'}></div>
        </div>

        <div className="relative z-10 px-6 py-16">
          <div className="max-w-6xl mx-auto">
            {/* Enhanced Navigation */}
            <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">

              <BackButton />

              <div className="flex flex-col md:flex-row gap-4">
                {canEditUser && (<button
                  disabled={!canEditUser}
                  className={theme === 'light' ? 'group inline-flex items-center space-x-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-blue-600 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-md border border-emerald-400/30 hover:border-emerald-400/50 hover:scale-105' : 'group inline-flex items-center space-x-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-md border border-emerald-400/30 hover:border-emerald-400/50 hover:scale-105'}
                  onClick={() => navigate(`/institute/user-edit/${userId}`)}
                >
                  <Edit className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  {/* <span>Edit User</span> */}
                </button>)}
                {canDeleteUser && (<button
                  disabled={!canDeleteUser}
                  className="group inline-flex items-center space-x-3 bg-red-500/20 hover:bg-red-500/30 text-red-600 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-md border border-red-400/30 hover:border-red-400/50 hover:scale-105"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <Trash className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {/* <span>Delete User</span> */}
                </button>)}
              </div>
            </div>

            {/* Enhanced Profile Header */}
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div className={theme === 'light' ? 'w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-xl backdrop-blur-sm' : 'w-32 h-32 rounded-full overflow-hidden border-4 border-gray-600/30 shadow-xl backdrop-blur-sm'}>
                  <img
                    src={userData.profilePhoto}
                    alt={userData.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                                    <Crown className="w-6 h-6 text-white" />
                                </div> */}
              </div>
              <h1 className={theme === 'light' ? 'text-5xl font-black text-indigo-600 mb-2 tracking-tight' : 'text-5xl font-black text-indigo-400 mb-2 tracking-tight'}>
                {userData.name}
              </h1>
              <p className={theme === 'light' ? 'text-indigo-600 text-xl font-light' : 'text-indigo-400 text-xl font-light'}>
                <span className={theme === 'light' ? 'text-indigo-800 font-semibold' : 'text-indigo-300 font-semibold'}>{userData.name}'s</span> Complete Profile Overview
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-20">
        <div className={theme === 'light' ? 'bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden group hover:shadow-3xl transition-all duration-500' : 'bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50 overflow-hidden group hover:shadow-3xl transition-all duration-500'}>
          <div className={theme === 'light' ? 'bg-gradient-to-r from-indigo-600 to-blue-600 p-6' : 'bg-gradient-to-r from-indigo-700 to-blue-700 p-6'}>
            <h2 className="text-2xl font-bold text-white flex items-center">
              Personal Information
              <div className="ml-auto bg-white/20 px-4 py-1 rounded-xl">
                <span className="text-sm font-semibold">{batchNames.length} Batches</span>
              </div>
            </h2>
          </div>

          <div className="p-8 space-y-6">
            {/* User ID */}
            <div className={theme === 'light' ? 'group/item hover:bg-blue-50 p-4 rounded-2xl transition-all duration-300 border border-transparent hover:border-blue-200' : 'group/item hover:bg-gray-700 p-4 rounded-2xl transition-all duration-300 border border-transparent hover:border-gray-600'}>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                  <Hash className={theme === 'light' ? 'w-6 h-6 text-indigo-600' : 'w-6 h-6 text-indigo-400'} />
                </div>
                <div className="flex-1">
                  <p className={theme === 'light' ? 'text-sm font-medium text-gray-500 uppercase tracking-wide' : 'text-sm font-medium text-gray-400 uppercase tracking-wide'}>User ID</p>
                  <p className={theme === 'light' ? 'text-lg font-bold text-gray-800 mt-1' : 'text-lg font-bold text-gray-200 mt-1'}>{userData._id}</p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className={theme === 'light' ? 'group/item hover:bg-green-50 p-4 rounded-2xl transition-all duration-300 border border-transparent hover:border-green-200' : 'group/item hover:bg-gray-700 p-4 rounded-2xl transition-all duration-300 border border-transparent hover:border-green-600'}>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                  <Mail className={theme === 'light' ? 'w-6 h-6 text-indigo-500' : 'w-6 h-6 text-indigo-400'} />
                </div>
                <div className="flex-1">
                  <p className={theme === 'light' ? 'text-sm font-medium text-gray-500 uppercase tracking-wide' : 'text-sm font-medium text-gray-400 uppercase tracking-wide'}>Email Address</p>
                  <p className={theme === 'light' ? 'text-lg font-bold text-gray-800 mt-1' : 'text-lg font-bold text-gray-200 mt-1'}>{userData.email}</p>
                </div>
              </div>
            </div>

            {/* Gender */}
            <div className={theme === 'light' ? 'group/item hover:bg-purple-50 p-4 rounded-2xl transition-all duration-300 border border-transparent hover:border-purple-200' : 'group/item hover:bg-gray-700 p-4 rounded-2xl transition-all duration-300 border border-transparent hover:border-purple-600'}>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                  <User className={theme === 'light' ? 'w-6 h-6 text-indigo-600' : 'w-6 h-6 text-indigo-400'} />
                </div>
                <div className="flex-1">
                  <p className={theme === 'light' ? 'text-sm font-medium text-gray-500 uppercase tracking-wide' : 'text-sm font-medium text-gray-400 uppercase tracking-wide'}>Gender</p>
                  <p className={theme === 'light' ? 'text-lg font-bold text-gray-800 mt-1 capitalize' : 'text-lg font-bold text-gray-200 mt-1 capitalize'}>{userData.gender}</p>
                </div>
              </div>
            </div>

            {/* Batch List */}
            <p className={theme === 'light' ? 'font-semibold text-2xl text-indigo-600' : 'font-semibold text-2xl text-indigo-400'}> Batch Assignments</p>
            {batchNames.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-1">
                {batchNames.map((batchName, index) => (
                  <div
                    key={index}
                    className={theme === 'light' ? 'group relative overflow-hidden border border-indigo-600 text-indigo-600 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105' : 'group relative overflow-hidden border border-indigo-400 text-indigo-400 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gray-800/50'}
                  >
                    <div className={theme === 'light' ? 'absolute inset-0 bg-gradient-to-r from-white/0 to-white/10 group-hover:from-white/10 group-hover:to-white/20 transition-all duration-300' : 'absolute inset-0 bg-gradient-to-r from-gray-800/0 to-gray-700/10 group-hover:from-gray-700/10 group-hover:to-gray-600/20 transition-all duration-300'}></div>
                    <div className="relative flex items-center space-x-3">

                      <div className="flex-1">
                        <p className="font-bold text-lg">{batchName}</p>
                        <p className={theme === 'light' ? 'text-indigo-500 text-sm' : 'text-indigo-300 text-sm'}>Active Batch</p>
                      </div>
                    </div>
                    <div className={theme === 'light' ? 'absolute -bottom-2 -right-2 w-16 h-16 bg-white/10 rounded-full opacity-20 group-hover:opacity-40 transition-opacity' : 'absolute -bottom-2 -right-2 w-16 h-16 bg-gray-600/10 rounded-full opacity-20 group-hover:opacity-40 transition-opacity'}></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className={theme === 'light' ? 'w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4' : 'w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4'}>
                  <Users className={theme === 'light' ? 'w-10 h-10 text-gray-400' : 'w-10 h-10 text-gray-500'} />
                </div>
                <h3 className={theme === 'light' ? 'text-lg font-bold text-gray-700 mb-1' : 'text-lg font-bold text-gray-300 mb-1'}>No Batches Assigned</h3>
                <p className={theme === 'light' ? 'text-gray-500 text-sm' : 'text-gray-400 text-sm'}>This user hasn't been assigned to any batches yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Enhanced Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={theme === 'light' ? 'bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden' : 'bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden'}>
            <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">Confirm Deletion</h3>
            </div>
            <div className="p-8 text-center">
              <p className={theme === 'light' ? 'text-gray-600 text-lg mb-8' : 'text-gray-300 text-lg mb-8'}>
                Are you sure you want to delete <span className={theme === 'light' ? 'font-bold text-gray-800' : 'font-bold text-gray-100'}>{userData.name}</span>? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  className={theme === 'light' ? 'flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105' : 'flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105'}
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <DeleteUserModal
                  userId={userId}
                  setShowDeleteModal={setShowDeleteModal}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserViewPage