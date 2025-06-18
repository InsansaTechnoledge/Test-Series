import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCachedUser } from '../../../../../hooks/useCachedUser';
import { useCachedRoleGroup } from '../../../../../hooks/useCachedRoleGroup';
import { useCachedBatches } from '../../../../../hooks/useCachedBatches';
import { User, Mail, Users, BookOpen, Shield, Hash, Edit, Trash, ArrowLeft, Crown, Sparkles, Calendar, MapPin } from 'lucide-react';
import BackButton from '../../../../constants/BackButton';
import { useState } from 'react';
import DeleteUserModal from '../../../utility/DeleteUserModal';

const UserViewPage = () => {
    const location = useLocation();
    const userId = location.state.userId

    const { userMap } = useCachedUser();
    const { roleMap } = useCachedRoleGroup();
    const { batchMap } = useCachedBatches();
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const userData = userMap[userId]

    console.log(userData)
    const batchNames = userData.batch.map((batchId) => {
        const batch = batchMap[batchId];
        return batch ? batch.name : "Unknown Batch";
    })

    console.log(userMap[userId])
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Enhanced Header Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                
                {/* Animated background elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-xl animate-pulse"></div>
                    <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-300 rounded-full mix-blend-overlay filter blur-xl animate-pulse delay-1000"></div>
                </div>

                <div className="relative z-10 px-6 py-16">
                    <div className="max-w-6xl mx-auto">
                        {/* Enhanced Navigation */}
                        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
                            <button
                                onClick={() => navigate(-1)}
                                className="group inline-flex items-center space-x-3 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-md border border-white/20 hover:border-white/40 hover:scale-105"
                            >
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                <span>Back</span>
                            </button>

                            <div className="flex flex-col md:flex-row gap-4">
                                <button 
                                    className="group inline-flex items-center space-x-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-md border border-emerald-400/30 hover:border-emerald-400/50 hover:scale-105"
                                    onClick={() => navigate(`/institute/user-edit/${userId}`)}
                                >
                                    <Edit className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    <span>Edit User</span>
                                </button>
                                <button 
                                    className="group inline-flex items-center space-x-3 bg-red-500/20 hover:bg-red-500/30 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 backdrop-blur-md border border-red-400/30 hover:border-red-400/50 hover:scale-105"
                                    onClick={() => setShowDeleteModal(true)}
                                >
                                    <Trash className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span>Delete User</span>
                                </button>
                            </div>
                        </div>

                        {/* Enhanced Profile Header */}
                        <div className="text-center">
                            <div className="relative inline-block mb-6">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl backdrop-blur-sm">
                                    <img 
                                        src={userData.profilePhoto} 
                                        alt={userData.name} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                                    <Crown className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <h1 className="text-5xl font-black text-white mb-2 tracking-tight">
                                {userData.name}
                            </h1>
                            <p className="text-blue-100 text-xl font-medium">
                                <span className="text-yellow-300">{userData.name}'s</span> Complete Profile Overview
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Main Content */}
            <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-20">
                {/* Enhanced Profile Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Enhanced Personal Information Card */}
                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden group hover:shadow-3xl transition-all duration-500">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
                            <h2 className="text-2xl font-bold text-white flex items-center">
                                <div className="p-2 bg-white/20 rounded-xl mr-3 backdrop-blur-sm">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                                Personal Information
                            </h2>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="group/item hover:bg-blue-50 p-4 rounded-2xl transition-all duration-300 border border-transparent hover:border-blue-200">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <Hash className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">User ID</p>
                                        <p className="text-lg font-bold text-gray-800 mt-1">{userData._id}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="group/item hover:bg-green-50 p-4 rounded-2xl transition-all duration-300 border border-transparent hover:border-green-200">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <Mail className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Email Address</p>
                                        <p className="text-lg font-bold text-gray-800 mt-1">{userData.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="group/item hover:bg-purple-50 p-4 rounded-2xl transition-all duration-300 border border-transparent hover:border-purple-200">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Gender</p>
                                        <p className="text-lg font-bold text-gray-800 mt-1 capitalize">{userData.gender}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Role & Access Card */}
                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden group hover:shadow-3xl transition-all duration-500">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6">
                            <h2 className="text-2xl font-bold text-white flex items-center">
                                <div className="p-2 bg-white/20 rounded-xl mr-3 backdrop-blur-sm">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                Role & Access
                            </h2>
                        </div>
                        <div className="p-8">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl opacity-60"></div>
                                <div className="relative p-8 text-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                        <Crown className="w-8 h-8 text-white" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Assigned Role Group</p>
                                    <p className="text-2xl font-black text-gray-800">
                                        {roleMap[userData.roleId].name}
                                    </p>
                                    <div className="mt-4 inline-flex items-center space-x-2 bg-white/80 px-4 py-2 rounded-full">
                                        <Sparkles className="w-4 h-4 text-purple-500" />
                                        <span className="text-sm font-medium text-purple-700">Active Status</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Batch Information Card */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden mb-8 hover:shadow-3xl transition-all duration-500">
                    <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-6">
                        <h2 className="text-2xl font-bold text-white flex items-center">
                            <div className="p-2 bg-white/20 rounded-xl mr-3 backdrop-blur-sm">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            Batch Assignments
                            <div className="ml-auto bg-white/20 px-4 py-2 rounded-full">
                                <span className="text-sm font-semibold">{batchNames.length} Batches</span>
                            </div>
                        </h2>
                    </div>
                    <div className="p-8">
                        {batchNames.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {batchNames.map((batchName, index) => (
                                    <div
                                        key={index}
                                        className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-700 text-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10 group-hover:from-white/10 group-hover:to-white/20 transition-all duration-300"></div>
                                        <div className="relative flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                                <Users className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-lg">{batchName}</p>
                                                <p className="text-blue-100 text-sm">Active Batch</p>
                                            </div>
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white/10 rounded-full opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Users className="w-12 h-12 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-700 mb-2">No Batches Assigned</h3>
                                <p className="text-gray-500">This user hasn't been assigned to any batches yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Enhanced Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
                        <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 text-center">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white">Confirm Deletion</h3>
                        </div>
                        <div className="p-8 text-center">
                            <p className="text-gray-600 text-lg mb-8">
                                Are you sure you want to delete <span className="font-bold text-gray-800">{userData.name}</span>? This action cannot be undone.
                            </p>
                            <div className="flex space-x-4">
                                <button
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
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