import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCachedUser } from '../../../../../hooks/useCachedUser';
import { useCachedRoleGroup } from '../../../../../hooks/useCachedRoleGroup';
import { useCachedBatches } from '../../../../../hooks/useCachedBatches';
import { User, Mail, Users, BookOpen, Shield, Hash, Edit, Trash } from 'lucide-react';
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
        <div className=" p-6">


            <div className="max-w-4xl mx-auto">
                <div className='flex flex-col lg:flex-row justify-between gap-4 mb-5'>

                    <div className='my-auto'>
                        <BackButton />
                    </div>
                    <div className='flex flex-col md:flex-row gap-4'>
                        <button className='hover:bg-gray-300 hover:cursor-pointer flex bg-gray-100 px-4 py-2 rounded-md gap-2'
                            onClick={() => navigate(`/institute/user-edit/${userId}`)}>
                            <span>
                                Edit User
                            </span>
                            <div>
                                <Edit />
                            </div>
                        </button>
                        <button className='hover:bg-gray-300 hover:cursor-pointer flex bg-gray-100 px-4 py-2 rounded-md gap-2'
                            onClick={() => {
                                setShowDeleteModal(true);

                            }}>
                            <span>
                                Delete User
                            </span>
                            <div>
                                <Trash />
                            </div>
                        </button>

                        {/* <select className='rounded-md bg-white py-2 px-4'
                                onChange={(e) => setSelectedYear(e.target.value)}>
                                <option value={""}>--select year--</option>
                                {uniqueYears.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}

                            </select> */}

                    </div>
                </div>

                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl border border-blue-100 mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-32 relative">
                        <div className="absolute -bottom-12 left-8">
                            {/* <User className="w-12 h-12 text-blue-600" /> */}
                            <img src={userData.profilePhoto} alt="" />
                        </div>
                    </div>
                    <div className="pt-16 pb-8 px-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            {userData.name}
                        </h1>
                        <p className="text-blue-600 font-medium"><span className='text-red-400'>{userData.name}'s</span> Profile Overview</p>
                    </div>
                </div>

                {/* Profile Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-shadow duration-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <User className="w-5 h-5 text-blue-600 mr-2" />
                            Personal Information
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                                <Hash className="w-4 h-4 text-blue-600 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-500">User ID</p>
                                    <p className="font-medium text-gray-800">{userData._id}</p>
                                </div>
                            </div>
                            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                                <Mail className="w-4 h-4 text-blue-600 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-500">Email Address</p>
                                    <p className="font-medium text-gray-800">{userData.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                                <User className="w-4 h-4 text-blue-600 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-500">Gender</p>
                                    <p className="font-medium text-gray-800 capitalize">{userData.gender}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Role & Access */}
                    <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-shadow duration-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <Shield className="w-5 h-5 text-blue-600 mr-2" />
                            Role & Access
                        </h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-l-4 border-blue-500">
                                <p className="text-sm text-gray-500 mb-1">Assigned Role Group</p>
                                <p className="font-semibold text-blue-700 text-lg">
                                    {roleMap[userData.roleId].name}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Batch Information */}
                    <div className="md:col-span-2 bg-white rounded-xl shadow-lg border border-blue-100 p-6 hover:shadow-xl transition-shadow duration-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
                            Batch Assignment
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {batchNames.map((batchName, index) => (
                                <div
                                    key={index}
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                                >
                                    <div className="flex items-center">
                                        <Users className="w-4 h-4 mr-2" />
                                        <span className="font-medium">{batchName}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {batchNames.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>No batches assigned</p>
                            </div>
                        )}
                    </div>
                </div>
                {showDeleteModal && (
                    <DeleteUserModal
                        userId={userId}
                        setShowDeleteModal={setShowDeleteModal}
                    />
                )}

            </div>
        </div>
    )
}

export default UserViewPage
